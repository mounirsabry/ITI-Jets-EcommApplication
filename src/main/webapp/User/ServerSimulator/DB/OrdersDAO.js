'use strict';

import Order from "../Models/Order.js";

class OrdersDAO {
    #STORAGE_KEY = 'orders';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]')
        }
    }

    getAllRawOrders() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY)) || [];
    }

    getOrdersForUser(userID) {
        return this.getAllRawOrders()
            .map(order => Order.fromJSON(order))
            .filter(order => order.userID === userID);
    }

    getOrder(userID, orderID) {
        const foundOrder = this.getAllRawOrders()
            .map(order => Order.fromJSON(order))
            .find(order => {
            return order.userID === userID
                && order.orderID === orderID;
        });
        return foundOrder || null;
    }

    createOrder(newOrder) {
        const rawOrders = this.getAllRawOrders();
        const orders = rawOrders.map(order => Order.fromJSON(order));


        orders.push(newOrder);
        this.saveAllOrders(orders);
        return newOrder;
    }

    saveAllOrders(orders) {
        const serializedOrders = orders.map(order => order.toJSON());
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(serializedOrders));
    }
}

export default new OrdersDAO();