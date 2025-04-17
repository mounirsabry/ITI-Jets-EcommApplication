'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import createResponseHandler from "./responseHandler.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getOrdersList(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetAllOrdersList, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getOrderDetails(userID, orderID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetOrderDetails, { userID, orderID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    checkoutUsingAccountBalance(userID, address, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.post(ServerURLMapper.userCheckoutUsingAccountBalance, { userID, address })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    checkoutUsingCreditCard(userID, address, creditCardDetails, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.post(ServerURLMapper.userCheckoutUsingCreditCard, {
            userID,
            address,
            creditCardDetails
        })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },
};