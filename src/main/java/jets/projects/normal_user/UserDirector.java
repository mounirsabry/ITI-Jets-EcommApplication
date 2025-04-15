package jets.projects.normal_user;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;

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
                || session.getAttribute("userID") == null) {
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
        HttpSession session = request.getSession(false);

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
        } else if (servletPath.equals(UserURLMapper.SEARCH)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.SEARCH_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_LOGIN)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_LOGIN_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.LOGOUT)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.LOGOUT_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_GET_TOP_SELLING_BOOKS_LIST)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_TOP_SELLING_BOOKS_LIST_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_GET_TOP_SELLING_BOOK_FROM_EACH_GENRE_LIST)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_TOP_SELLING_BOOK_FROM_EACH_GENRE_LIST_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_GET_ALL_BOOKS_LIST)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_ALL_BOOKS_LIST_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_SEARCH_BOOKS)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_SEARCH_BOOKS_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        if (servletPath.equals(UserURLMapper.USER_GET_BOOK_DETAILS)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_BOOK_DETAILS_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        if (servletPath.equals(UserURLMapper.USER_REGISTER)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_REGISTER_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        // Get User Profile
        if (servletPath.equals(UserURLMapper.USER_GET_PROFILE)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_PROFILE_SERVLET);
            dispatcher.forward(request, response);
            return;
        } // Cart Endpoints
        else if (servletPath.equals(UserURLMapper.USER_GET_CART)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_CART_SERVLET);
            dispatcher.forward(request, response);
            return;

        } else if (servletPath.equals(UserURLMapper.USER_VALIDATE_CART)) {

            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_VALIDATE_CART_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.USER_GET_CART_SHIPPING_FEE)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_GET_CART_SHIPPING_FEE_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.USER_TRUNCATE_CART)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_TRUNCATE_CART_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        directToErrorPage(request, response,
                "No Get Method Registered for this URL.");
    }

    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession(false);

        String servletPath = request.getServletPath();

        if (servletPath.equals(UserURLMapper.USER_LOGIN)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_LOGIN_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.REGISTER)) {
            System.out.println("user register");
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.REGISTER_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.USER_REGISTER)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_REGISTER_SERVLET);
            dispatcher.forward(request, response);
            return;
        }
        // Update Email
        if (servletPath.equals(UserURLMapper.USER_UPDATE_EMAIL)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_UPDATE_EMAIL_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        // Update Password
        if (servletPath.equals(UserURLMapper.USER_UPDATE_PASSWORD)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_UPDATE_PASSWORD_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        // Update Personal Details
        if (servletPath.equals(UserURLMapper.USER_UPDATE_PERSONAL_DETAILS)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_UPDATE_PERSONAL_DETAILS_SERVLET);
            dispatcher.forward(request, response);
            return;
        }

        // Recharge Account Balance
        if (servletPath.equals(UserURLMapper.USER_RECHARGE_ACCOUNT)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_RECHARGE_ACCOUNT_SERVLET);
            dispatcher.forward(request, response);
            return;
        } // Cart Endpoints
        else if (servletPath.equals(UserURLMapper.USER_ADD_ITEM_TO_CART)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_ADD_ITEM_TO_CART_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.USER_UPDATE_CART_ITEM_QUANTITY)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_UPDATE_CART_ITEM_QUANTITY_SERVLET);
            dispatcher.forward(request, response);
            return;
        } else if (servletPath.equals(UserURLMapper.USER_REMOVE_CART_ITEM)) {
            var dispatcher = getServletContext().getNamedDispatcher(
                    UserURLMapper.USER_REMOVE_CART_ITEM_SERVLET);
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
