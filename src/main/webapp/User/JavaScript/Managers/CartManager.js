'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

function userGetCartSubtotal(jsonData, callback) {
    // Check if the errorMessage parameter exists in the URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('subtotal')) {
        const subtotalString = urlParams.get('subtotal');

        let parsedSubtotal;
        let response;
        try {
            parsedSubtotal = parseInt(subtotalString);

        } catch (_) {
            response = { success: false, data: 'Subtotal could not be parsed!' };
            callback(JSON.stringify(response))
        }

        if (isNaN(parsedSubtotal)) {
            response = { success: false, data: 'Subtotal is not a number!' };
        } else {
            response = {success: true, data: parsedSubtotal};
        }

        callback(JSON.stringify(response));
    }
}

export const CartManager = {
    getCart(userID, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userGetCart(
            JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    validateCart(userID, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userValidateCart(
            JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    getSubtotal(userID, callbackOnSuccess, callbackOnFailure) {
        userGetCartSubtotal(JSON.stringify({ userID}),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    getShippingFee(userID, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userGetCartShippingFee(
            JSON.stringify({userID}),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    addItem(userID, bookID, quantity, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userAddItemToCart(
            JSON.stringify({ userID, bookID, quantity }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    updateCartItem(userID, bookID, newQuantity, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userUpdateCartItemQuantity(
            JSON.stringify({ userID, bookID, newQuantity }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    removeCartItem(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userRemoveCartItem(
            JSON.stringify({ userID, bookID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    truncate(userID, callbackOnSuccess, callbackOnFailure) {
        Server.CartHandler.userTruncateCart(
            JSON.stringify({ userID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },
};