package jets.projects.normal_user;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import jets.projects.beans.NormalUserBean;
import jets.projects.dal.UsersDAL;
import jets.projects.stats.OnlineStats;
public class UserLogin extends HttpServlet {
    private final UsersDAL usersDAL = new UsersDAL();
    
    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {        
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        
        String errorMessage = checkInputForError(email, password);
        if (errorMessage != null) {
            errorMessage = URLEncoder.encode(errorMessage,
                            StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + UserURLMapper.LOGIN_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        
        NormalUserBean user = usersDAL.userLogin(email, password);
        if (user == null) {
            errorMessage = URLEncoder.encode(
                    "Either Email or Password is Incorrect",
                    StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + UserURLMapper.LOGIN_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        
        // Create a new session if not existed, and refresh old one if exists.
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);
        session.setAttribute("userID", user.getID());
        session.setAttribute("userObject", user);
        
        OnlineStats.userLoggedIn();
        response.sendRedirect(request.getContextPath()
                    + UserURLMapper.HOME_PAGE);
    }
    
    private String checkInputForError(String email, String password) {
        if (email == null) {
            return "Email must be provided.";
        }
        
        if (email.isBlank()) {
            return "Email cannot be empty.";
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
