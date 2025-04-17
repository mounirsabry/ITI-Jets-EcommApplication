'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const ProfileManager = {
    login(email, password, callbackOnSuccess, callbackOnFailure) {
        Server.LoginHandler.userLogin(
            JSON.stringify({ email, password }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    // userData are email, password, userName, phone, address, and birthDate.
    register(userData, callbackOnSuccess, callbackOnFailure) {
        Server.RegisterHandler.userRegister(
            JSON.stringify(userData),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    getProfile(userID, callbackOnSuccess, callbackOnFailure) {
        Server.ProfileHandler.userGetProfile(
            JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    updateEmail(userID, newEmail, callbackOnSuccess, callbackOnFailure) {
        Server.ProfileHandler.userUpdateEmail(
            JSON.stringify({ userID, newEmail }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    updatePassword(userID, currentPassword, newPassword, callbackOnSuccess, callbackOnFailure) {
        Server.ProfileHandler.userUpdatePassword(
            JSON.stringify({ userID, currentPassword, newPassword }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    // updatedDetails are userName, phoneNumber, address, and birthDate.
	updateDetails(userID, updatedDetails, callbackOnSuccess, callbackOnFailure) {
        Server.ProfileHandler.userUpdatePersonalDetails(
            JSON.stringify({ userID, updatedDetails }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    rechargeAccountBalanceUsingCreditCard(userID, creditCardDetails, amount, callbackOnSuccess, callbackOnFailure) {
        Server.ProfileHandler.userRechargeAccountBalanceUsingCreditCard(
            JSON.stringify({ userID, creditCardDetails, amount }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    }
};