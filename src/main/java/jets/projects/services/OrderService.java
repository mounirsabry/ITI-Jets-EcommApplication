package jets.projects.services;

import jets.projects.client_dto.ClientOrderDto;
import jets.projects.dao.BookDao;
import jets.projects.dao.CartItemDao;
import jets.projects.dao.OrderDao;
import jets.projects.dao.PurchaseHistoryDao;
import jets.projects.dao.UserDao;
import jets.projects.client_dto.CreditCardDetailsDto;
import jets.projects.client_dto.OrderDto;
import jets.projects.entity.Book;
import jets.projects.entity.BookOrder;
import jets.projects.entity.CartItem;
import jets.projects.entity.OrderItem;
import jets.projects.entity.PaymentMethod;
import jets.projects.entity.PurchaseHistory;
import jets.projects.entity.Status;
import jets.projects.entity.User;
import jets.projects.exceptions.InvalidInputException;
import jets.projects.exceptions.NotFoundException;
import jets.projects.exceptions.OperationFailedException;
import jets.projects.exceptions.OutOfStockException;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import java.io.File;

public class OrderService {
    private final OrderDao orderDao;
    private final CartItemDao cartItemDao;
    private final CartService cartService;
    private final BookDao bookDao;
    private final UserDao userDao;
    private final PurchaseHistoryDao purchaseHistoryDao;
    private static final Pattern CARD_NUMBER_PATTERN = Pattern.compile("^\\d{4}-\\d{4}-\\d{4}-\\d{4}$");
    private static final Pattern CVC_PATTERN = Pattern.compile("^\\d{3}$");
    private static final BigDecimal FIXED_SHIPPING_COST = new BigDecimal("28.00");
    private static final String RECEIPT_DIR = "C:\\Users\\ibrah\\OneDrive\\Desktop\\Tools\\apache-tomcat-10.1.39\\webapps\\ITI-Jets-EcommApplication\\receipts\\";
    private static final String RECEIPT_URL_PREFIX = "/ITI-Jets-EcommApplication/receipts/";

    public OrderService() {
        this.orderDao = new OrderDao();
        this.cartService = new CartService();
        this.bookDao = new BookDao();
        this.userDao = new UserDao();
        this.cartItemDao = new CartItemDao();
        this.purchaseHistoryDao = new PurchaseHistoryDao();
        new File(RECEIPT_DIR).mkdirs();
    }

    private OrderDto convertToDto(BookOrder order) {
        OrderDto dto = new OrderDto();
        dto.setId(String.valueOf(order.getOrderId()));
        dto.setDate(order.getOrderDate().toString());

        OrderDto.CustomerDto customer = new OrderDto.CustomerDto();
        customer.setName(order.getUser().getUsername());
        customer.setEmail(order.getUser().getEmail());
        customer.setPhone(order.getUser().getPhoneNumber());
        customer.setAddress(order.getAddress());
        dto.setCustomer(customer);

        List<OrderDto.OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> {
                    OrderDto.OrderItemDto itemDto = new OrderDto.OrderItemDto();
                    itemDto.setBook(item.getBook().getTitle());
                    itemDto.setPrice(item.getPrice());
                    itemDto.setQuantity(item.getQuantity().intValue());
                    itemDto.setTotal(item.getPrice().multiply(new BigDecimal(item.getQuantity())));
                    return itemDto;
                })
                .collect(Collectors.toList());
        dto.setItems(itemDtos);

        BigDecimal subtotal = itemDtos.stream()
                .map(OrderDto.OrderItemDto::getTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        dto.setSubtotal(subtotal);

        dto.setShipping(FIXED_SHIPPING_COST);

        BigDecimal total = subtotal.add(FIXED_SHIPPING_COST);
        dto.setTotal(total);

        dto.setStatus(order.getStatus().name());
        return dto;
    }

    public List<OrderDto> getOrders(Long userId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        List<BookOrder> orders = orderDao.findByUserId(userId);
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    public OrderDto getOrderDetails(Long userId, Long orderId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        if (orderId == null || orderId <= 0) {
            throw new InvalidInputException("Invalid order ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        BookOrder order = orderDao.findByUserIdAndOrderId(userId, orderId)
                .orElseThrow(() -> new NotFoundException("Order not found with ID: " + orderId + " for user ID: " + userId));
        return convertToDto(order);
    }

    public Long checkoutWithBalance(Long userId, String address) throws InvalidInputException, NotFoundException, OutOfStockException, OperationFailedException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        if (address == null || address.trim().isEmpty()) {
            throw new InvalidInputException("Address cannot be empty");
        }

        User user = userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        List<CartItem> cartItems = cartItemDao.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            if (!book.getIsAvailable() || book.getStock() < item.getQuantity()) {
                throw new OutOfStockException("Book ID " + book.getBookId() + " is out of stock or insufficient quantity");
            }
            BigDecimal itemTotal = book.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .multiply(BigDecimal.ONE.subtract(book.getDiscountPercentage().divide(BigDecimal.valueOf(100))));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal total = subtotal.add(FIXED_SHIPPING_COST);

        if (user.getBalance().compareTo(total) < 0) {
            throw new OperationFailedException("Insufficient account balance");
        }

        BookOrder order = createOrder(user, cartItems, address, "ACCOUNT_BALANCE", FIXED_SHIPPING_COST);
        try {
            for (CartItem item : cartItems) {
                Book book = item.getBook();
                book.setStock(book.getStock() - item.getQuantity());
                book.setSoldCount(book.getSoldCount() + item.getQuantity());
                bookDao.update(book);
            }
            user.setBalance(user.getBalance().subtract(total));
            userDao.update(user);
            orderDao.save(order);
            cartService.truncateCart(userId);
            return order.getOrderId();
        } catch (Exception e) {
            throw new OperationFailedException("Checkout failed", e);
        }
    }

    public Long checkoutWithCreditCard(Long userId, CreditCardDetailsDto creditCardDetails, String address)
            throws InvalidInputException, NotFoundException, OutOfStockException, OperationFailedException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        if (address == null || address.trim().isEmpty()) {
            throw new InvalidInputException("Address cannot be empty");
        }
        validateCreditCardDetails(creditCardDetails);

        User user = userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        List<CartItem> cartItems = cartItemDao.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new NotFoundException("Cart is empty");
        }

        BigDecimal subtotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            if (!book.getIsAvailable() || book.getStock() < item.getQuantity()) {
                throw new OutOfStockException("Book ID " + book.getBookId() + " is out of stock or insufficient quantity");
            }
            BigDecimal itemTotal = book.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .multiply(BigDecimal.ONE.subtract(book.getDiscountPercentage().divide(BigDecimal.valueOf(100))));
            subtotal = subtotal.add(itemTotal);
        }

        BigDecimal total = subtotal.add(FIXED_SHIPPING_COST);

        BookOrder order = createOrder(user, cartItems, address, "CREDIT_CARD", FIXED_SHIPPING_COST);
        try {
            for (CartItem item : cartItems) {
                Book book = item.getBook();
                book.setStock(book.getStock() - item.getQuantity());
                book.setSoldCount(book.getSoldCount() + item.getQuantity());
                bookDao.update(book);
            }
            orderDao.save(order);
            cartService.truncateCart(userId);
            return order.getOrderId();
        } catch (Exception e) {
            throw new OperationFailedException("Checkout failed", e);
        }
    }

    private BookOrder createOrder(User user, List<CartItem> cartItems, String address, String paymentMethod, BigDecimal shippingFee) {
        BookOrder order = new BookOrder();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setAddress(address);
        PaymentMethod method = new PaymentMethod();
        method.setMethod(paymentMethod);
        order.setMethod(method);
        order.setShippingCost(shippingFee);
        order.setStatus(Status.PENDING);

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setBook(item.getBook());
                    orderItem.setQuantity((long) item.getQuantity());
                    orderItem.setPrice(item.getBook().getPrice()
                            .multiply(BigDecimal.ONE.subtract(item.getBook().getDiscountPercentage().divide(BigDecimal.valueOf(100)))));
                    orderItem.setDiscountPercentage(item.getBook().getDiscountPercentage());
                    return orderItem;
                })
                .collect(Collectors.toList());
        order.setOrderItems(orderItems);
        return order;
    }

    private void validateCreditCardDetails(CreditCardDetailsDto details) throws InvalidInputException {
        if (details.getNameOnCard() == null || details.getNameOnCard().trim().isEmpty()) {
            throw new InvalidInputException("Name on card cannot be empty");
        }
        if (details.getCardNumber() == null || !CARD_NUMBER_PATTERN.matcher(details.getCardNumber()).matches()) {
            throw new InvalidInputException("Invalid card number format (expected: xxxx-xxxx-xxxx-xxxx)");
        }
        if (details.getExpiryDate() == null) {
            throw new InvalidInputException("Expiry date cannot be null");
        }
        LocalDate now = LocalDate.now();
        if (details.getExpiryDate().isBefore(now) || details.getExpiryDate().equals(now)) {
            throw new InvalidInputException("Expiry date must be in the future");
        }
        int month = details.getExpiryDate().getMonthValue();
        if (month < 1 || month > 12) {
            throw new InvalidInputException("Expiry month must be between 1 and 12");
        }
        if (details.getCvc() == null || !CVC_PATTERN.matcher(details.getCvc()).matches()) {
            throw new InvalidInputException("CVC must be a 3-digit number");
        }
    }

    public List<OrderDto> getAllOrders() {
        List<BookOrder> orders = orderDao.findAll();
        return orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private String generateReceiptPdf(BookOrder order, BigDecimal totalPaid) throws OperationFailedException {
        String fileName = "receipt_" + order.getOrderId() + "_" + System.currentTimeMillis() + ".pdf";
        String filePath = RECEIPT_DIR + fileName;
        String urlPath = RECEIPT_URL_PREFIX + fileName;

        try {
            PdfWriter writer = new PdfWriter(filePath);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            document.add(new Paragraph("Receipt for Order #" + order.getOrderId()));
            document.add(new Paragraph("Customer: " + order.getUser().getUsername()));
            document.add(new Paragraph("Date: " + LocalDateTime.now()));
            document.add(new Paragraph("Items:"));
            for (OrderItem item : order.getOrderItems()) {
                document.add(new Paragraph(
                        item.getBook().getTitle() + " - Quantity: " + item.getQuantity() +
                                " - Price: $" + item.getPrice() +
                                " - Total: $" + item.getPrice().multiply(new BigDecimal(item.getQuantity()))
                ));
            }
            document.add(new Paragraph("Subtotal: $" + totalPaid.subtract(FIXED_SHIPPING_COST)));
            document.add(new Paragraph("Shipping: $" + FIXED_SHIPPING_COST));
            document.add(new Paragraph("Total Paid: $" + totalPaid));

            document.close();
            return urlPath;
        } catch (Exception e) {
            throw new OperationFailedException("Failed to generate PDF for order ID: " + order.getOrderId(), e);
        }
    }

    public boolean updateOrderStatus(Long orderId, String status) throws InvalidInputException, NotFoundException, OperationFailedException {
        if (orderId == null || orderId <= 0) {
            throw new InvalidInputException("Invalid order ID");
        }
        if (status == null || status.trim().isEmpty()) {
            throw new InvalidInputException("Status cannot be empty");
        }

        BookOrder order = orderDao.findById(orderId)
                .orElseThrow(() -> new NotFoundException("Order not found with ID: " + orderId));

        try {
            Status newStatus;
            try {
                String normalizedStatus = status.trim().toUpperCase();
                if ("CANCELED".equals(normalizedStatus)) {
                    normalizedStatus = "CANCELLED";
                }
                newStatus = Status.valueOf(normalizedStatus);
            } catch (IllegalArgumentException e) {
                throw new InvalidInputException("Invalid status: " + status);
            }

            order.setStatus(newStatus);
            System.out.println("Order ID: " + orderId + ", Setting status: " + newStatus);

            if ("DELIVERED".equalsIgnoreCase(status)) {
                User user = order.getUser();
                if (user == null) {
                    throw new OperationFailedException("User not associated with order ID: " + orderId);
                }
                BigDecimal subtotal = order.getOrderItems().stream()
                        .map(item -> item.getPrice().multiply(new BigDecimal(item.getQuantity())))
                        .reduce(BigDecimal.ZERO, BigDecimal::add);
                if (subtotal == null) {
                    throw new OperationFailedException("Unable to calculate subtotal for order ID: " + orderId);
                }
                BigDecimal totalPaid = subtotal.add(FIXED_SHIPPING_COST);

                PurchaseHistory purchase = new PurchaseHistory();
                purchase.setUser(user);
                purchase.setPurchaseDatetime(LocalDateTime.now());
                purchase.setTotalPaid(totalPaid);
                String receiptUrl = generateReceiptPdf(order, totalPaid);
                purchase.setReceiptFileUrl(receiptUrl);
                System.out.println("Saving purchase history for order ID: " + orderId + ", Receipt URL: " + receiptUrl);
                try {
                    purchaseHistoryDao.save(purchase);
                } catch (Exception e) {
                    throw new OperationFailedException("Failed to save purchase history for order ID: " + orderId, e);
                }

                System.out.println("Deleting order ID: " + orderId);
                try {
                    orderDao.deleteById(orderId);
                } catch (Exception e) {
                    throw new OperationFailedException("Failed to delete order ID: " + orderId, e);
                }
            } else {
                System.out.println("Updating order status to " + newStatus + " for order ID: " + orderId);
                try {
                    orderDao.update(order);
                } catch (Exception e) {
                    throw new OperationFailedException("Failed to update order status to " + newStatus + " for order ID: " + orderId, e);
                }
            }
            return true;
        } catch (Exception e) {
            throw new OperationFailedException("Failed to process status update for order ID: " + orderId + ": " + e.getMessage(), e);
        }
    }

    private ClientOrderDto convertToClientDto(BookOrder order) {
        ClientOrderDto dto = new ClientOrderDto();
        dto.setOrderID(order.getOrderId());
        dto.setUserID(order.getUser().getUserId());
        dto.setDate(order.getOrderDate());
        dto.setAddress(order.getAddress());
        dto.setPaymentMethod(order.getMethod().getMethod());
        dto.setShippingFee(order.getShippingCost());
        dto.setStatus(order.getStatus().name());

        List<ClientOrderDto.OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> {
                    ClientOrderDto.OrderItemDto itemDto = new ClientOrderDto.OrderItemDto();
                    itemDto.setBookID(item.getBook().getBookId());
                    itemDto.setQuantity(item.getQuantity().intValue());
                    itemDto.setPriceAtPurchase(item.getPrice());
                    return itemDto;
                })
                .collect(Collectors.toList());
        dto.setOrderItems(itemDtos);

        return dto;
    }

    public ClientOrderDto getOrderDetailsForClient(Long userId, Long orderId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        if (orderId == null || orderId <= 0) {
            throw new InvalidInputException("Invalid order ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        BookOrder order = orderDao.findByUserIdAndOrderId(userId, orderId)
                .orElseThrow(() -> new NotFoundException("Order not found with ID: " + orderId + " for user ID: " + userId));
        return convertToClientDto(order);
    }

    public List<ClientOrderDto> getAllOrdersForClient(Long userId) throws InvalidInputException, NotFoundException {
        if (userId == null || userId <= 0) {
            throw new InvalidInputException("Invalid user ID");
        }
        userDao.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found with ID: " + userId));
        List<BookOrder> orders = orderDao.findByUserId(userId);
        return orders.stream()
                .map(this::convertToClientDto)
                .collect(Collectors.toList());
    }
}