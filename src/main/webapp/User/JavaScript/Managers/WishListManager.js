'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getAllWishList(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetAllWishList, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getAllWishListBooks(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetAllWishListBooks, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    addWishListItem(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userAddWishListItem, { userID, bookID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    removeFromWishList(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userRemoveFromWishList, { userID, bookID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    }
};