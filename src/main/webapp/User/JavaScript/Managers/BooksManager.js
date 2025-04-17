'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import createResponseHandler from "./responseHandler.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getTopSelling(callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetTopSellingBooksList, {})
            .then(response => {
                responseHandler(response);
            })
            .catch(responseHandler(response));
    },

    getTopSellingInGenres(callbackOnSuccess, callbackOnFailure) {
        const responseHandler = createResponseHandler(callbackOnSuccess, callbackOnFailure);

        ajaxClient.get(ServerURLMapper.userGetTopSellingBookFromEachGenreList, {})
            .then(response => {
                responseHandler(response);
            })
            .catch(responseHandler(response));
    },

    getAllBooks(callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetAllBooksList, {})
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    search(keywords, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userSearchBooks, { keywords })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getBookDetails(bookID, callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetBookDetails, { bookID })
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    }
};