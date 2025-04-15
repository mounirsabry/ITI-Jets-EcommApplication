package jets.projects.normal_user;

import java.io.BufferedReader;
import java.io.IOException;
import java.math.BigDecimal;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jets.projects.client_dto.CreditCardDetailsDto;
import jets.projects.exceptions.InvalidInputException;
import jets.projects.exceptions.OperationFailedException;
import jets.projects.services.UserService;
import jets.projects.utils.GetUserID;
import jets.projects.utils.JsonResponseConverter;

public class UserRechargeAccountBalanceUsingCreditCard extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        System.out.println("do post in update Charge ---------------------------");
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
        JsonObject creditCardDetails = jsonObject.getAsJsonObject("creditCardDetails");
        BigDecimal amount = jsonObject.get("amount").getAsBigDecimal();

        String nameOnCard = creditCardDetails.get("nameOnCard").getAsString();

        String cardNumber = creditCardDetails.get("cardNumber").getAsString();

        String cvc = creditCardDetails.get("cvc").getAsString();

        Long registeredID = GetUserID.getUserId(request);

        UserService userService = new UserService();

        Object result = null;
        Boolean returnState = true;

        try {

            CreditCardDetailsDto creditCardDetailsDto = new CreditCardDetailsDto(cardNumber, cvc, nameOnCard);

            result = userService.rechargeBalance(registeredID, creditCardDetailsDto, amount);

        } catch (InvalidInputException e) {

            result = e.getMessage();
            returnState = false;

        } catch (OperationFailedException e) {

            result = e.getMessage();
            returnState = false;

        }

        String returnJson = JsonResponseConverter.toJsonResponse(result, returnState);

        response.getWriter().write(returnJson);

    }

    @Override
    public void doGet(HttpServletRequest request,
            HttpServletResponse response) throws ServletException, IOException {
        System.out.println("get in recharge");
    }

}
