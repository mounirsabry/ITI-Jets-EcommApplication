'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import OrdersManager from "./Managers/OrdersManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import Order from "./Models/Order.js";

import { addOrderDateTimeAddress } from "./Utils/UICommonFunctions.js";

document.addEventListener('DOMContentLoaded', function () {
    checkForErrorMessageParameter();

    const backToProfileButton = document.getElementById('backToProfile');
    if (!backToProfileButton) {
        console.log('Could not locate the back to profile button.');
    } else {
        backToProfileButton.addEventListener('click', () => {
            window.location.href = URL_Mapper.PROFILE;
        });
    }

    const ordersList = document.getElementById('ordersList');
    if (!ordersList) {
        console.error('Could not locate the orders list component!');
        return;
    }

    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }

    OrdersManager.getOrdersList(userObject.userID, renderOrders, null);

    function renderOrders(orders) {
        let parsedOrders = orders.map((order) => {
            try {
                return Order.fromJSON(order);
            } catch (_) {
                console.error('Could not parse an order from the orders list!');
                return null;
            }
        }).filter((order) => order !== null);

        ordersList.innerHTML = '';

        parsedOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.classList.add('order-item');

            // Create the order details container
            const orderDetails = document.createElement('div');
            orderDetails.className = 'order-details';

            const orderIdHeading = document.createElement('h2');
            orderIdHeading.textContent = `Order #${order.orderID}`;
            orderDetails.appendChild(orderIdHeading);

            addOrderDateTimeAddress(orderDetails, order);

            const orderItems = order.orderItems;
            let numberOfDifferentBooks = 'Unknown';
            if (orderItems) {
                numberOfDifferentBooks = orderItems.length;
            }
            const differentBooksCountParagraph = document.createElement('p');
            differentBooksCountParagraph.innerHTML = `
                <strong>Number of Different Books:</strong> ${numberOfDifferentBooks}
            `;
            orderDetails.appendChild(differentBooksCountParagraph);

            // Append the order details container to the order item
            orderItem.appendChild(orderDetails);

            // Create and append the view order button
            const viewOrderButton = document.createElement('button');
            viewOrderButton.className = 'view-order-button';
            viewOrderButton.textContent = 'View Order';
            orderItem.appendChild(viewOrderButton);

            // Add event listener to the View Order button
            viewOrderButton.addEventListener('click', () => {
                window.location.href = URL_Mapper.ORDER_DETAILS + `?orderID=${order.orderID}`;
            });

            ordersList.appendChild(orderItem);
        });
    }
});