package jets.projects.normal_user;

import java.io.IOException;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.services.OrderService;
import jets.projects.utils.GetUserID;
import jets.projects.utils.JsonResponseConverter;

public class UserGetAllOrdersList extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        System.out.println("get order list servlet");

        Long registeredID = GetUserID.getUserId(request);

        OrderService orderService = new OrderService();

        Object result = null;
        Boolean returnState = true;

        try {

            result = orderService.getAllOrdersForClient(registeredID);
        } catch (Exception e) {

            result = e.getMessage();
            returnState = false;
        }

        String returnJson = JsonResponseConverter.toJsonResponse(result, returnState);

        System.out.println(returnJson);

        response.getWriter().write(returnJson);

    }

}
