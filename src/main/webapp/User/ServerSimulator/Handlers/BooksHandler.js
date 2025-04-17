'use strict';

import { BooksController } from '../Controllers/BooksController.js';
import DataValidator from '../Utils/DataValidator.js';
import { Serializer } from '../Utils/Serializer.js';
import SERVER_DELAY from "../Utils/ServerDelay.js";

export const BooksHandler = {
    userGetTopSellingBooksList(_, callback) {
        setTimeout(() => {
            try {
                // No parameters needed, just pass empty object
                const result = BooksController.getTopSelling();
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: "Internal server error."
                }));
            }
        }, SERVER_DELAY);
    },

    userGetTopSellingBookFromEachGenreList(_, callback) {
        setTimeout(() => {
            try {
                // No parameters needed, just pass empty object
                const result = BooksController.getTopSellingInGenres();
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetAllBooksList(_, callback) {
        setTimeout(() => {
            try {
                // No parameters needed, just pass empty object
                const result = BooksController.getAllBooks();
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userSearchBooks(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (typeof data.keywords !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid search query format!'
                    }));
                }

                const keywords = data.keywords.trim();
                if (keywords.length === 0) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Search query cannot be empty!'
                    }));
                }

                const result = BooksController.search(keywords);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    },

    userGetBookDetails(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid json format!'
                    }));
                }

                if (!DataValidator.isIDValid(data.bookID)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid book ID!'
                    }));
                }

                const bookID = parseInt(data.bookID);

                const result = BooksController.getBookDetails(bookID);
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    }
};
