'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    login(email, password, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userLogin, { email, password })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    register(userData, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userRegister, userData)
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getProfile(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetProfile, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    updateEmail(userID, newEmail, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userUpdateEmail, { userID, newEmail })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    updatePassword(userID, currentPassword, newPassword, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userUpdatePassword, { userID, currentPassword, newPassword })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    updateDetails(userID, updatedDetails, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userUpdatePersonalDetails, { userID, updatedDetails })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    rechargeAccountBalanceUsingCreditCard(userID, creditCardDetails, amount, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userRechargeAccountBalanceUsingCreditCard, { userID, creditCardDetails, amount })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    }
};