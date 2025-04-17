'use strict';

import {Serializer} from "../Utils/Serializer.js";
import DataValidator from "../Utils/DataValidator.js";
import UserChecker from "../Utils/UserChecker.js";
import SERVER_DELAY from "../Utils/ServerDelay.js";
import WishListController from "../Controllers/WishListController.js";

export const WishListHandler = {
    userGetAllWishListBooks(jsonData, callback) {
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

                const result = WishListController.getWishListBooks(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetAllWishList(jsonData, callback) {
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

                const result = WishListController.getWishList(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userAddWishListItem(jsonData, callback) {
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

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const bookID = parseInt(data.bookID);

                const result = WishListController.addBookToWishList(userID, bookID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userRemoveFromWishList(jsonData, callback) {
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

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const bookID = parseInt(data.bookID);

                const result = WishListController.removeBookFromWishList(userID, bookID);
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