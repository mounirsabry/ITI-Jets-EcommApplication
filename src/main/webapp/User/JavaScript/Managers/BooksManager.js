'use strict';

import VanillaAJAX from "../Ajax/VanillaAJAX.js";
import ServerURLMapper from "./ServerURLMapper.js";
import handleManagerError from "./handleManagerError.js";

const ajaxClient = new VanillaAJAX();

export default {
    getTopSelling(callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetTopSellingBooksList, {})
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
    },

    getTopSellingInGenres(callbackOnSuccess, callbackOnFailure) {
        ajaxClient.get(ServerURLMapper.userGetTopSellingBookFromEachGenreList, {})
            .then(response => {
                if (typeof callbackOnSuccess === 'function') {
                    callbackOnSuccess(response);
                }
            })
            .catch(error => handleManagerError(error, callbackOnFailure));
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