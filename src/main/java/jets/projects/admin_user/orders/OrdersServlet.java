package jets.projects.admin_user.orders;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.dto.Customer;
import jets.projects.dto.Order;
import jets.projects.dto.OrderItem;


public class OrdersServlet extends HttpServlet 
{
    private static final Gson gson = new Gson();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
    {
        try {
            
            List<Order> orders = generateDummyOrders();
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(gson.toJson(orders));
        } catch (Exception e) 
        {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.setContentType("application/json");
            response.getWriter().write(gson.toJson(new ErrorResponse("Failed to fetch orders: " + e.getMessage())));
        }
    }

    private List<Order> generateDummyOrders() {
        Customer customer1 = new Customer("John Doe", "john@example.com", "123-456-7890", "123 Main St, City");
        Customer customer2 = new Customer("Jane Smith", "jane@example.com", "987-654-3210", "456 Oak Ave, Town");

        OrderItem item1 = new OrderItem("Book A", 29.99, 2, 59.98);
        OrderItem item2 = new OrderItem("Book B", 19.99, 1, 19.99);
        OrderItem item3 = new OrderItem("Book C", 39.99, 3, 119.97);

        Order order1 = new Order("ORD001", customer1, new Date(), 59.98, 5.00, 3.60, 68.58, "Pending", Arrays.asList(item1));
        Order order2 = new Order("ORD002", customer2, new Date(), 139.96, 7.00, 8.40, 155.36, "Shipped", Arrays.asList(item2, item3));

        return Arrays.asList(order1, order2);
    }

    // Error response DTO
    private static class ErrorResponse 
    {
        private String error;

        public ErrorResponse(String error) {
            this.error = error;
        }

        public String getError() {
            return error;
        }
    }
}