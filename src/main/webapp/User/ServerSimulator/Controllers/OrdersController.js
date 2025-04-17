'use strict';

import OrdersDAO from '../DB/OrdersDAO.js';
import PaymentMethods from '../Models/PaymentMethods.js';
import { CartController } from "./CartController.js";
import BooksDAO from "../DB/BooksDAO.js";
import Order from "../Models/Order.js";
import UsersDAO from "../DB/UsersDAO.js";
import ShippingFeeCalculator from "../Utils/ShippingFeeCalculator.js";
import OrderItem from "../Models/OrderItem.js";
import CreditCardAPI from "../Utils/CreditCardAPI.js";
import CartDAO from "../DB/CartDAO.js";
import OrderStatus from "../Models/OrderStatus.js";

export class OrdersController {
    static getOrders(userID) {
        const orders = OrdersDAO.getOrdersForUser(userID)
            .sort((a, b) => new Date(b.date) - new Date(a.date));
        return { success: true, data: orders };
    }

    static getOrder(userID, orderID) {
        const order = OrdersDAO.getOrder(userID, orderID);
        if (order === null) {
            return { success: false, data: "Order not found" };
        }
        return { success: true, data: order };
    }

    static place(userID, paymentDetails, paymentMethod) {
        const address = paymentDetails.address;

        const isCartValidJSON = CartController.validateCart(userID);
        if (!isCartValidJSON.success) {
            return isCartValidJSON;
        }

        const cart = CartDAO.getCart(userID);
        if (!cart) {
            return { success: false, data: "Unknown error, Cart not found!" };
        }

        // Calculate the total cost of the order
        let totalCost = 0;
        cart.items.forEach(item => {
            const bookID = item.bookID;
            const book = BooksDAO.getBook(bookID);

            if (book) {
                totalCost += book.price * item.quantity * (1 - book.discountedPercentage / 100);
            }
        });

        const shippingFee = ShippingFeeCalculator.calculateShippingFee(cart.items);
        totalCost += shippingFee;

        // Payment process before proceeding with the order placement.
        if (paymentMethod === PaymentMethods.CREDIT_CARD) {
            const creditCreditInfo = {
                nameOnCard: paymentDetails.nameOnCard,
                cardNumber: paymentDetails.cardNumber,
                expiryYear: paymentDetails.expiryYear,
                expiryMonth: paymentDetails.expiryMonth,
                cvc: paymentDetails.cvc
            };

            const isPaymentDone = CreditCardAPI.pay(
                creditCreditInfo, totalCost);

            if (!isPaymentDone) {
                return {success: false, data: 'Purchase failed!'};
            }
        } else { // paying with account balance.
            const user = UsersDAO.getUser(userID);
            console.log(user);
            if (user.accountBalance < totalCost) {
                return {success: false, data: "Insufficient account balance!"};
            }
            user.accountBalance -= totalCost;
            UsersDAO.saveUser(user);
        }

        // Reduce the books' stock and create the orders items list.
        const orderItems = []
        cart.items.forEach(item => {
            const bookID = item.bookID;
            const book = BooksDAO.getBook(bookID);

            if (book) {
                book.stock -= item.quantity;
                BooksDAO.saveBook(book);
                orderItems.push(new OrderItem(
                    bookID,
                    item.quantity,
                    book.price * (1 - book.discountedPercentage / 100)
                ));
            }
        });

        const orderDate = new Date().toISOString();
        // Create order
        const rawOrders = OrdersDAO.getOrdersForUser(userID);
        const orders = rawOrders.map(order => Order.fromJSON(order));

        const newOrder = new Order();
        newOrder.orderID = orders.length > 0 ? Math.max(...orders.map(o => o.orderID)) + 1 : 1;
        newOrder.userID = userID;
        newOrder.date = orderDate;
        newOrder.address = address;
        newOrder.paymentMethod = paymentMethod;
        newOrder.shippingFee = shippingFee;
        newOrder.orderItems = orderItems;
        newOrder.status = OrderStatus.CONFIRMED;

        // The DAO will append the orderID.
        const createdOrder = OrdersDAO.createOrder(newOrder);

        CartController.truncate(userID);
        return { success: true, data: `Order placed successfully, with ID#${createdOrder.orderID}.` };
    }
}
