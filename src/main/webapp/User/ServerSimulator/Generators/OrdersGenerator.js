'use strict';

import Order from '../Models/Order.js';
import PaymentMethods from '../Models/PaymentMethods.js';
import ShippingFeeCalculator from "../Utils/ShippingFeeCalculator.js";
import OrderItem from "../Models/OrderItem.js";
import OrderStatus from "../Models/OrderStatus.js";

// Function to generate a random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to generate a unique random numeric order ID
function generateUniqueOrderID(existingOrderIDs) {
    let orderID;
    do {
        orderID = getRandomInt(1000, 9999); // Generates a 4-digit number
    } while (existingOrderIDs.has(orderID));
    existingOrderIDs.add(orderID);
    return orderID;
}

function generateRandomDateAndTime() {
    // Define the range for past dates (up to 1 month ago)
    const now = new Date();
    const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());

    // Generate a random timestamp between the current date and 1 month ago
    const randomTimestamp = new Date(
        oneMonthAgo.getTime() +
        Math.random() * (now.getTime() - oneMonthAgo.getTime())
    );

    // Return the date in ISO format
    return randomTimestamp.toISOString();
}

// Function to generate a random order with order items
function generateRandomOrder(userID, books, existingOrderIDs) {
    const orderID = generateUniqueOrderID(existingOrderIDs);
    const date = generateRandomDateAndTime();
    const address = `Address ${getRandomInt(1, 100)}`;
    const paymentMethod = Object.values(PaymentMethods)[getRandomInt(0, Object.values(PaymentMethods).length - 1)];
    const numberOfItems = getRandomInt(1, 5);

    const orderItems = Array.from({ length: numberOfItems }, () => {
        const randomBook = books[getRandomInt(0, books.length - 1)];
        const quantity = getRandomInt(1, 10);
        return new OrderItem(
            randomBook.bookID,
            quantity,
            randomBook.price * (1 - randomBook.discountedPercentage / 100)
        );
    });

    const shippingFee = ShippingFeeCalculator.calculateShippingFee(orderItems)

    const randomStatus = Object.values(OrderStatus)[getRandomInt(0, Object.values(OrderStatus).length - 1)];

    const newOrder = new Order();
    newOrder.orderID = orderID;
    newOrder.userID = userID;
    newOrder.date = date;
    newOrder.address = address;
    newOrder.paymentMethod = paymentMethod;
    newOrder.shippingFee = shippingFee;
    newOrder.orderItems = orderItems;
    newOrder.status = randomStatus;

    return newOrder;
}

// Class to generate orders
class OrdersGenerator {
    static generate(users, books) {
        const existingOrderIDs = new Set();

        return users.flatMap(user => {
            const orderCount = getRandomInt(1, 3);
            return Array.from({ length: orderCount },
                () => generateRandomOrder(user.userID, books, existingOrderIDs));
        });
    }
}

// Export the OrdersGenerator class
export default OrdersGenerator;