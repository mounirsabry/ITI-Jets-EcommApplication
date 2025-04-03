package jets.projects.admin_user;

import java.io.IOException;
import java.io.PrintWriter;

import com.google.gson.Gson;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.beans.UserBean;

public class AdminUsers extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        System.out.println("welcome in admin users");

        PrintWriter out = response.getWriter();
        Gson gsonUser = new Gson();

        UserBean[] users = {
            new UserBean(1, "John", "Doe", "john.doe@example.com",
            "555-123-4567", "123 Main St, Anytown, CA 12345", "2023-01-15", 3),
            new UserBean(2, "Jane", "Smith", "jane.smith@example.com",
            "555-987-6543", "456 Oak Ave, Somewhere, NY 67890", "2023-01-20", 2),
            new UserBean(3, "Robert", "Johnson", "robert.johnson@example.com",
            "555-456-7890", "789 Pine St, Elsewhere, TX 54321", "2023-02-05", 1),
            new UserBean(4, "Emily", "Davis", "emily.davis@example.com",
            "555-789-0123", "321 Maple Rd, Nowhere, FL 98765", "2023-02-10", 1),
            new UserBean(5, "Michael", "Brown", "michael.brown@example.com",
            "555-321-6547", "654 Cedar Ln, Anywhere, WA 13579", "2023-02-15", 1)
        };
        out.print(gsonUser.toJson(users));

    }

}
