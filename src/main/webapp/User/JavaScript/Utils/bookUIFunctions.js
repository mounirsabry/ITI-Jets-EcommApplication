'use strict';

import URL_Mapper from './URL_Mapper.js';
import displayProduct from "../Common/BookPopup.js";
import { CartManager } from "../Managers/CartManager.js";
import UserAuthTracker from "../Common/UserAuthTracker.js";
import MessagePopup from "../Common/MessagePopup.js";

const createBookCard = function(book) {
    const mainImage = book.images.find(image => image.isMain);
    const imageURL = mainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;

    // Create elements.
    const bookElement = document.createElement("div");
    bookElement.classList.add("book-card");

    const imgElement = document.createElement('img');
    imgElement.src = imageURL;
    imgElement.alt = book.title;
    imgElement.className = 'product-image';

    const titleElement = document.createElement('h3');
    titleElement.textContent = book.title;

    const bookCardDetails = document.createElement('div');
    bookCardDetails.classList.add('book-card-details');

    // Helper function to create detail paragraphs.
    const createDetailElement = (text, className = '') => {
        const el = document.createElement('p');
        if (className) el.classList.add(className);
        el.textContent = text || 'Not specified';
        return el;
    };

    // Append details.
    bookCardDetails.append(
        createDetailElement(book.overview, 'overview'),
        createDetailElement(book.genre, 'genre'),
        createDetailElement(book.author, 'author'),
        createDetailElement(`${book.price} EGP`, 'price')
    );

    // Assemble card
    bookElement.append(imgElement, titleElement, bookCardDetails);
    appendStockValue(bookElement, book);
    appendAddToCartControls(bookElement, book);

    // Update function (closure captures all elements)
    function updateCard(updatedBook) {
        // Update main image if changed
        const newMainImage = updatedBook.images?.find(img => img.isMain);
        const newImageURL = newMainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
        if (newImageURL !== imgElement.src) {
            imgElement.src = newImageURL;
        }

        // Update text content
        titleElement.textContent = updatedBook.title || book.title;

        // Update details
        const details = bookCardDetails.querySelectorAll('p');
        if (details.length >= 4) {
            details[0].textContent = updatedBook.overview || book.overview;  // Overview
            details[1].textContent = updatedBook.genre || book.genre;       // Genre
            details[2].textContent = updatedBook.author || book.author;     // Author
            details[3].textContent = updatedBook.price ? `${updatedBook.price} EGP` : book.price; // Price
        }

        updateStockValue(bookElement, updatedBook);

        // Remove the old quantity specifier and add to cart (if they exist).
        const oldQuantitySelector = bookElement.querySelector('.quantity-selector');
        if (oldQuantitySelector) {
            oldQuantitySelector.remove();
        }

        const odlAddToCartButton = bookElement.querySelector('.add-to-cart');
        if (odlAddToCartButton) {
            odlAddToCartButton.remove();
        }
        appendAddToCartControls(bookElement, updatedBook);
    }

    // Make the update function available to click handler.
    imgElement.addEventListener('click', () => {
        displayProduct(book, updateCard);
    });

    return bookElement;
};

const updateStockValue = function(bookElement, book) {
    // Find existing stock status element
    const oldStockElement = bookElement.querySelector('.stock-status');

    // Create new stock status element
    const newStockElement = createStockElement(book);

    // Replace or append the element
    if (oldStockElement) {
        oldStockElement.replaceWith(newStockElement);
    } else {
        bookElement.appendChild(newStockElement);
    }
};

// Helper function to create stock element (extracted from appendStockValue)
const createStockElement = function(book) {
    const paragraph = document.createElement('p');
    paragraph.className = 'stock-status';

    if (!book.isAvailable || !book.stock) {
        paragraph.classList.add('out-stock');
        paragraph.textContent = 'Book Not Available';
        return paragraph;
    }

    // Determine stock status and CSS class
    let stockText;
    let stockClass;
    if (book.stock > 20) {
        stockText = 'In Stock';
        stockClass = 'in-stock';
    } else if (book.stock === 0) {
        stockText = 'Out of Stock';
        stockClass = 'out-stock';
    } else if (book.stock === 1) {
        stockText = 'Last Piece';
        stockClass = 'last-piece';
    } else {
        stockText = `${book.stock} Pieces Left`;
        stockClass = 'low-stock';
    }

    paragraph.classList.add(stockClass);
    paragraph.textContent = stockText;
    return paragraph;
};

// Updated appendStockValue to use the helper function
const appendStockValue = function(bookElement, book) {
    const stockElement = createStockElement(book);
    bookElement.appendChild(stockElement);
};

const appendAddToCartControls = function(bookElement, book) {
    if (book.stock <= 0 || !book.isAvailable) {
        return;
    }

    // Create the quantity selector container
    const quantitySelector = document.createElement('div');
    quantitySelector.className = 'quantity-selector';

    // Create the decrease button
    const decreaseButton = document.createElement('button');
    decreaseButton.className = 'decrease';
    decreaseButton.textContent = '-';

    // Create the input element
    const quantityInput = document.createElement('input');
    quantityInput.type = 'number';
    quantityInput.value = '1';
    quantityInput.min = '1';
    quantityInput.max = Math.min(book.stock, 20).toString();
    quantityInput.readOnly = true;

    // Create the increase button
    const increaseButton = document.createElement('button');
    increaseButton.className = 'increase';
    increaseButton.textContent = '+';

    // Append the buttons and input to the quantity selector
    quantitySelector.appendChild(decreaseButton);
    quantitySelector.appendChild(quantityInput);
    quantitySelector.appendChild(increaseButton);

    // Create the add to cart button
    const addToCartButton = document.createElement('button');
    addToCartButton.className = 'add-to-cart';
    addToCartButton.textContent = 'Add to Cart';

    bookElement.appendChild(quantitySelector);
    bookElement.appendChild(addToCartButton);

    function updateQuantity(quantity) {
        decreaseButton.disabled = (quantity === 1);
        increaseButton.disabled = quantity >= Math.min(book.stock, 20);
    }
    updateQuantity(1);

    decreaseButton.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = `${value - 1}`;
            updateQuantity(value - 1);
        }
    });

    increaseButton.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < Math.min(book.stock, 20)) {
            quantityInput.value = `${value + 1}`;
            updateQuantity(value + 1);
        }
    });

    addToCartButton.addEventListener('click', () => {
        let quantity;
        try {
            quantity = quantityInput.value;
            quantity = parseInt(quantity);
        } catch (_) {
            MessagePopup.show('Could not parse quantity to int in add to cart event handler!', true);
        }
        addToCart(book, quantity);
    });
}

const addToCart = function(book, quantity) {
    const isAuthenticated = UserAuthTracker.isAuthenticated;
    if (!isAuthenticated) {
        MessagePopup.show('You must login to add book to cart!');
        return;
    }

    function callbackOnSuccess() {
        MessagePopup.show(`Added ${quantity} of "${book.title}" to cart.`);
    }

    CartManager.addItem(UserAuthTracker.userObject.userID, book.bookID, quantity, callbackOnSuccess, null);
}

export {
    createBookCard,
    appendStockValue,
    updateStockValue,
    appendAddToCartControls,
    addToCart
}