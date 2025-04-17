'use strict';

import UsersDAO from '../DB/UsersDAO.js';
import CreditCardAPI from "../Utils/CreditCardAPI.js";

export class ProfileController {
    static getProfile(userID) {
        const user = UsersDAO.getUser(userID);
        return user 
            ? { success: true, data: user } 
            : { success: false, data: 'User not found!' };
    }

    static updateEmail(userID, newEmail) {
        const user = UsersDAO.getUser(userID);
        if (!user) {
            return { success: false, data: 'User not found!' };
        }

        user.email = newEmail;
        UsersDAO.saveUser(user);
        return { success: true, data: 'Email updated successfully.' };
    }

    static updatePassword(userID, currentPassword, newPassword) {
        const user = UsersDAO.getUser(userID);
        if (!user) {
            return { success: false, data: 'User not found!' };
        }
        if (UsersDAO.validateUserPassword(userID, currentPassword) === false) {
            return { success: false, data: 'Invalid current password!' };
        }
        const isUpdated = UsersDAO.changeUserPassword(userID, newPassword);
        if (!isUpdated) {
            return { success: false, data: 'Password update failed!' };
        }
        return { success: true, data: 'Password updated successfully.' };
    }

	static updateDetails(userID, updatedData) {
        const user = UsersDAO.getUser(userID);
        if (!user) {
            return { success: false, data: 'User not found!' };
        }

        const { userName, phoneNumber, address, birthDate } = updatedData;

        user.userName = userName;
        user.phoneNumber = phoneNumber;
        user.address = address;
        user.birthDate = birthDate;
        
        UsersDAO.saveUser(user);
        return { success: true, data: user };
    }

    static rechargeBalanceUsingCreditCard(userID, creditCardDetails, amount) {
        const user = UsersDAO.getUser(userID);
        if (!user) {
            return { success: false, data: 'User not found!' };
        }

        const isTransactionComplete = CreditCardAPI.pay(creditCardDetails, amount);
        if (!isTransactionComplete) {
            return { success: false, data: 'Transaction failed!' };
        }

        user.accountBalance = user.accountBalance + amount;
        UsersDAO.saveUser(user);
        return { success: true, data: `Balance recharged successfully, new balance: ${user.accountBalance}` };
    }
}