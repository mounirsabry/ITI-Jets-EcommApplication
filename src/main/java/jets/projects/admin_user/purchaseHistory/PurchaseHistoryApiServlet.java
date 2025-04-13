package jets.projects.admin_user.purchaseHistory;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Random;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.beans.ReceiptBean;
import jets.projects.dto.PurchaseHistoryDTO;
import jets.projects.dto.ReceiptDTO;

public class PurchaseHistoryApiServlet extends HttpServlet {
    private static final int TOTAL_DUMMY_RECORDS = 50;
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");
    private static final Gson gson = new GsonBuilder().create();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("PurchaseHistoryApiServlet doGet, params: page=" + request.getParameter("page") +
                ", size=" + request.getParameter("size") + ", dateFrom=" + request.getParameter("dateFrom") +
                ", dateTo=" + request.getParameter("dateTo") + ", search=" + request.getParameter("search"));

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        int page = Integer.parseInt(request.getParameter("page") != null ? request.getParameter("page") : "1");
        int size = Integer.parseInt(request.getParameter("size") != null ? request.getParameter("size") : "10");
        String dateFrom = request.getParameter("dateFrom");
        String dateTo = request.getParameter("dateTo");
        String search = request.getParameter("search");

        List<ReceiptBean> allReceipts = generateDummyReceipts();
        List<ReceiptBean> filteredReceipts = filterReceipts(allReceipts, dateFrom, dateTo, search);

        int totalRecords = filteredReceipts.size();
        int totalPages = (int) Math.ceil((double) totalRecords / size);
        int startIndex = (page - 1) * size;
        int endIndex = Math.min(startIndex + size, totalRecords);

        List<ReceiptBean> paginatedReceipts = filteredReceipts.subList(startIndex, endIndex);
        List<ReceiptDTO> paginatedDTOs = paginatedReceipts.stream().map(this::mapToDTO).toList();

        int totalPurchases = filteredReceipts.size();
        double totalRevenue = filteredReceipts.stream()
                .mapToDouble(ReceiptBean::getTotalPaid)
                .sum();
        long uniqueCustomers = filteredReceipts.stream()
                .map(ReceiptBean::getUserId)
                .distinct()
                .count();

        PurchaseHistoryDTO jsonResponse = new PurchaseHistoryDTO(
                paginatedDTOs, totalPages, totalPurchases, totalRevenue, uniqueCustomers
        );

        String jsonOutput = gson.toJson(jsonResponse);
        System.out.println("PurchaseHistoryApiServlet response: " + jsonOutput);

        PrintWriter out = response.getWriter();
        out.print(jsonOutput);
        out.flush();
    }

    private List<ReceiptBean> generateDummyReceipts() {
        System.out.println("Generating " + TOTAL_DUMMY_RECORDS + " dummy receipts");
        List<ReceiptBean> receipts = new ArrayList<>();
        Random random = new Random();
        String[] userNames = {"John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"};
        String[] userEmails = {"john@example.com", "jane@example.com", "alice@example.com", "bob@example.com"};

        for (int i = 1; i <= TOTAL_DUMMY_RECORDS; i++) {
            ReceiptBean receipt = new ReceiptBean();
            receipt.setId(i);
            receipt.setUserId(random.nextInt(4) + 1);
            int userIndex = random.nextInt(userNames.length);
            receipt.setUserName(userNames[userIndex]);
            receipt.setUserEmail(userEmails[userIndex]);
            long randomDate = System.currentTimeMillis() - (random.nextInt(90) * 24 * 60 * 60 * 1000L);
            receipt.setDate(new Date(randomDate));
            receipt.setTotalPaid(10 + (random.nextDouble() * 90));
            receipts.add(receipt);
        }
        System.out.println("Generated receipts: " + receipts.size());
        return receipts;
    }

    private List<ReceiptBean> filterReceipts(List<ReceiptBean> receipts, String dateFrom, String dateTo, String search) {
        List<ReceiptBean> filtered = new ArrayList<>(receipts);

        if (dateFrom != null && !dateFrom.isEmpty()) {
            try {
                Date from = DATE_FORMAT.parse(dateFrom);
                filtered.removeIf(r -> r.getDate().compareTo(from) < 0);
            } catch (Exception ignored) {
            }
        }
        if (dateTo != null && !dateTo.isEmpty()) {
            try {
                Date to = DATE_FORMAT.parse(dateTo);
                filtered.removeIf(r -> r.getDate().compareTo(to) > 0);
            } catch (Exception ignored) {}
        }
        if (search != null && !search.isEmpty()) {
            String searchLower = search.toLowerCase();
            filtered.removeIf(r ->
                    !r.getUserName().toLowerCase().contains(searchLower) &&
                            !String.valueOf(r.getId()).contains(searchLower)
            );
        }
        System.out.println("Filtered receipts: " + filtered.size());
        return filtered;
    }

    private ReceiptDTO mapToDTO(ReceiptBean bean) {
        if (bean == null) {
            System.out.println("ReceiptBean is null in mapToDTO");
            return new ReceiptDTO(0, 0, "Unknown", "N/A", null, 0.0);
        }
        return new ReceiptDTO(
                bean.getId(),
                bean.getUserId(),
                bean.getUserName() != null ? bean.getUserName() : "Unknown",
                bean.getUserEmail() != null ? bean.getUserEmail() : "N/A",
                bean.getDate(),
                bean.getTotalPaid()
        );
    }
}