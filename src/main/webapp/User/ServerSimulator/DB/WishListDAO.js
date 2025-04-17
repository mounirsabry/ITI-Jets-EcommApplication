'use strict';

import WishListItem from '../Models/WishListItem.js';

class WishListDAO {
    #STORAGE_KEY = 'wishList';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]')
        }
    }

    getRawWishList() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY));
    }

    getWishListItem(userID, bookID) {
        const foundItem = this.getRawWishList()
            .map(wishListItem => WishListItem.fromJSON(wishListItem))
            .find(wishListItem => wishListItem.userID === userID && wishListItem.bookID === bookID);
        return foundItem || null;
    }

    getUserWishList(userID) {
        const foundList = this.getRawWishList()
            .map(wishListItem => WishListItem.fromJSON(wishListItem))
            .filter(wishListItem => wishListItem.userID === userID);
        return foundList || [];
    }

    addWishListItem(userID, bookID) {
        const rawWishList = this.getRawWishList();
        const wishList = rawWishList.map(jsonItem => WishListItem.fromJSON(jsonItem));

        // Create a new wishlist item
        const newItem = new WishListItem(userID, bookID);
        wishList.push(newItem);

        this.saveAllWishList(wishList)
        return newItem;
    }

    // Delete a wishlist item for a user.
    deleteWishListItem(userID, bookID) {
        const rawWishList = this.getRawWishList();
        const wishList = rawWishList.map(jsonItem => WishListItem.fromJSON(jsonItem));

        // Find the index of the item to delete
        const indexToRemove = wishList
            .findIndex(wishListItem => {
            return wishListItem.userID === userID && wishListItem.bookID === bookID;
        });

        // If item not found, throw an error.
        if (indexToRemove === -1) {
            throw new Error('Wishlist item not found!');
        }

        // Remove the item
        wishList.splice(indexToRemove, 1);

        this.saveAllWishList(wishList)
        return true;
    }

    saveAllWishList(wishList) {
        const jsonWishList = wishList.map(wishListItem => wishListItem.toJSON());
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(jsonWishList));
    }
}

export default new WishListDAO();