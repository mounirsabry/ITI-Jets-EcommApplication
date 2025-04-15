package jets.projects.normal_user;

import java.io.BufferedReader;
import java.io.IOException;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jets.projects.client_dto.UserDto;
import jets.projects.dal.UsersDAL;
import jets.projects.exceptions.InvalidCredentialsException;
import jets.projects.services.UserService;
import jets.projects.utils.JsonResponseConverter;

public class UserLogin extends HttpServlet {

    private final UsersDAL usersDAL = new UsersDAL();

    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        //System.out.println("Query String = " + request.getQueryString());
        //System.out.println("Request URI = " + request.getRequestURI());
        BufferedReader reader = request.getReader();
        StringBuilder json = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            json.append(line);
        }

        System.out.println("Raw JSON Received: " + json.toString());
        String jsonString = json.toString();

        JsonObject jsonObject = JsonParser.parseString(jsonString).getAsJsonObject();

        String email = jsonObject.get("email").getAsString();
        String password = jsonObject.get("password").getAsString();

        UserService userService = new UserService();

        Object result = null;
        Boolean returnState = true;

        try {

            result = userService.login(email, password);
        } catch (InvalidCredentialsException e) {

            result = e.getMessage();

            returnState = false;

        }

        String returnJson = JsonResponseConverter.toJsonResponse(result, returnState);

        if (returnState == true) {
            UserDto user = (UserDto) result;
            Long registeredID = user.getUserId();
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            session = request.getSession(true);

            session.setAttribute("userID", registeredID);
            System.out.println("user id" + registeredID);

        }

        HttpSession session = request.getSession(false);

        Long registeredID = null;

        if (session != null) {
            // Retrieve the userID
            registeredID = (Long) session.getAttribute("userID");
            System.out.println("user id " + registeredID);

        }

        System.out.println("user id " + registeredID);
        response.getWriter().write(returnJson);
        /*
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
         */
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

    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        session = request.getSession(true);

        session.setAttribute("userID", 2);
        System.out.println("user id" + session.getAttribute("userID"));
    }

}
