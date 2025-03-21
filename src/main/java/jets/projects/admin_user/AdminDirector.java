package jets.projects.admin_user;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

public class AdminDirector extends HttpServlet {
    private static final boolean ADMIN_LOGIN_SERVICE_AVAILABLE = true;
    
    // The function uses this should call return after it.
    private void directToErrorPage(HttpServletRequest request,
            HttpServletResponse response,
            String message) throws IOException {
        String errorMessage = URLEncoder.encode(
                message,
                StandardCharsets.UTF_8);
        response.sendRedirect(request.getContextPath() 
                + AdminURLMapper.ERROR_PAGE 
                + "?errorMessage=" + errorMessage);
    }
    
    // In case returned false, a return should be called directly after it.
    private boolean redirectOnHavingInvalidSession(HttpServletRequest request,
            HttpServletResponse response,
            HttpSession session) throws IOException {
        String errorMessage;
        
        if (session == null 
        ||  session.getAttribute("adminID") == null) {
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
                    + AdminURLMapper.LOGIN_PAGE 
                    + "?errorMessage=" + errorMessage);
            return true;
        }
        
        return false;
    }
    
    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        String servletPath = request.getServletPath();
        HttpSession session = request.getSession(false);
    
        // Also handles requests at root of the application.
        if (servletPath.equals(AdminURLMapper.HOME)) {
            if (ADMIN_LOGIN_SERVICE_AVAILABLE) {
                // The user is already logged in.
                if (session != null 
                && session.getAttribute("adminID") != null) {
                    response.sendRedirect(request.getContextPath() 
                            + AdminURLMapper.HOME_PAGE);
                } else {
                    response.sendRedirect(request.getContextPath() 
                            + AdminURLMapper.LOGIN_PAGE);
                }
                return;
            } else {
                directToErrorPage(request, response, 
                        "Main Service is Down ... For Now!");
                return;
            }
        }
        
        // Validate token on valid service calls.
        if (servletPath.equals(AdminURLMapper.SEARCH)) {
            if (redirectOnHavingInvalidSession(request, response, session)) {
                return;
            }
        }
        
        if (servletPath.equals(AdminURLMapper.LOGOUT)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    AdminURLMapper.LOGOUT_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        
        if (servletPath.equals(AdminURLMapper.SEARCH)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    AdminURLMapper.SEARCH_SERVLET);
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
        
        if (servletPath.equals(AdminURLMapper.LOGIN)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    AdminURLMapper.LOGIN_SERVLET);
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