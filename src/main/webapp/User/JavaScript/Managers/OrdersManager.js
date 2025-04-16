'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getOrdersList(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetAllOrdersList, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getOrderDetails(userID, orderID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetOrderDetails, { userID, orderID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    checkoutUsingAccountBalance(userID, address, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userCheckoutUsingAccountBalance, { userID, address })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    checkoutUsingCreditCard(userID, address, creditCardDetails, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userCheckoutUsingCreditCard, {
            userID,
            address,
            creditCardDetails
        })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },
};