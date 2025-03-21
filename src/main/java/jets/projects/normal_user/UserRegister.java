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
import jets.projects.utils.DataValidator;
import jets.projects.utils.FixedMessages;

public class UserRegister extends HttpServlet {
    private final UsersDAL usersDAL = new UsersDAL();
    
    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        String firstName = request.getParameter("firstName");
        String lastName = request.getParameter("lastName");
        
        String errorMessage = checkInputForError(email,
                password, firstName, lastName);
        if (errorMessage != null) {
            errorMessage = URLEncoder.encode(errorMessage,
                            StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + UserURLMapper.REGISTER_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        
        NormalUserBean user = new NormalUserBean(-1, email,
                password, firstName, lastName);
        Integer registeredID = usersDAL.register(user);
        if (registeredID == null || registeredID == -1) {
            if (registeredID == null) {
                errorMessage = FixedMessages.DB_ERROR;
            } else {
                errorMessage = "An account is already registerd by this email.";
            }
            
            errorMessage = URLEncoder.encode(
                    errorMessage,
                    StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath()
                    + UserURLMapper.REGISTER_PAGE
                    + "?errorMessage=" + errorMessage);
            return;
        }
        
        user.setID(registeredID);
        // Create a new session if not existed, and refresh old one if exists.
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);
        
        session.setAttribute("userID", registeredID);
        response.sendRedirect(request.getContextPath()
                    + UserURLMapper.HOME_PAGE);
    }
    
    private String checkInputForError(String email,
            String password, String firstName, String lastName) {
        if (email == null) {
            return "Email must be provided.";
        }
        
        if (email.isBlank()) {
            return "Email cannot be empty.";
        }
        
        if (!DataValidator.validateEmail(email)) {
            return "Invalid Email Format.";
        }
        
        if (password == null) {
            return "Password must be provided.";
        }
        
        if (password.isBlank()) {
            return "Password cannot be empty.";
        }
        
        if (firstName == null) {
            return "First Name must be provided.";
        }
        
        if (firstName.isBlank()) {
            return "First Name cannot be empty.";
        }
        
        if (lastName == null) {
            return "Last Name must be provided.";
        }
        
        if (lastName.isBlank()) {
            return "Last Name cannot be empty.";
        }
        
        return null;
    }
}
