'use strict';

import { CartController } from '../Controllers/CartController.js';
import { Serializer } from '../Utils/Serializer.js';
import DataValidator from '../Utils/DataValidator.js';
import SERVER_DELAY from "../Utils/ServerDelay.js";
import UserChecker from "../Utils/UserChecker.js";

export const CartHandler = {
    userGetCart(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!data || !DataValidator.isIDValid(data.userID)) {
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

                const result = CartController.getCart(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userValidateCart(jsonData, callback) {
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

                const result = CartController.validateCart(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetCartShippingFee(jsonData, callback) {
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

                const result = CartController.getCartShippingFee(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userAddItemToCart(jsonData, callback) {
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
                    }))
                }

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }));
                }

                if (!DataValidator.isNonNegativeInteger(data.quantity)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid quantity!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const bookID = parseInt(data.bookID);
                const quantity = parseInt(data.quantity);

                const result = CartController.addItem(
                    userID,
                    bookID,
                    quantity
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

	userUpdateCartItemQuantity(jsonData, callback) {
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
                    }))
                }

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }))
                }

                if (!DataValidator.isNonNegativeInteger(data.newQuantity)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid new quantity!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const bookID = parseInt(data.bookID);
                const newQuantity = parseInt(data.newQuantity);

                const result = CartController.updateItem(
                    userID,
                    bookID,
                    newQuantity
                );
                callback(Serializer.serialize(result));
            } catch (error) {
                console.log(error);
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userRemoveCartItem(jsonData, callback) {
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
                    }))
                }

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }))
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const bookID = parseInt(data.bookID);
                
                const result = CartController.removeItem(
                    userID,
                    bookID
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

    userTruncateCart(jsonData, callback) {
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
                
                const result = CartController.truncate(userID);
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