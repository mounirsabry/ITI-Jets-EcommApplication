'use strict';

import WishListDAO from "../DB/WishListDAO.js";
import booksDAO from "../DB/BooksDAO.js";
import Book from "../Models/Book.js";
import WishListItem from "../Models/WishListItem.js";

export default class WishListController {
    static getWishListBooks(userID) {
        const wishList = WishListController.getWishList(userID);
        if (!wishList.success) {
            return wishList;
        }
        const wishListItemsJSON = wishList.data;
        const wishListItems = wishListItemsJSON.map(item => WishListItem.fromJSON(item));
        
        const rawBooks = booksDAO.getAllRawBooks();
        const books = rawBooks.map(book => Book.fromJSON(book));

        const booksInWishList = wishListItems.map(item =>
            books.find(book => book.bookID === item.bookID)
        );

        return {success: true, data: booksInWishList};
    }
    
    static getWishList(userID) {
        const userWishList = WishListDAO.getUserWishList(userID);
        if (userWishList === null) {
            return { success: false, data: "User wish list not found!" }
        }
        return { success: true, data: userWishList };
    }

    static addBookToWishList(userID, bookID) {
        const wishListItem = WishListDAO.getWishListItem(userID, bookID);
        if (wishListItem !== null) {
            return { success: false, data: "Book is already in the wish list!" }
        }

        const addedItem = WishListDAO.addWishListItem(userID, bookID);
        if (!addedItem) {
            return { success: false, data: "Failed to add the book to the wish list!" }
        }
        return { success: true, data: 'Book was added to the wish list!' };
    }

    static removeBookFromWishList(userID, bookID) {
        const wishListItem = WishListDAO.getWishListItem(userID, bookID);
        if (wishListItem === null) {
            return { success: false, data: "Book is not in the wish list!" }
        }

        const isDeleted = WishListDAO.deleteWishListItem(userID, bookID);
        if (!isDeleted) {
            return { success: false, data: "Failed to delete the book from the wish list!" }
        }
        return { success: true, data: 'Book was deleted from the wish list!' };
    }
}