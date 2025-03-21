package jets.projects.admin_user;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jets.projects.beans.AdminBean;
import jets.projects.dal.UsersDAL;
import jets.projects.stats.OnlineStats;
public class AdminLogin extends HttpServlet {
    private final UsersDAL usersDAL = new UsersDAL();
    
    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {        
        String adminIDString = request.getParameter("adminID");
        String password = request.getParameter("password");
        
        String errorMessage = checkInputForError(adminIDString, password);
        if (errorMessage != null) {
            errorMessage = URLEncoder.encode(errorMessage,
                            StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + AdminURLMapper.LOGIN_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        int adminID = Integer.parseInt(adminIDString);
        
        AdminBean admin = usersDAL.adminLogin(adminID, password);
        if (admin == null) {
            errorMessage = URLEncoder.encode(
                    "Either Admin ID or Password is Incorrect",
                    StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + AdminURLMapper.LOGIN_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        
        // Create a new session if not existed, and refresh old one if exists.
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);
        session.setAttribute("adminID", adminID);
        session.setAttribute("adminObject", admin);
        
        OnlineStats.userLoggedIn();
        response.sendRedirect(request.getContextPath()
                    + AdminURLMapper.HOME_PAGE);
    }
    
    private String checkInputForError(String adminIDString, String password) {
        if (adminIDString == null) {
            return "Admin ID must be provided.";
        }
        
        adminIDString = adminIDString.trim();
        if (adminIDString.isEmpty()) {
            return "Admin ID cannot be empty.";
        }
        
        try {
            Integer.valueOf(adminIDString);
        } catch (NumberFormatException ex) {
            return "Admin ID is not an Integer.";
        }
        
        if (password == null) {
            return "Password must be provided.";
        }
        
        if (password.isBlank()) {
            return "Password cannot be empty.";
        }
        
        return null;
    }
}
