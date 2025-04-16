package jets.projects.admin_user.purchaseHistory;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

@WebServlet("/receipts/*")
public class ReceiptDownloadServlet extends HttpServlet {
    private static final String RECEIPT_DIR = "C:\\Users\\ibrah\\OneDrive\\Desktop\\Tools\\apache-tomcat-10.1.39\\webapps\\ITI-Jets-EcommApplication\\receipts\\";

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String fileName = request.getPathInfo() != null ? request.getPathInfo().substring(1) : "";
        if (fileName.isEmpty() || !fileName.endsWith(".pdf")) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid file name");
            return;
        }

        File file = new File(RECEIPT_DIR + fileName);
        if (!file.exists() || !file.isFile()) {
            response.sendError(HttpServletResponse.SC_NOT_FOUND, "Receipt not found");
            return;
        }

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
        response.setContentLengthLong(file.length());

        try (FileInputStream in = new FileInputStream(file);
             OutputStream out = response.getOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
        } catch (IOException e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error serving receipt");
        }
    }
}