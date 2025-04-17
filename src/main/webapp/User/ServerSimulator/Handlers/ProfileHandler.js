'use strict';

import { ProfileController } from '../Controllers/ProfileController.js';
import { Serializer } from '../Utils/Serializer.js';
import DataValidator from '../Utils/DataValidator.js';
import SERVER_DELAY from "../Utils/ServerDelay.js";
import UserChecker from "../Utils/UserChecker.js";

function checkForUpdateProfileError(updatedDetails) {
    if (!updatedDetails) {
        return 'Updated details are missing!';
    } else if (typeof updatedDetails !== 'object') {
        return 'Updated details are not an object!';
    }

    const { userName, phoneNumber, address, birthDate } = updatedDetails;

    if (!userName || typeof userName !== 'string') {
        return 'Invalid or missing user name!';
    }
    if (userName.trim().length === 0) {
        return 'User name cannot be empty!';
    }

    if (!phoneNumber || typeof phoneNumber !== 'string') {
        return 'Invalid or missing phone number!';
    }
    if (phoneNumber.trim().length === 0) {
        return 'Phone number cannot be empty!';
    }
    if (!DataValidator.isPhoneValid(phoneNumber)) {
        return 'Invalid phone number, phone number must be a valid egyptian phone number!';
    }

    if (!address || typeof address !== 'string') {
        return 'Invalid or missing address!';
    }
    if (address.trim().length === 0) {
        return 'Address cannot be empty!';
    }

    if (!birthDate || typeof birthDate !== 'string') {
        return 'Invalid or missing birthdate!';
    }
    if (birthDate.trim().length === 0) {
        return 'Birthdate cannot be empty!';
    }
    if (!DataValidator.isDateValid(birthDate)) {
        return 'Invalid birthdate format!';
    }
    if (!DataValidator.isBirthDateValid(birthDate)) {
        return 'Invalid birth date, age must be at least 10 years old!';
    }

    return null;
}

export const ProfileHandler = {
    userGetProfile(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }));
                }

                const userID = parseInt(data.userID);
                const result = ProfileController.getProfile(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userUpdateEmail(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.newEmail) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or new email!'
                    }));
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }));
                }

                if (typeof data.newEmail !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid new email format! It must be a string!'
                    }));
                }

                if (!DataValidator.isEmailValid(data.newEmail)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid new email!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const newEmail = data.newEmail;

                const result = ProfileController.updateEmail(userID, newEmail);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userUpdatePassword(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.currentPassword || !data.newPassword) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or current password or new password!'
                    }));
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }));
                }

                if (typeof data.currentPassword !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid current password format! It must be a string!'
                    }));
                }

                if (typeof data.newPassword !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid new password format! It must be a string!'
                    }));
                }

                if (!DataValidator.isPasswordValid(data.currentPassword)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid current password format!'
                    }));
                }

                if (!DataValidator.isPasswordValid(data.newPassword)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid new password format!'
                    }));
                }

                const currentPassword = data.currentPassword;
                const newPassword = data.newPassword;

                if (currentPassword === newPassword) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Current password and new password must be different!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const result = ProfileController.updatePassword(
                    userID,
                    currentPassword,
                    newPassword
                );
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

	userUpdatePersonalDetails(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.updatedDetails) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or updated details!'
                    }));
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }));
                }

                if (typeof data.updatedDetails !== 'object') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid updated details format! It must be an object!'
                    }))
                }

                const updatedDetails = data.updatedDetails;
                const errorMessage = checkForUpdateProfileError(updatedDetails);
                if (errorMessage) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: errorMessage
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const result = ProfileController.updateDetails(
                    userID,
                    updatedDetails
                );
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userRechargeAccountBalanceUsingCreditCard(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.creditCardDetails || !data.amount) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or credit card details or amount!'
                    }))
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }))
                }

                if (typeof data.creditCardDetails !== 'object') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid credit card details format! It must be an object!'
                    }))
                }

                if (!DataValidator.isNonNegativeInteger(data.amount)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid amount format! It must be a non-negative integer!'
                    }))
                }

                const amount = parseInt(data.amount);
                if (amount < 50) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Amount must be at least 50!'
                    }))
                }

                const creditCardDetails = Serializer.safeParse(JSON.stringify(data.creditCardDetails));
                if (!creditCardDetails) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid credit card details format!'
                    }))
                }

                const errorMessage = DataValidator.isCreditCardValid(creditCardDetails);
                if (errorMessage) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: errorMessage
                    }))
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const result = ProfileController.rechargeBalanceUsingCreditCard(
                    userID,
                    creditCardDetails,
                    amount
                );
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },
};