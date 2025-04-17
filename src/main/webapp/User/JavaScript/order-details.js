'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import displayProduct from "./Common/BookPopup.js";
import { addOrderDateTimeAddress } from "./Utils/UICommonFunctions.js";
import OrdersManager from "./Managers/OrdersManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";

import Order from "./Models/Order.js";
import { BooksManager } from "./Managers/BooksManager.js";
import Book from "./Models/Book.js";

document.addEventListener("DOMContentLoaded", function () {
    checkForErrorMessageParameter();

    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    let orderID = urlParams.get("orderID");
    if (!orderID) {
        window.location.href = URL_Mapper.ORDERS + `?errorMessage=${encodeURIComponent('No order ID specified!')}`;
        return;
    }

    try {
        orderID = JSON.parse(orderID);
    } catch (error) {
        window.location.href = URL_Mapper.ORDERS + `?errorMessage=${encodeURIComponent('Could not parse the order ID!')}`;
        return;
    }

    const backToOrdersButton = document.getElementById('backToOrdersButton');
    if (!backToOrdersButton) {
        console.error('Could not locate the back to orders button.');
    } else {
        backToOrdersButton.addEventListener('click', () => {
            window.location.href = URL_Mapper.ORDERS;
        });
    }

    const orderTitle = document.getElementById('orderTitle');
    if (!orderTitle) {
        console.error('Could not locate the order title component.');
    }

    const orderDetails = document.getElementById('orderDetails');
    if (!orderDetails) {
        console.error('Could not locate the order details component.');
    }

    const orderItemsContainer = document.getElementById('orderItems');
    if (!orderItemsContainer) {
        console.error('Could not locate the order items container.');
        return;
    }

    const subtotalComponent = document.getElementById('subtotal');
    if (!subtotalComponent) {
        console.error('Could not locate subtotal component.');
    }

    const shippingFeeComponent = document.getElementById('shippingFee');
    if (!shippingFeeComponent) {
        console.error('Could not locate shipping fee component.');
    }

    const totalAmountComponent = document.getElementById('totalAmount');
    if (!totalAmountComponent) {
        console.error('Could not locate total amount component.');
    }

    OrdersManager.getOrderDetails(userObject.userID, orderID, callbackOnOrderDetailsSuccessful, null);

    function callbackOnOrderDetailsSuccessful(order) {
        let parsedOrder;
        try {
            parsedOrder = Order.fromJSON(order);
        } catch (_) {
            window.location.href = URL_Mapper.ORDERS + `?errorMessage=${encodeURIComponent('Could not find an order with this order ID!')}`;
            return;
        }

        if (orderTitle) {
            orderTitle.textContent = `Order #${parsedOrder.orderID}`;
        }

        if (orderDetails) {
            addOrderDetails(parsedOrder);
        }

        renderOrderItems(parsedOrder);
    }

    function addOrderDetails(order) {
        addOrderDateTimeAddress(orderDetails, order);

        const numberOfItemsParagraph = document.createElement('p');
        numberOfItemsParagraph.innerHTML = `<strong>Number of Items:</strong> ${order.orderItems.length}`;
        orderDetails.appendChild(numberOfItemsParagraph);
    }

    function renderOrderItems(order) {
        orderItemsContainer.innerHTML = '';

        order.orderItems.forEach(orderItem => {
            const bookElement = document.createElement('div');
            bookElement.classList.add('order-item');
            orderItemsContainer.appendChild(bookElement);

            BooksManager.getBookDetails(orderItem.bookID, (book) => {
                loadBookInfoElementOnSuccess(bookElement, orderItem, book, () => {
                    const subtotalChange = orderItem.priceAtPurchase * orderItem.quantity;
                    updatePriceSummarySectionOnChange(subtotalChange);
                });
            });
        });


        if (shippingFeeComponent) {
            shippingFeeComponent.textContent = order.shippingFee.toFixed(2);
        }
    }

    function loadBookInfoElementOnSuccess(bookElement, orderItem, book, callbackAfterLoad) {
        let parsedBook;
        try {
            parsedBook = Book.fromJSON(book);
        } catch (_) {
            console.error('Could not parse a book.');
            bookElement.classList.add('no-data-found');
            bookElement.textContent = 'Could Not Find This Book.';
            return;
        }

        const mainImage = parsedBook.images?.find(image => image.isMain);
        let imagePath;
        if (mainImage) {
            imagePath = mainImage.url;
        } else {
            imagePath = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
        }

        let subtotalPrice = orderItem.priceAtPurchase * orderItem.quantity;

        // Create the image element.
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = parsedBook.title;
        img.className = 'book-image';
        bookElement.appendChild(img);

        // Create the book details container.
        const bookDetails = document.createElement('div');
        bookDetails.className = 'book-details';

        // Create and append the title.
        const title = document.createElement('h2');
        title.textContent = parsedBook.title;
        bookDetails.appendChild(title);

        // Create and append the overview.
        const overview = document.createElement('p');
        overview.textContent = parsedBook.overview;
        overview.classList.add('overview');
        bookDetails.appendChild(overview);

        // Create and append the author.
        const author = document.createElement('p');
        author.innerHTML = `<strong>Author:</strong> ${parsedBook.author}`;
        bookDetails.appendChild(author);

        // Create and append the ISBN.
        const isbn = document.createElement('p');
        isbn.innerHTML = `<strong>ISBN:</strong> ${parsedBook.isbn}`;
        bookDetails.appendChild(isbn);

        // Append the book details to the main container.
        bookElement.appendChild(bookDetails);

        // Create the price section container.
        const priceSection = document.createElement('div');
        priceSection.className = 'price-section';

        if (orderItem.quantity === 1) {
            const priceInfo = document.createElement('p');
            priceInfo.innerHTML = `<strong>Price:</strong> ${orderItem.priceAtPurchase.toFixed(2)}`;
            priceSection.appendChild(priceInfo);
        } else {
            const pricePerPieceParagraph = document.createElement('p');
            pricePerPieceParagraph.innerHTML = `<strong>Price per Piece:</strong> ${orderItem.priceAtPurchase.toFixed(2)}`;
            priceSection.appendChild(pricePerPieceParagraph);

            const quantityParagraph = document.createElement('p');
            quantityParagraph.innerHTML = `<strong>Quantity:</strong> ${orderItem.quantity}`;
            priceSection.appendChild(quantityParagraph);

            const totalItemPriceParagraph = document.createElement('p');
            totalItemPriceParagraph.innerHTML = `<strong>Total Price:</strong> ${subtotalPrice.toFixed(2)}`;
            priceSection.appendChild(totalItemPriceParagraph);
        }
        bookElement.appendChild(priceSection);

        img.addEventListener('click', () => {
            displayProduct(parsedBook);
        });

        callbackAfterLoad();
    }

    function updatePriceSummarySectionOnChange(subtotalChange) {
        if (subtotalComponent) {
            subtotalComponent.textContent = (parseFloat(subtotalComponent.textContent) + subtotalChange).toFixed(2);
        }
        const shippingFee = parseFloat(shippingFeeComponent.textContent);

        if (totalAmountComponent) {
            totalAmountComponent.textContent = (parseFloat(subtotalComponent.textContent) + shippingFee).toFixed(2) + ' EGP';
        }
    }
});