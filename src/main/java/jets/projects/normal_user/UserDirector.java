package jets.projects.normal_user;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class UserDirector extends HttpServlet {
    private static final boolean HOME_SERVICE_AVAILABLE = true;
    
    // The function uses this should call return after it.
    private void directToErrorPage(HttpServletRequest request,
            HttpServletResponse response,
            String message) throws IOException {
        String errorMessage = URLEncoder.encode(
                message,
                StandardCharsets.UTF_8);
        response.sendRedirect(request.getContextPath() 
                + UserURLMapper.ERROR_PAGE 
                + "?errorMessage=" + errorMessage);
    }
    
    // In case returned false, a return should be called directly after it.
    private boolean redirectOnHavingInvalidSession(HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session) throws IOException {
        String errorMessage;
        
        if (session == null 
        ||  session.getAttribute("userID") == null) {
            if (session != null) {
                session.invalidate();
                errorMessage = "Session Invalid or"
                        + " Timed out! Please Login Again.";
            } else {
                errorMessage = "Not Logged In or Session"
                        + " Timed Out! Please Login Again.";
            }
            
            errorMessage = URLEncoder.encode(
                    errorMessage,
                    StandardCharsets.UTF_8);
            response.sendRedirect(request.getContextPath() 
                    + UserURLMapper.LOGIN_PAGE 
                    + "?errorMessage=" + errorMessage);
            return true;
        }
        
        return false;
    }
    
    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();

        // Also handles requests at root of the application.
        if (servletPath.equals("/Home")) {
            if (HOME_SERVICE_AVAILABLE) {
                response.sendRedirect(request.getContextPath() 
                            + UserURLMapper.HOME_PAGE);
                return;
            } else {
                directToErrorPage(request, response, 
                        "Main Service is Down ... For Now!");
                return;
            }
        }
        else if (servletPath.equals(UserURLMapper.SEARCH)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.SEARCH_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        
        if (servletPath.equals(UserURLMapper.LOGOUT)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.LOGOUT_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        
        directToErrorPage(request, response,
                "No Get Method Registered for this URL.");
    }
    
    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        
        if (servletPath.equals(UserURLMapper.LOGIN)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.LOGIN_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.REGISTER)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                UserURLMapper.REGISTER_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        
        directToErrorPage(request, response, 
                "No Post Method Registered for this URL.");
    }
    
    @Override
    public void doPut(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        directToErrorPage(request, response, 
                "No Put Method Registered for this URL.");
    }
    
    @Override
    public void doDelete(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        directToErrorPage(request, response, 
                "No Delete Method Registered for this URL.");
    }
    
    @Override
    public void doHead(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        directToErrorPage(request, response, 
                "No Head Method Registered for this URL.");
    }
    
    @Override
    public void doOptions(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        directToErrorPage(request, response, 
                "No Options Method Registered for this URL.");
    }
    
    @Override
    public void doTrace(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        directToErrorPage(request, response, 
                "No Trace Method Registered for this URL.");
    }   
}