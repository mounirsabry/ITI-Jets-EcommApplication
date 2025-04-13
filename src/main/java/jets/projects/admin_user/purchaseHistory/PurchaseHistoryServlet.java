package jets.projects.admin_user.purchaseHistory;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.admin_user.AdminURLMapper;
import java.io.IOException;

public class PurchaseHistoryServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.getRequestDispatcher(AdminURLMapper.PURCHASE_HISTORY_PAGE).forward(request, response);
    }
}