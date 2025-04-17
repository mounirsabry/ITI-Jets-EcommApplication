'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import createResponseHandler from "./responseHandler.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getAllPurchaseHistory(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetAllPurchaseHistoryList, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getPurchaseHistoryItem(userID, itemID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetPurchaseHistoryItemDetails, { userID, itemID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    }
};