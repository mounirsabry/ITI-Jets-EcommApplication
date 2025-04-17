'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const PurchaseHistoryManager = {
    getAllPurchaseHistory(userID, callbackOnSuccess, callbackOnFailure) {
        Server.PurchaseHistoryHandler.userGetAllPurchaseHistoryList(JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    getPurchaseHistoryItem(userID, itemID, callbackOnSuccess, callbackOnFailure) {
        Server.PurchaseHistoryHandler.userGetPurchaseHistoryItemDetails(JSON.stringify({ userID, itemID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    }
};