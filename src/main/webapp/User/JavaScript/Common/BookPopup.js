'use strict';

import URL_Mapper from '../Utils/URL_Mapper.js';
import MessagePopup from "./MessagePopup.js";

import { appendAddToCartControls, appendStockValue } from "../Utils/bookUIFunctions.js";
import BooksManager from "../Managers/BooksManager.js";
import Book from "../Models/Book.js";

export default function displayProduct(book, updateOriginalBookCallback, isInfoOnly = false) {
    if (isInfoOnly !== false && isInfoOnly !== true) {
        throw new Error('Invalid value for isInfoOnly.');
    }

    let bookImagesPaths = book.images.map(image => image.url);

    let currentImageIndex = -1;
    for (let i = 0; i < book.images.length; i++) {
        if (book.images[i].isMain === true) {
            currentImageIndex = i;
            break;
        }
    }

    // Create the overlay (semi-transparent background)
    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';

    // Create the modal container
    const modal = document.createElement('div');
    modal.className = 'popup-modal';

    // Close button
    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'close-popup';
    closeButton.ariaLabel = 'Close';
    closeButton.textContent = '×';
    modal.appendChild(closeButton);

    // Image container
    const imageContainer = document.createElement('div');
    imageContainer.className = 'image-container';

    // Previous image button
    const prevButton = document.createElement('button');
    prevButton.className = 'image-nav prev';
    prevButton.ariaLabel = 'Previous Image';
    prevButton.disabled = true;
    prevButton.textContent = '<';
    imageContainer.appendChild(prevButton);

    // Image element
    let imageSrc;
    if (currentImageIndex !== -1) {
        imageSrc = bookImagesPaths[currentImageIndex];
    } else {
        imageSrc = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
    }
    const imageElement = document.createElement('img');
    imageElement.src = imageSrc;
    imageElement.alt = book.title;
    imageElement.className = 'popup-image';
    imageContainer.appendChild(imageElement);

    // Next image button
    const nextButton = document.createElement('button');
    nextButton.className = 'image-nav next';
    nextButton.ariaLabel = 'Next Image';
    nextButton.textContent = '>';
    imageContainer.appendChild(nextButton);

    modal.appendChild(imageContainer);

    // Image indicator
    let indicator;
    if (bookImagesPaths?.length > 0) {
        indicator = `Image ${currentImageIndex + 1} of ${bookImagesPaths.length}`;
    } else {
        indicator = 'Not Images Were Specified for this book.';
    }

    const imageIndicator = document.createElement('p');
    imageIndicator.className = 'image-indicator';
    imageIndicator.textContent = indicator;
    modal.appendChild(imageIndicator);

    // Book title
    const titleElement = document.createElement('h2');
    titleElement.textContent = book.title ? book.title : 'Not Specified';
    modal.appendChild(titleElement);

    // Book overview
    const overviewElement = document.createElement('p');
    overviewElement.textContent = `${book.overview ? book.overview : 'Not Specified'}`;
    overviewElement.className = 'overview';
    modal.appendChild(overviewElement);

    // Book author
    const authorElement = document.createElement('p');
    authorElement.innerHTML = `<strong>By:</strong> ${book.author ? book.author : 'Not Specified'}`;
    modal.appendChild(authorElement);

    // Book genre
    const genreElement = document.createElement('p');
    genreElement.innerHTML = `<strong>Genre:</strong> ${book.genre ? book.genre : 'Not Specified'}`;
    modal.appendChild(genreElement);

    // Book price
    const price = book.price ? `${book.price} EGP` : 'Not Specified';
    const priceElement = document.createElement('p');
    priceElement.innerHTML = `<strong>Price:</strong> ${price}`;
    modal.appendChild(priceElement);

    // Book publisher
    const publisherElement = document.createElement('p');
    publisherElement.innerHTML = `<strong>Publisher:</strong> ${book.publisher ? book.publisher : 'Not Specified'}`;
    modal.appendChild(publisherElement);

    // Book ISBN
    const isbnElement = document.createElement('p');
    isbnElement.innerHTML = `<strong>ISBN:</strong> ${book.isbn ? book.isbn : 'Not Specified'}`;
    modal.appendChild(isbnElement);

    // Book language
    const languageElement = document.createElement('p');
    languageElement.innerHTML = `<strong>Language:</strong> ${book.language ? book.language : 'Not Specified'}`;
    modal.appendChild(languageElement);

    // Book pages
    const pagesElement = document.createElement('p');
    pagesElement.innerHTML = `<strong>Pages:</strong> ${book.numberOfPages}`;
    modal.appendChild(pagesElement);

    // Book availability
    const availabilityElement = document.createElement('p');
    availabilityElement.innerHTML = `<strong>Availability:</strong> ${book.isAvailable ? 'Available' : 'Not Available'}`;
    modal.appendChild(availabilityElement);

    // Book description
    const descriptionElement = document.createElement('p');
    descriptionElement.innerHTML = `<strong>Description:</strong> ${book.description}`;
    descriptionElement.className = 'description';
    modal.appendChild(descriptionElement);

    appendStockValue(modal, book);

    if (isInfoOnly === false) {
        appendAddToCartControls(modal, book);
    }
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    closeButton.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Clicking outside the modal closes the popup
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            document.body.removeChild(overlay);
        }
    });

    // Update image function
    function updateImage() {
        if (currentImageIndex !== -1) {
            imageElement.src = bookImagesPaths[currentImageIndex];
            imageIndicator.textContent = `Image ${currentImageIndex + 1} of ${bookImagesPaths.length}`;
            prevButton.disabled = currentImageIndex <= 0;
            nextButton.disabled = currentImageIndex === bookImagesPaths.length - 1;
        } else {
            imageElement.src = `${URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE}`;
            prevButton.disabled = true;
            nextButton.disabled = true;
        }
    }

    // Image navigation event listeners
    prevButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentImageIndex > 0) {
            currentImageIndex--;
            updateImage();
        }
    });

    nextButton.addEventListener('click', (event) => {
        event.stopPropagation();
        if (currentImageIndex < bookImagesPaths.length - 1) {
            currentImageIndex++;
            updateImage();
        }
    });
    updateImage();

    const updateBookDisplayOnSuccess = function(updatedBook) {
        try {
            updatedBook = Book.fromJSON(updatedBook);
        } catch (e) {
            MessagePopup.show(e, true);
        }

        // 1. Update images if changed
        if (updatedBook.images?.length > 0) {
            const newMainIndex = updatedBook.images.findIndex(img => img.isMain);
            if (newMainIndex !== -1 && newMainIndex !== currentImageIndex) {
                currentImageIndex = newMainIndex;
                bookImagesPaths = updatedBook.images.map(img => img.url);
                updateImage(); // Reuses your existing image update logic
            }
        }

        // 2. Directly update DOM elements using closure references
        titleElement.textContent = updatedBook.title;
        overviewElement.textContent = updatedBook.overview;
        authorElement.innerHTML = `<strong>By:</strong> ${updatedBook.author}`;
        genreElement.innerHTML = `<strong>Genre:</strong> ${updatedBook.genre}`;
        priceElement.innerHTML = `<strong>Price:</strong> ${updatedBook.price} EGP`;
        publisherElement.innerHTML = `<strong>Publisher:</strong> ${updatedBook.publisher}`;
        isbnElement.innerHTML = `<strong>ISBN:</strong> ${updatedBook.isbn}`;
        languageElement.innerHTML = `<strong>Language:</strong> ${updatedBook.language}`;
        pagesElement.innerHTML = `<strong>Pages:</strong> ${updatedBook.numberOfPages}`;
        availabilityElement.innerHTML = `<strong>Availability:</strong> ${updatedBook.isAvailable ? 'Available' : 'Not Available'}`;
        descriptionElement.innerHTML = `<strong>Description:</strong> ${updatedBook.description}`;

        // 1. Re append the stock value.
        const oldStockDisplay = modal.querySelector('.stock-status');
        if (oldStockDisplay) oldStockDisplay.remove();

        appendStockValue(modal, updatedBook);

        // 3. Remove the old quantity specifier and add to cart (if they exist).
        const oldQuantitySelector = modal.querySelector('.quantity-selector');
        if (oldQuantitySelector) {
            oldQuantitySelector.remove();
        }

        const odlAddToCartButton = modal.querySelector('.add-to-cart');
        if (odlAddToCartButton) {
            odlAddToCartButton.remove();
        }

        // 4. Only re-append controls if `isInfoOnly = false` (same as initial logic)
        if (!isInfoOnly) {
            appendAddToCartControls(modal, updatedBook);
        }

        if (typeof updateOriginalBookCallback == 'function') {
            updateOriginalBookCallback(updatedBook);
        }
    };

    BooksManager.getBookDetails(book.bookID, updateBookDisplayOnSuccess);
}