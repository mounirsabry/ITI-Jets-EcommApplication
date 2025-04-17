'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const OrdersManager = {
    getOrdersList(userID, callbackOnSuccess, callbackOnFailure) {
        Server.OrderHandler.userGetAllOrdersList(
            JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    getOrderDetails(userID, orderID, callbackOnSuccess, callbackOnFailure) {
        Server.OrderHandler.userGetOrderDetails(
            JSON.stringify({ userID, orderID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    checkoutUsingAccountBalance(userID, address, callbackOnSuccess, callbackOnFailure) {
        Server.OrderHandler.userCheckoutUsingAccountBalance(
            JSON.stringify({ userID, address }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    // creditCardDetails are (nameOnCard, cardNumber, expiryDate, CVC)
    checkoutUsingCreditCard(userID, address, creditCardDetails, callbackOnSuccess, callbackOnFailure) {
        Server.OrderHandler.userCheckoutUsingCreditCard(
            JSON.stringify({ userID, address, creditCardDetails }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },
};
