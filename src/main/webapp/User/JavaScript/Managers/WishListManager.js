'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const WishListManager = {
    getAllWishList(userID, callbackOnSuccess, callbackOnFailure) {
        Server.WishListHandler.userGetAllWishList(JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    getAllWishListBooks(userID, callbackOnSuccess, callbackOnFailure) {
        Server.WishListHandler.userGetAllWishList(JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    addWishListItem(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        Server.WishListHandler.userAddWishListItem(JSON.stringify({ userID, bookID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    removeFromWishList(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        Server.WishListHandler.userRemoveFromWishList(JSON.stringify({ userID, bookID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    }
};