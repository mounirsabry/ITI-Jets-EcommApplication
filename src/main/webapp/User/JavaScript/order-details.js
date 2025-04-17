'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import displayProduct from "./Common/BookPopup.js";
import { formatDate, formatTime } from "./Utils/UICommonFunctions.js";

document.addEventListener("DOMContentLoaded", function () {
    checkForErrorMessageParameter();

    const urlParams = new URLSearchParams(window.location.search);
    let orderID = urlParams.get("orderID");
    if (!orderID) {
        window.location.href = URL_Mapper.ORDERS + `?errorMessage=${encodeURIComponent('No order ID specified!')}`;
    }

    try {
        orderID = JSON.parse(orderID);
    } catch (error) {
        window.location.href = URL_Mapper.ORDERS + `?errorMessage=${encodeURIComponent('Could not parse the order ID!')}`;
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
    } else {
        orderTitle.textContent = `Order #${order.orderID}`;
    }

    const orderDetails = document.getElementById('orderDetails');
    if (!orderDetails) {
        console.error('Could not locate the order details component.');
    } else {
        // Create and append the date paragraph
        const dateParagraph = document.createElement('p');
        dateParagraph.innerHTML = `<strong>Date:</strong> ${formatDate(order.date)}`;
        orderDetails.appendChild(dateParagraph);

        // Create and append the time paragraph
        const timeParagraph = document.createElement('p');
        timeParagraph.innerHTML = `<strong>Time:</strong> ${formatTime(order.date)}`;
        orderDetails.appendChild(timeParagraph);

        // Create and append the address paragraph
        const addressParagraph = document.createElement('p');
        addressParagraph.innerHTML = `<strong>Address:</strong> ${order.address}`;
        orderDetails.appendChild(addressParagraph);

        const numberOfItemsParagraph = document.createElement('p');
        numberOfItemsParagraph.innerHTML = `<strong>Number of Items:</strong> ${orderItems.length}`;
        orderDetails.appendChild(numberOfItemsParagraph);
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

    function renderOrderItems(orderItems) {
        orderItemsContainer.innerHTML = '';

        let subtotal = 0;
        orderItems.forEach(item => {
            const bookID = item.bookID;
            const quantity = item.quantity;

            let itemBook = getBookByID(bookID);

            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');

            if (itemBook == null) {
                itemDiv.classList.add('no-data-found');
                itemDiv.textContent = 'Could Not Find This Book.';
                orderItemsContainer.appendChild(itemDiv);
                return;
            }

            const mainImage = itemBook.images?.find(image => image.isMain);
            let imagePath;
            if (mainImage) {
                imagePath = mainImage.url;
            } else {
                imagePath = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
            }

            let bookPrice = parseInt(itemBook.price);
            let totalItemPrice;

            if (isNaN(bookPrice)) {
                bookPrice = 'Not Specified';
            } else {
                totalItemPrice = bookPrice * quantity;
                subtotal += totalItemPrice;
            }

            // Create the image element
            const img = document.createElement('img');
            img.src = imagePath;
            img.alt = itemBook.title;
            img.className = 'book-image';
            itemDiv.appendChild(img);

            // Create the book details container
            const bookDetails = document.createElement('div');
            bookDetails.className = 'book-details';

            // Create and append the title
            const title = document.createElement('h2');
            title.textContent = itemBook.title;
            bookDetails.appendChild(title);

            // Create and append the overview
            const overview = document.createElement('p');
            overview.textContent = itemBook.overview;
            overview.classList.add('overview');
            bookDetails.appendChild(overview);

            // Create and append the author
            const author = document.createElement('p');
            author.innerHTML = `<strong>Author:</strong> ${itemBook.author}`;
            bookDetails.appendChild(author);

            // Create and append the ISBN
            const isbn = document.createElement('p');
            isbn.innerHTML = `<strong>ISBN:</strong> ${itemBook.isbn}`;
            bookDetails.appendChild(isbn);

            // Append the book details to the main container
            itemDiv.appendChild(bookDetails);

            // Create the price section container
            const priceSection = document.createElement('div');
            priceSection.className = 'price-section';

            if (quantity === 1) {
                const priceInfo = document.createElement('p');
                priceInfo.innerHTML = `<strong>Price:</strong> ${totalItemPrice} EGP`;
                priceSection.appendChild(priceInfo);
            } else {
                const pricePerPieceParagraph = document.createElement('p');
                pricePerPieceParagraph.innerHTML = `<strong>Price per Piece:</strong> ${bookPrice} EGP`;
                priceSection.appendChild(pricePerPieceParagraph);

                const quantityParagraph = document.createElement('p');
                quantityParagraph.innerHTML = `<strong>Quantity:</strong> ${quantity}`;
                priceSection.appendChild(quantityParagraph);

                const totalItemPriceParagraph = document.createElement('p');
                totalItemPriceParagraph.innerHTML = `<strong>Total Price:</strong> ${totalItemPrice} EGP`;
                priceSection.appendChild(totalItemPriceParagraph);
            }
            itemDiv.appendChild(priceSection);

            img.addEventListener('click', () => {
                displayProduct(itemBook);
            });

            orderItemsContainer.appendChild(itemDiv);
        });

        if (subtotalComponent) {
            subtotalComponent.textContent = subtotal + ' EGP';
        }
        if (shippingFeeComponent) {
            shippingFeeComponent.textContent = order.shippingFee + ' EGP';
        }
        if (totalAmountComponent) {
            totalAmountComponent.textContent = (subtotal + order.shippingFee).toFixed(2) + ' EGP';
        }
    }

    renderOrderItems(orderItems);



    function getBookByID(bookID) {
        // Simulate fetching book details (replace with actual API call if needed)
        const books = [
            { bookID: 1, title: 'Book One', overview: 'Overview of Book One', author: 'Author One', isbn: 'ISBN-123456', price: 100, images: [{ url: 'book1.jpg', isMain: true }] },
            { bookID: 2, title: 'Book Two', overview: 'Overview of Book Two', author: 'Author Two', isbn: 'ISBN-654321', price: 200, images: [{ url: 'book2.jpg', isMain: true }] }
        ];
        return books.find(book => book.bookID === bookID) || null;
    }
});