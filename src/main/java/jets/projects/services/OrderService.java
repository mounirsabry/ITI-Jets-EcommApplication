package jets.projects.services;

import jets.projects.dao.BookDao;
import jets.projects.dao.CartItemDao;
import jets.projects.dao.OrderDao;
import jets.projects.dao.UserDao;
import jets.projects.client_dto.CreditCardDetailsDto;
import jets.projects.client_dto.OrderDto;
import jets.projects.client_dto.OrderItemDto;
import jets.projects.entity.*;
import jets.projects.exceptions.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

public class OrderService {
    private final OrderDao orderDao;
    private final CartItemDao cartItemDao;
    private final CartService cartService;
    private final BookDao bookDao;
    private final UserDao userDao;
    private static final Pattern CARD_NUMBER_PATTERN = Pattern.compile("^\\d{4}-\\d{4}-\\d{4}-\\d{4}$");
    private static final Pattern CVC_PATTERN = Pattern.compile("^\\d{3}$");

    public OrderService() {
        this.orderDao = new OrderDao();
        this.cartService = new CartService();
        this.bookDao = new BookDao();
        this.userDao = new UserDao();
        this.cartItemDao = new CartItemDao();
    }

    private OrderDto convertToDto(BookOrder order) {
        OrderDto dto = new OrderDto();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setDate(order.getOrderDate());
        dto.setAddress(order.getAddress());
        dto.setPaymentMethod(order.getMethod().getMethod());
        dto.setShippingFee(order.getShippingCost());
        List<OrderItemDto> itemDtos = order.getOrderItems().stream()
                .map(item -> {
                    OrderItemDto itemDto = new OrderItemDto();
                    itemDto.setBookId(item.getBook().getBookId());
                    itemDto.setQuantity(item.getQuantity());
                    itemDto.setPriceAtPurchase(item.getPrice());
                    return itemDto;
                })
                .collect(Collectors.toList());
        dto.setOrderItems(itemDtos);
        dto.setStatus(order.getOrderItems().get(0).getStatus().name());
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

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            if (!book.getIsAvailable() || book.getStock() < item.getQuantity()) {
                throw new OutOfStockException("Book ID " + book.getBookId() + " is out of stock or insufficient quantity");
            }
            BigDecimal itemTotal = book.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .multiply(BigDecimal.ONE.subtract(book.getDiscountPercentage().divide(BigDecimal.valueOf(100))));
            total = total.add(itemTotal);
        }

        BigDecimal shippingFee = cartService.getShippingFee(userId);
        total = total.add(shippingFee);

        if (user.getBalance().compareTo(total) < 0) {
            throw new OperationFailedException("Insufficient account balance");
        }

        BookOrder order = createOrder(user, cartItems, address, "ACCOUNT_BALANCE", shippingFee);
        user.setBalance(user.getBalance().subtract(total));
        try {
            for (CartItem item : cartItems) {
                Book book = item.getBook();
                book.setStock(book.getStock() - item.getQuantity());
                book.setSoldCount(book.getSoldCount() + item.getQuantity());
                bookDao.update(book);
            }
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

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Book book = item.getBook();
            if (!book.getIsAvailable() || book.getStock() < item.getQuantity()) {
                throw new OutOfStockException("Book ID " + book.getBookId() + " is out of stock or insufficient quantity");
            }
            BigDecimal itemTotal = book.getPrice()
                    .multiply(BigDecimal.valueOf(item.getQuantity()))
                    .multiply(BigDecimal.ONE.subtract(book.getDiscountPercentage().divide(BigDecimal.valueOf(100))));
            total = total.add(itemTotal);
        }

        BigDecimal shippingFee = cartService.getShippingFee(userId);
        total = total.add(shippingFee);

        BookOrder order = createOrder(user, cartItems, address, "CREDIT_CARD", shippingFee);
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

        List<OrderItem> orderItems = cartItems.stream()
                .map(item -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setBook(item.getBook());
                    orderItem.setQuantity((long) item.getQuantity());
                    orderItem.setPrice(item.getBook().getPrice()
                            .multiply(BigDecimal.ONE.subtract(item.getBook().getDiscountPercentage().divide(BigDecimal.valueOf(100)))));
                    orderItem.setDiscountPercentage(item.getBook().getDiscountPercentage());
                    orderItem.setStatus(Status.PENDING);
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
}