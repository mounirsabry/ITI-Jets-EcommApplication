package jets.projects.admin_user.purchaseHistory;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.beans.ReceiptBean;
import jets.projects.dto.ReceiptDTO;

public class ReceiptDetailsApiServlet extends HttpServlet {

    private static final Gson GSON = new GsonBuilder().create();
    private static final SimpleDateFormat DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd");

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        System.out.println("ReceiptDetailsApiServlet doGet, pathInfo: " + request.getPathInfo());
        String pathInfo = request.getPathInfo();
        if (pathInfo == null || pathInfo.length() <= 1) {
            System.out.println("Missing purchase ID");
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Missing purchase ID");
            return;
        }

        String idStr = pathInfo.substring(1);
        if (idStr.endsWith("/download")) {
            idStr = idStr.substring(0, idStr.length() - 9);
            int id;
            try {
                id = Integer.parseInt(idStr);
            } catch (NumberFormatException e) {
                System.out.println("Invalid purchase ID for download: " + idStr);
                response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid purchase ID");
                return;
            }
            serveDownload(request, response, id);
            return;
        }

        int id;
        try {
            id = Integer.parseInt(idStr);
        } catch (NumberFormatException e) {
            System.out.println("Invalid purchase ID: " + idStr);
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid purchase ID");
            return;
        }

        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        ReceiptBean receiptBean = generateDummyReceipt(id);
        if (receiptBean == null) {
            System.out.println("ReceiptBean is null for ID: " + id);
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Receipt not found");
            return;
        }
        System.out.println("Raw ReceiptBean: id=" + receiptBean.getId() +
                ", userName=" + receiptBean.getUserName() +
                ", userEmail=" + receiptBean.getUserEmail() +
                ", date=" + (receiptBean.getDate() != null ? DATE_FORMAT.format(receiptBean.getDate()) : "null") +
                ", totalPaid=" + receiptBean.getTotalPaid());

        ReceiptDTO receiptDTO = mapToDTO(receiptBean);
        String jsonOutput = GSON.toJson(receiptDTO);
        System.out.println("Returning receipt JSON: " + jsonOutput);

        PrintWriter out = response.getWriter();
        out.print(jsonOutput);
        out.flush();
    }

    private void serveDownload(HttpServletRequest request, HttpServletResponse response, int id) throws IOException {
        System.out.println("Serving download for receipt ID: " + id);
        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"receipt-" + id + ".pdf\"");
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

        try {
            ReceiptBean receipt = generateDummyReceipt(id);
            if (receipt == null) {
                System.out.println("ReceiptBean is null for download ID: " + id);
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Receipt not found");
                return;
            }
            byte[] pdfBytes = generateReceiptPDF(receipt);
            System.out.println("Generated PDF size: " + pdfBytes.length + " bytes");

            response.setContentLength(pdfBytes.length);
            response.getOutputStream().write(pdfBytes);
            response.getOutputStream().flush();
            System.out.println("Download response sent for receipt ID: " + id);
        } catch (IOException e) {
            System.out.println("IO error generating PDF for receipt ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate receipt PDF: IO error");
        } catch (Exception e) {
            System.out.println("Unexpected error generating PDF for receipt ID " + id + ": " + e.getMessage());
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Failed to generate receipt PDF: " + e.getMessage());
        }
    }

    private ReceiptBean generateDummyReceipt(int id) {
        System.out.println("Generating dummy receipt for ID: " + id);
        Random random = new Random(id); // Seed with ID for consistency
        String[] userNames = {"John Doe", "Jane Smith", "Alice Johnson", "Bob Brown"};
        String[] userEmails = {"john@example.com", "jane@example.com", "alice@example.com", "bob@example.com"};
        int userIndex = random.nextInt(userNames.length);

        ReceiptBean receipt = new ReceiptBean();
        receipt.setId(id);
        receipt.setUserId(random.nextInt(4) + 1);
        receipt.setUserName(userNames[userIndex]);
        receipt.setUserEmail(userEmails[userIndex]);
        long randomDate = System.currentTimeMillis() - (random.nextInt(90) * 24 * 60 * 60 * 1000L);
        receipt.setDate(new Date(randomDate));
        receipt.setTotalPaid(10 + (random.nextDouble() * 90));

        System.out.println("Dummy receipt generated: ID=" + id + ", userName=" + receipt.getUserName() +
                ", userEmail=" + receipt.getUserEmail() + ", totalPaid=" + receipt.getTotalPaid());
        return receipt;
    }

    private byte[] generateReceiptPDF(ReceiptBean receipt) throws IOException {
        System.out.println("Generating PDF for receipt ID: " + receipt.getId());
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);

            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
                contentStream.beginText();
                contentStream.newLineAtOffset(50, 750);
                contentStream.showText("BookStore Receipt");
                contentStream.endText();

                contentStream.setFont(PDType1Font.HELVETICA, 10);
                contentStream.beginText();
                contentStream.newLineAtOffset(50, 720);
                contentStream.showText("Receipt ID: " + receipt.getId());
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Date: " + (receipt.getDate() != null ? DATE_FORMAT.format(receipt.getDate()) : "N/A"));
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Customer: " + (receipt.getUserName() != null ? receipt.getUserName() : "Unknown"));
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Email: " + (receipt.getUserEmail() != null ? receipt.getUserEmail() : "N/A"));
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("Total Paid: $" + String.format("%.2f", receipt.getTotalPaid()));
                contentStream.endText();

                contentStream.beginText();
                contentStream.newLineAtOffset(50, 650);
                contentStream.showText("Items Purchased:");
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("- The Great Gatsby: $20.00");
                contentStream.newLineAtOffset(0, -15);
                contentStream.showText("- 1984: $15.00");
                contentStream.endText();

                contentStream.moveTo(50, 700);
                contentStream.lineTo(550, 700);
                contentStream.stroke();
            }

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            System.out.println("PDF generation completed for receipt ID: " + receipt.getId());
            return baos.toByteArray();
        } catch (IOException e) {
            System.out.println("IO error in PDF generation for receipt ID " + receipt.getId() + ": " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.out.println("Unexpected error in PDF generation for receipt ID " + receipt.getId() + ": " + e.getMessage());
            throw new IOException("Failed to generate PDF", e);
        }
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