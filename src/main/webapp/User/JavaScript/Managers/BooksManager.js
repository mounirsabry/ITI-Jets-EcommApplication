'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const BooksManager = {
    getTopSelling(callbackOnSuccess, callbackOnFailure) {

        Server.BooksHandler.userGetTopSellingBooksList('{}',
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    getTopSellingInGenres(callbackOnSuccess, callbackOnFailure) {

        Server.BooksHandler.userGetTopSellingBookFromEachGenreList('{}',
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    getAllBooks(callbackOnSuccess, callbackOnFailure) {

        Server.BooksHandler.userGetAllBooksList('{}',
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    search(keywords, callbackOnSuccess, callbackOnFailure) {

        Server.BooksHandler.userSearchBooks(JSON.stringify({ keywords }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    },

    getBookDetails(bookID, callbackOnSuccess, callbackOnFailure) {

        Server.BooksHandler.userGetBookDetails(JSON.stringify({ bookID }),
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    }
};