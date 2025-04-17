'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getCart(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetCart, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    validateCart(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userValidateCart, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getShippingFee(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetCartShippingFee, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    addItem(userID, bookID, quantity, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userAddItemToCart, { userID, bookID, quantity })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    updateCartItem(userID, bookID, newQuantity, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userUpdateCartItemQuantity, { userID, bookID, newQuantity })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    removeCartItem(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.post(ServerURLMapper.userRemoveCartItem, { userID, bookID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    truncate(userID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userTruncateCart, { userID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },
};