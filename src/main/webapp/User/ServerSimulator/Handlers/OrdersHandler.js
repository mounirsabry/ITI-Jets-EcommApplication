'use strict';

import { OrdersController } from '../Controllers/OrdersController.js';
import { Serializer } from '../Utils/Serializer.js';
import DataValidator from '../Utils/DataValidator.js';
import PaymentMethods from "../Models/PaymentMethods.js";
import SERVER_DELAY from "../Utils/ServerDelay.js";
import UserChecker from "../Utils/UserChecker.js";

export const OrderHandler = {
    userGetAllOrdersList(jsonData, callback) {
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
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const result = OrdersController.getOrders(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetOrderDetails(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.orderID) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or order ID!'
                    }))
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }))
                }

                if (!DataValidator.isIDValid(data.orderID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid order ID!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const orderID = parseInt(data.orderID);

                const result = OrdersController.getOrder(userID, orderID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userCheckoutUsingAccountBalance(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.address) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or address!'
                    }))
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }))
                }

                if (typeof data.address !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid address format! It must be a string!'
                    }));
                }

                const address = data.address.trim();
                if (address.length === 0) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Address was empty!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const paymentDetails = {
                    address
                }

                const result = OrdersController.place(
                    userID,
                    paymentDetails,
                    PaymentMethods.ACCOUNT_BALANCE
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

    userCheckoutUsingCreditCard(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data.userID || !data.address || !data.creditCardDetails) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Missing user ID or address or credit card details!'
                    }))
                }

                if (!DataValidator.isIDValid(data.userID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid user ID!'
                    }))
                }

                if (typeof data.address !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid address format! It must be a string!'
                    }))
                }

                const address = data.address.trim();
                if (address.length === 0) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Address was empty!'
                    }));
                }

                if (typeof data.creditCardDetails !== 'object') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid order data format! It must be an object!'
                    }));
                }

                const creditCardDetailsParsed = Serializer.safeParse(JSON.stringify(data.creditCardDetails));
                if (!creditCardDetailsParsed) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid credit card details format!'
                    }));
                }

                const errorMessage = DataValidator.isCreditCardValid(creditCardDetailsParsed);
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

                const { nameOnCard, cardNumber, expiryYear, expiryMonth, cvc } = creditCardDetailsParsed;

                const paymentDetails = {
                    address,
                    nameOnCard,
                    cardNumber,
                    expiryYear,
                    expiryMonth,
                    cvc
                }

                const result = OrdersController.place(
                    userID,
                    paymentDetails,
                    PaymentMethods.CREDIT_CARD
                );
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    }
};
