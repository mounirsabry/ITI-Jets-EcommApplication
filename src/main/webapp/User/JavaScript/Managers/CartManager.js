'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import createResponseHandler from "./responseHandler.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

function userGetCartSubtotal(jsonData, callback) {
    // Check if the subtotal parameter exists in the URL
    const urlParams = new URLSearchParams(window.location.search);
    console.log("URL Params:", urlParams.toString()); // Debug all params

    let response;

    if (urlParams.has('subtotal')) {
        const subtotalString = urlParams.get('subtotal');
        console.log("Subtotal string:", subtotalString);

        let parsedSubtotal;
        try {
            parsedSubtotal = parseFloat(subtotalString);
            console.log("Parsed subtotal:", parsedSubtotal);

            if (isNaN(parsedSubtotal)) {
                response = { success: false, data: 'Subtotal is not a number!' };
            } else {
                response = { success: true, data: parsedSubtotal };
            }
        } catch (error) {
            console.error("Parse error:", error);
            response = { success: false, data: 'Subtotal could not be parsed!' };
        }
    } else {
        console.log("No subtotal parameter found");
        response = { success: true, data: 0 }; // Default subtotal is 0
    }

    console.log("Final response:", response);
    // Try passing the object directly instead of stringifying it
    callback(response);
}

export default {
    getCart(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetCart, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    validateCart(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userValidateCart, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getSubtotal(userID, callbackOnSuccess, callbackOnFailure) {
        userGetCartSubtotal(JSON.stringify({ userID}),
            createResponseHandler(callbackOnSuccess, callbackOnFailure)
        );
    },

    getShippingFee(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetCartShippingFee, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    addItem(userID, bookID, quantity, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.post(ServerURLMapper.userAddItemToCart, { userID, bookID, quantity })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    updateCartItem(userID, bookID, newQuantity, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.post(ServerURLMapper.userUpdateCartItemQuantity, { userID, bookID, newQuantity })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    removeCartItem(userID, bookID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.post(ServerURLMapper.userRemoveCartItem, { userID, bookID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    truncate(userID, callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userTruncateCart, { userID })
            .then(response => {
                responseHandler(response);
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },
};