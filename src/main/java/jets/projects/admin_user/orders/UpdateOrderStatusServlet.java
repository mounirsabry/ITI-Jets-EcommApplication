package jets.projects.admin_user.orders;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
public class UpdateOrderStatusServlet extends HttpServlet 
{
    private static final Gson gson = new Gson();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        try {
            StringBuilder sb = new StringBuilder();
            try (BufferedReader reader = request.getReader()) 
            {
                String line;
                while ((line = reader.readLine()) != null) 
                    sb.append(line);
                
            }
            UpdateRequest updateRequest = gson.fromJson(sb.toString(), UpdateRequest.class);

           
            if (updateRequest.getOrderId() == null || updateRequest.getStatus() == null) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write(gson.toJson(new UpdateResponse(false, "Invalid order ID or status")));
                return;
            }

            boolean success = true; 
            String message = null;

            if (!"ORD001".equals(updateRequest.getOrderId()) && !"ORD002".equals(updateRequest.getOrderId())) {
                success = false;
                message = "Order not found";
            }

            response.getWriter().write(gson.toJson(new UpdateResponse(success, message)));
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write(gson.toJson(new UpdateResponse(false, "Failed to update status: " + e.getMessage())));
        }
    }

    // Request DTO
    private static class UpdateRequest 
    {
        private String orderId;
        private String status;

        public String getOrderId() {
            return orderId;
        }

        public String getStatus() {
            return status;
        }
    }

    // Response DTO
    private static class UpdateResponse 
    {
        private boolean success;
        private String message;

        public UpdateResponse(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }
    }
}