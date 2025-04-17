'use strict';

import Cart from '../Models/Cart.js'

class CartDAO {
    #STORAGE_KEY = 'carts';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]');
        }
    }

    getAllRawCarts() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY));
    }

    getCart(userID) {
        const foundCart = this.getAllRawCarts()
            .map(cart => Cart.fromJSON(cart))
            .find(cart => cart.userID === userID);
        return foundCart || null;
    }

    createCart(userID) {
        const rawCarts = this.getAllRawCarts();
        const carts = rawCarts.map(cart => Cart.fromJSON(cart));

        if (!carts.some(cart => cart.userID === userID)) {
            const newCart = new Cart();
            newCart.userID = userID;
            carts.push(newCart);
            this.saveAllCarts(carts);
        }
    }

    saveCart(updatedCart) {
        const rawCarts = this.getAllRawCarts();
        const carts = rawCarts.map(cart => Cart.fromJSON(cart));

        const index = carts.findIndex(c => c.userID === updatedCart.userID);
        if (index >= 0) {
            carts[index] = updatedCart;
        } else {
            throw new Error('User does not have a cart!');
        }
        this.saveAllCarts(carts);
    }

    saveAllCarts(carts) {
        localStorage.setItem(
            this.#STORAGE_KEY,
            JSON.stringify(carts.map(cart => cart.toJSON()))
        );
    }

    truncateCart(userID) {
        const cart = this.getCart(userID);
        if (!cart) {
            throw new Error('User does not have a cart!');
        }

        cart.items = [];
        this.saveCart(cart);
    }
}

export default new CartDAO();