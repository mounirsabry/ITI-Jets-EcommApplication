'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getAllPurchaseHistory(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetAllPurchaseHistoryList, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getPurchaseHistoryItem(userID, itemID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetPurchaseHistoryItemDetails, { userID, itemID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    }
};