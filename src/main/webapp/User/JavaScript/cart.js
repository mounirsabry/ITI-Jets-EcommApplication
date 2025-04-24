'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from "./Utils/URL_Mapper.js";
import { appendStockValue, updateStockValue } from "./Utils/bookUIFunctions.js";
import displayProduct from "./Common/BookPopup.js";
import BooksManager from "./Managers/BooksManager.js";
import CartManager from "./Managers/CartManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import CartItem from "./Models/CartItem.js";
import Book from "./Models/Book.js";
import MessagePopup from "./Common/MessagePopup.js";
import LoadingOverlay from "./Common/LoadingOverlay.js";

function appendUpdateQuantityControls(bookDiv, book, quantity, callbackOnQuantityUpdate) {
    if (!bookDiv) {
        throw new Error('Invalid bookDiv!');
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
    const updateQuantityButton = document.createElement('button');
    updateQuantityButton.className = 'update-quantity-button';
    updateQuantityButton.textContent = 'Update';
    updateQuantityButton.disabled = true; // Initially disabled.

    bookDiv.appendChild(quantitySelector);
    bookDiv.appendChild(updateQuantityButton);

    function updateQuantity(quantity, inputValue) {
        decreaseButton.disabled = (inputValue === 1);
        increaseButton.disabled = inputValue >= Math.min(book.stock, 20);

        // Disable update button if value hasn't changed
        updateQuantityButton.disabled = (quantity === inputValue);
    }
    updateQuantity(quantity, 1);

    decreaseButton.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) {
            quantityInput.value = `${value - 1}`;
            updateQuantity(quantity, value - 1);
        }
    });

    increaseButton.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value < Math.min(book.stock, 20)) {
            quantityInput.value = `${value + 1}`;
            updateQuantity(quantity, value + 1);
        }
    });

    // Also handle direct input changes if you make the input editable later
    quantityInput.addEventListener('input', () => {
        const value = parseInt(quantityInput.value) || quantity;
        updateQuantity(quantity, value);
    });

    if (callbackOnQuantityUpdate) {
        updateQuantityButton.addEventListener('click', () => {
            let newQuantity = parseInt(quantityInput.value);
            callbackOnQuantityUpdate(book.bookID, newQuantity);

            // Disable the button after update until next change.
            updateQuantityButton.disabled = true;
            quantity = newQuantity;
        });
    }

    return quantityInput;
}

function updatePriceSection(priceSection, price, quantity) {
    if (!priceSection) {
        throw new Error('Price Section component must be provided.');
    }

    priceSection.innerHTML = '';

    if (quantity === 1) {
        const priceInfo = document.createElement('p');
        priceInfo.innerHTML = `<strong>Price:</strong> ${price.toFixed(2)} EGP`;
        priceSection.appendChild(priceInfo);
    } else {
        const subtotalPrice = price * quantity;

        const pricePerPieceParagraph = document.createElement('p');
        pricePerPieceParagraph.innerHTML = `<strong>Price per Piece:</strong> ${price.toFixed(2)} EGP`;
        priceSection.appendChild(pricePerPieceParagraph);

        const quantityParagraph = document.createElement('p');
        quantityParagraph.innerHTML = `<strong>Quantity:</strong> ${quantity} `;
        priceSection.appendChild(quantityParagraph);

        const totalItemPriceParagraph = document.createElement('p');
        totalItemPriceParagraph.innerHTML = `<strong>Total Price:</strong> ${subtotalPrice.toFixed(2)} EGP`;
        priceSection.appendChild(totalItemPriceParagraph);
    }
}

document.addEventListener("DOMContentLoaded", async function() {
    checkForErrorMessageParameter();

    const checkoutButton = document.getElementById('checkoutButton');
    if (!checkoutButton) {
        console.error('Could not locate the checkout button!');
    } else {
        checkoutButton.addEventListener('click', async function() {
            const validatingCartLoadingOverlay = new LoadingOverlay();
            validatingCartLoadingOverlay.createAndDisplay('Validating...');

            const response = await CartManager.validateCart(userObject.userID);
            validatingCartLoadingOverlay.remove();

            if (!response) {
                MessagePopup.show('Unknown error, cannot proceed!', true);
            } else if (!response.success) {
                MessagePopup.show(response.data, true);
            } else {
                if (subtotalAmountComponent) {
                    /*
                    let currentText = subtotalAmountComponent.textContent;
                    let currentValue = parseFloat(currentText);

                    window.location.href = Resources_Mapper.CHECKOUT + `?subtotal=${currentValue}`;
                     */
                    window.location.href = URL_Mapper.CHECKOUT;
                }
            }
        });
    }

    const numberOfDifferentBooksComponent
        = document.getElementById('numberOfDifferentBooks');
    if (!numberOfDifferentBooksComponent) {
        console.error('Could not locate number of different books component!');
    }

    const totalNumberOfBooksComponent
        = document.getElementById('totalNumberOfBooks');
    if (!totalNumberOfBooksComponent) {
        console.error('Could not locate total number of books!');
    }

    const subtotalAmountComponent
        = document.getElementById('subtotalAmount');
    if (!subtotalAmountComponent) {
        console.error('Could not locate total amount component!');
    }

    const cartItemsContainer = document.getElementById('cartItems');
    if (!cartItemsContainer) {
        console.error('Could not locate the cart items component.');
        return;
    }
    cartItemsContainer.innerHTML = '<div class="loading-data">Loading your cart...</div>';

    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }

    const truncateCartButton = document.getElementById('truncateCartButton');
    if (!truncateCartButton) {
        console.error('Could not locate truncate cart button!');
    } else {
        truncateCartButton.addEventListener('click', async function() {
            const response = await CartManager.truncate(userObject.userID);
            if (!response) {
                MessagePopup.show('Unknown error, cannot truncate cart!', true);
            } else if (!response.success) {
                MessagePopup.show(response.data, true);
            } else {
                handleEmptyCart();

                if (numberOfDifferentBooksComponent) {
                    numberOfDifferentBooksComponent.textContent = '0';
                }

                if (totalNumberOfBooksComponent) {
                    totalNumberOfBooksComponent.textContent = '0';
                }

                if (subtotalAmountComponent) {
                    subtotalAmountComponent.textContent = '0.00';
                }

                MessagePopup.show(response.data);
                truncateCartButton.disabled = true;
            }
        });
    }

    function handleEmptyCart() {
        cartItemsContainer.innerHTML = '';

        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'no-data-found';
        emptyMsg.textContent = 'Your cart is empty';
        cartItemsContainer.appendChild(emptyMsg);

        truncateCartButton.disabled = true;
        checkoutButton.disabled = true;
    }

    const cartLoadingOverlay = new LoadingOverlay();
    cartLoadingOverlay.createAndDisplay('Loading Cart...');

    const response = await CartManager.getCart(userObject.userID);
    cartLoadingOverlay.remove();

    if (!response) {
        MessagePopup.show('Unknown error, cannot display cart!', true);
        return;
    }

    if (!response.success) {
        MessagePopup.show(response.data, true);
        return;
    }

    renderCartItemsList(response.data);

    function renderCartItemsList(cartItems) {
        cartItemsContainer.innerHTML = '';

        let parsedCartItems;
        if (typeof cartItems !== 'object') {
            try {
                parsedCartItems = JSON.parse(cartItems);
            } catch (_) {
                console.log('Could not parse cart items in render cart file.');
                return;
            }
        } else {
            parsedCartItems = cartItems;
        }

        if (parsedCartItems.length === 0) {
            handleEmptyCart();
            return;
        }

        const cartItemsList = parsedCartItems
            .map(parsedCartItem => {
                try {
                    return CartItem.fromJSON(parsedCartItem);
                } catch (e) {
                    console.error(`Error parsing cart item: ${e.message}`);
                    return null; // This will be filtered out by the next step.
                }
            })
            .filter(item => item !== null); // Filters out null values explicitly.

        loadBooksFromCartItems(cartItemsList);
    }

    function loadBooksFromCartItems(cartItemsList) {
        const promisesList = [];

        const booksLoadingOverlay = new LoadingOverlay();
        booksLoadingOverlay.createAndDisplay('Loading Books...');

        cartItemsList.forEach(cartItem => {
            const loadBook = async function(cartItem) {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('cart-item');
                cartItemsContainer.appendChild(bookDiv);

                const responsePromise = BooksManager.getBookDetails(cartItem.bookID);
                promisesList.push(responsePromise);

                const response = await responsePromise;

                if (!response) {
                    return;
                }

                if (!response.success) {
                    MessagePopup.show(response.data, true);
                }

                fillBookElement(bookDiv, cartItem.quantity, response.data);
            };

            loadBook(cartItem);
        });

        Promise.all(promisesList)
            .then(_ => booksLoadingOverlay.remove())
            .catch(_ => booksLoadingOverlay.remove());
    }

    function fillBookElement(bookDiv, quantity, book) {
        let parsedBook;
        try {
            parsedBook = Book.fromJSON(book);
        } catch (_) {
            console.log('Could not parse a book!');
            parsedBook = null;
        }

        if (parsedBook === null) {
            bookDiv.classList.add('no-data-found');
            bookDiv.textContent = 'Could Not Find This Book.';
            return;
        }

        const mainImage = parsedBook.images?.find(image => image.isMain);
        let imagePath;
        if (mainImage) {
            imagePath = mainImage.url;
        } else {
            imagePath = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
        }

        let finalBookPrice = parsedBook.price * ((100 - parsedBook.discountedPercentage) / 100);
        let subtotalPrice = finalBookPrice * quantity;

        updatePriceSummarySectionOnChange(1, quantity, subtotalPrice);

        // Create the image element.
        const img = document.createElement('img');
        img.src = imagePath;
        img.alt = parsedBook.title;
        img.className = 'book-image';
        bookDiv.appendChild(img);

        // Create the book details container
        const bookDetails = document.createElement('div');
        bookDetails.className = 'book-details';

        // Create and append the title
        const title = document.createElement('h3');
        title.textContent = parsedBook.title;
        bookDetails.appendChild(title);

        // Create and append the overview
        const overview = document.createElement('p');
        overview.textContent = parsedBook.overview;
        overview.classList.add('overview');
        bookDetails.appendChild(overview);

        // Create and append the author
        const author = document.createElement('p');
        author.innerHTML = `<strong>Author:</strong> ${parsedBook.author}`;
        bookDetails.appendChild(author);

        // Create and append the ISBN
        const isbn = document.createElement('p');
        isbn.innerHTML = `<strong>ISBN:</strong> ${parsedBook.isbn}`;
        bookDetails.appendChild(isbn);

        // Append the book details to the main container
        bookDiv.appendChild(bookDetails);

        // Create the price section container here, so it can be referenced.
        const priceSection = document.createElement('div');
        priceSection.className = 'price-section';

        const quantitySection = document.createElement('div');
        quantitySection.classList.add('quantity-section');

        // Append stock/availability.
        appendStockValue(quantitySection, parsedBook);

        let quantityInput; // Declare here so it's in closure
        // After the product is available and there is some stock, then add update quantity section.
        if (parsedBook.isAvailable && parsedBook.stock >= 1) {
            const callbackOnUpdateQuantity = async function(bookID, newQuantity) {
                // Calculate the difference from old quantity
                const quantityDifference = newQuantity - quantity;
                const priceDifference = finalBookPrice * quantityDifference;

                const response = await CartManager.updateCartItem(userObject.userID, bookID, newQuantity);
                if (!response) {
                    MessagePopup.show('Unknown error, could not update cart item!', true);
                    return;
                }

                if (!response.success) {
                    MessagePopup.show(response.data, true);
                    return;
                }

                MessagePopup.show(response.data);
                updatePriceSection(priceSection, finalBookPrice, newQuantity);

                updatePriceSummarySectionOnChange(
                    0, quantityDifference, priceDifference);
                quantity = newQuantity;
            }

            quantityInput = appendUpdateQuantityControls(quantitySection, parsedBook,
                quantity,
                callbackOnUpdateQuantity);
        }
        bookDiv.appendChild(quantitySection);

        updatePriceSection(priceSection, finalBookPrice, quantity);
        bookDiv.appendChild(priceSection);

        const trashCanCoveredPath = URL_Mapper.ICONS.TRASH_CAN_COVERED;
        const trashCanUncoveredPath = URL_Mapper.ICONS.TRASH_CAN_UNCOVERED;

        const removeItemButton = document.createElement('button');
        removeItemButton.classList.add('remove-item-button');

        const removeItemButtonDefaultImg = document.createElement('img');
        removeItemButtonDefaultImg.classList.add('default-img');
        removeItemButtonDefaultImg.src = `${trashCanCoveredPath}`;
        removeItemButtonDefaultImg.alt = 'X';
        removeItemButton.appendChild(removeItemButtonDefaultImg);

        const removeItemButtonHoveredImg = document.createElement('img');
        removeItemButtonHoveredImg.classList.add('hover-img');
        removeItemButtonHoveredImg.src = `${trashCanUncoveredPath}`;
        removeItemButtonHoveredImg.alt = 'X';
        removeItemButton.appendChild(removeItemButtonHoveredImg);

        removeItemButton.addEventListener('click', async function() {
            const response = await CartManager.removeCartItem(userObject.userID, parsedBook.bookID);
            if (!response) {
                MessagePopup.show('Unknown error, cannot remove the item', true);
                return;
            }

            if (!response.success) {
                MessagePopup.show(response.data, true);
                return;
            }

            MessagePopup.show(response.data);
            updatePriceSummarySectionOnChange(-1,
                -1 * quantity,
                -1 * subtotalPrice);
            bookDiv.remove();

            if (cartItemsContainer.innerHTML === '') {
                handleEmptyCart();
            }
        });

        bookDiv.appendChild(removeItemButton);

        function updateBookInfoOnDisplay(updatedAndParsedBook) {
            // Update the book image if it changed
            const mainImage = updatedAndParsedBook.images?.find(image => image.isMain);
            if (mainImage && img.src !== mainImage.url) {
                img.src = mainImage.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
            }

            // Update the title if changed
            if (title.textContent !== updatedAndParsedBook.title) {
                title.textContent = updatedAndParsedBook.title;
            }

            // Update the overview if changed
            if (overview.textContent !== updatedAndParsedBook.overview) {
                overview.textContent = updatedAndParsedBook.overview;
            }

            // Update the author if changed
            const newAuthorHTML = `<strong>Author:</strong> ${updatedAndParsedBook.author}`;
            if (author.innerHTML !== newAuthorHTML) {
                author.innerHTML = newAuthorHTML;
            }

            // Update the ISBN if changed
            const newIsbnHTML = `<strong>ISBN:</strong> ${updatedAndParsedBook.isbn}`;
            if (isbn.innerHTML !== newIsbnHTML) {
                isbn.innerHTML = newIsbnHTML;
            }

            // Update stock status
            updateStockValue(quantitySection, updatedAndParsedBook);

            // Calculate new price
            const newFinalPrice = updatedAndParsedBook.price * ((100 - updatedAndParsedBook.discountedPercentage) / 100);
            const oldFinalPrice = finalBookPrice;

            // Only update if price changed
            if (newFinalPrice !== oldFinalPrice) {
                finalBookPrice = newFinalPrice;
                const quantity = parseInt(quantityInput.value) || 1;
                const priceDifference = (newFinalPrice - oldFinalPrice) * quantity;

                updatePriceSection(priceSection, newFinalPrice, quantity);
                updatePriceSummarySectionOnChange(0, 0, priceDifference);
            }

            // Update the local parsedBook reference
            parsedBook = updatedAndParsedBook;
        }

        img.addEventListener('click', () => {
            displayProduct(parsedBook, updateBookInfoOnDisplay, true);
        });
    }

    function updatePriceSummarySectionOnChange(differentBooksChange, totalBooksChange, subtotalAmountChange) {
        // Update the summary displays
        if (numberOfDifferentBooksComponent) {
            const current = parseInt(numberOfDifferentBooksComponent.textContent) || 0;
            numberOfDifferentBooksComponent.textContent = current + differentBooksChange;
        }

        if (totalNumberOfBooksComponent) {
            const current = parseInt(totalNumberOfBooksComponent.textContent) || 0;
            totalNumberOfBooksComponent.textContent = current + totalBooksChange;
        }

        if (subtotalAmountComponent) {
            // Handle the EGP suffix if present
            let currentText = subtotalAmountComponent.textContent;
            let currentValue = parseFloat(currentText) || 0;

            // Calculate new value
            let newValue = currentValue + subtotalAmountChange;

            // Ensure we don't show negative values
            newValue = Math.max(0, newValue);

            // Format with 2 decimal places and EGP suffix
            subtotalAmountComponent.textContent = `${newValue.toFixed(2)}`;
        }
    }
});
