'use strict';

import testingBooks from '../Generators/BooksGenerator.js';
import testingUsers from '../Generators/UsersGenerator.js';
import OrdersGenerator from '../Generators/OrdersGenerator.js';
import testingPurchaseHistory from "../Generators/PurchaseHistoryGenerator.js";
import BooksDAO from '../DB/BooksDAO.js';
import UsersDAO from '../DB/UsersDAO.js';
import OrdersDAO from '../DB/OrdersDAO.js';
import CartDAO from '../DB/CartDAO.js';
import PurchaseHistoryDAO from "../DB/PurchaseHistoryDAO.js";

class InitController {
    constructor() {
        this.initializeData()
    }

    initializeData(forceReset = false) {
        if (!forceReset && this.dataExists()) {
            return { initialized: false, data: "Data already exists" };
        }

        // Generate mock data
        const books = testingBooks;
        const users = testingUsers
        const orders = OrdersGenerator.generate(users, books);
        const purchaseHistory = testingPurchaseHistory;

        // Seed data through DAOs
        BooksDAO.saveAllBooks(books);
        UsersDAO.saveAllUsers(users);
        OrdersDAO.saveAllOrders(orders);
        PurchaseHistoryDAO.saveAllHistoryItems(purchaseHistory);

        // Initialize empty carts for users
        users.forEach(user => {
            CartDAO.createCart(user.userID);
        });

        return {
            initialized: true,
            counts: {
                books: books.length,
                users: users.length,
                orders: orders.length,
                carts: users.length,
                purchaseHistory: purchaseHistory.length
            }
        };
    }

    dataExists() {
        return BooksDAO.getAllRawBooks().length > 0 &&
            UsersDAO.getAllRawUsers().length > 0 &&
            CartDAO.getAllRawCarts().length > 0 &&
            PurchaseHistoryDAO.getRawPurchaseHistoryList().length > 0;
    }

    resetData() {
        return this.initializeData(true);
    }
}

export default new InitController();