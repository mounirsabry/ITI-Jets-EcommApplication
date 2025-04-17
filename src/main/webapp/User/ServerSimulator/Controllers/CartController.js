'use strict';

import CartDAO from '../DB/CartDAO.js';
import BooksDAO from '../DB/BooksDAO.js';
import ShippingFeeCalculator from "../Utils/ShippingFeeCalculator.js";
import CartItem from "../Models/CartItem.js";

export class CartController {
    static getCart(userID) {
        const cart = CartDAO.getCart(userID);
        if (cart === null) {
            return { success: false, data: 'User does not have a cart!' };
        }
        const cartItemsList = [];
        cart.items.forEach(item => {
            const cartItem = new CartItem(item.bookID, item.quantity);
            cartItemsList.push(cartItem);
        })

        return { success: true, data: cartItemsList };
    }

    static validateCart(userID) {
        const cart = CartDAO.getCart(userID);
        if (cart === null) {
            return { success: false, data: 'User does not have a cart!' };
        }

        if (cart.items.length === 0) {
            return { success: false, data: 'Cart is empty, cannot checkout without items!' };
        }

        try {
            cart.items.forEach(cartItem => {
                const bookID = cartItem.bookID;
                const quantity = cartItem.quantity;

                if (!bookID || isNaN(parseInt(bookID))) {
                    throw new Error('One of the books had invalid ID!');
                }

                const book = BooksDAO.getBook(bookID);
                if (!book) {
                    throw new Error(`Book with ID = ${bookID} does not exist!`);
                }

                if (!book.isAvailable) {
                    throw new Error(`Book with ID = ${bookID} is not available!`);
                }

                if (book.stock <= 0) {
                    throw new Error(`Book with ID = ${bookID} is out of stock!`);
                }

                if (quantity > book.stock) {
                    throw new Error(`The requested quantity of book with ID = ${bookID} is bigger than the stock!`);
                }
            });
        } catch (error) {
            return { success: false, data: error.data };
        }
        return { success: true, data: 'Cart is valid and you can continue with checkout.' };
    }
    
    static getCartShippingFee(userID) {
        const validationResponse = CartController.validateCart(userID);
        if (!validationResponse.success) {
            return validationResponse;
        }

        const cart = CartDAO.getCart(userID);
        const shippingFee = ShippingFeeCalculator.calculateShippingFee(cart.items);
        return { success: true, data: shippingFee };
    }
    
    static addItem(userID, bookID, quantity) {
        const cart = CartDAO.getCart(userID);
        if (cart === null) {
            return { success: false, data: 'User does not have a cart!' };
        }

        const book = BooksDAO.getBook(bookID);
        if (!book) {
            return { success: false, data: `Book with ID = ${bookID} does not exist!` };
        }
        const existingItem = cart.items.find(item => item.bookID === bookID);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push(new CartItem(bookID, quantity));
        }

        CartDAO.saveCart(cart);
        return { success: true, data: 'Book added to cart successfully.' };
    }

	static updateItem(userID, bookID, newQuantity) {
        const cart = CartDAO.getCart(userID);
        if (cart === null) {
            return { success: false, data: 'User does not have a cart!' };
        }

        const book = BooksDAO.getBook(bookID);
        if (!book) {
            return { success: false, data: `Book with ID = ${bookID} does not exist!` };
        }

        const item = cart.items.find(i => i.bookID === bookID);
        if (!item) {
            return { success: false, data: 'Book not found in the cart!' };
        }

        item.quantity = newQuantity;
        CartDAO.saveCart(cart);
        return { success: true, data: 'Book in cart updated successfully.' };
    }

    static removeItem(userID, bookID) {
        const cart = CartDAO.getCart(userID);
        if (cart === null) {
            return { success: false, data: 'User does not have a cart!' };
        }

        const cartBook = cart.items.find(item => item.bookID === bookID);
        if (!cartBook) {
            return { success: false, data: 'Book not found in the cart!' };
        }

        cart.removeItem(bookID);
        CartDAO.saveCart(cart);
        return { success: true, data: 'Item removed from cart successfully.' };
    }

    static truncate(userID) {
        CartDAO.truncateCart(userID);
        return { success: true, data: 'Cart cleared' };
    }
}