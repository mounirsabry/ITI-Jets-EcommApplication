'use strict';

import {Serializer} from "../Utils/Serializer.js";
import DataValidator from "../Utils/DataValidator.js";
import UserChecker from "../Utils/UserChecker.js";
import SERVER_DELAY from "../Utils/ServerDelay.js";
import PurchaseHistoryController from "../Controllers/PurchaseHistoryController.js";

export const PurchaseHistoryHandler = {
    userGetAllPurchaseHistoryList(jsonData, callback) {
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

                const result = PurchaseHistoryController.getPurchaseHistory(userID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetPurchaseHistoryItemDetails(jsonData, callback) {
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

                if (!DataValidator.isIDValid(data.itemID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid item ID!'
                    }));
                }

                const userID = parseInt(data.userID);
                const isUserExists = UserChecker.isUserExists(userID);
                if (!isUserExists) {
                    return { success: false, data: "User not found!" };
                }

                const itemID = parseInt(data.itemID);

                const result = PurchaseHistoryController.getPurchaseHistoryItem(userID, itemID);
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