'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from "./Utils/URL_Mapper.js";
import {createBookCard, createWishListButton} from "./Utils/bookUIFunctions.js";
import displayProduct from "./Common/BookPopup.js";
import BooksManager from "./Managers/BooksManager.js";
import Book from "./Models/Book.js";
import loadBanners from "./Utils/BannersUIManager.js";
import LoadingOverlay from "./Common/LoadingOverlay.js";

document.addEventListener("DOMContentLoaded", async function() {
    checkForErrorMessageParameter();

    loadBanners()

    let isTopSellingBooksLoaded = false;
    let isTopSellingBookInGenresLoaded = false;

    const loadingOverlay = new LoadingOverlay();
    loadingOverlay.createAndDisplay('Loading Books Lists...');

    const loadingOverlayIntervalID = setInterval(() => {
        if (isTopSellingBooksLoaded && !isTopSellingBookInGenresLoaded) {
            loadingOverlay.remove();
            clearInterval(loadingOverlayIntervalID);
        }
    }, 50);

    // Set the browse button (unchanged)
    const browseButton = document.getElementById('browseButton');
    if (!browseButton) {
        console.log('Could not load the browse button.');
        return;
    }
    browseButton.addEventListener('click', () => {
        window.location.href = URL_Mapper.PRODUCTS;
    });

    // Top Selling Books Section
    const topSellingContainer = document.getElementById("topSelling");
    if (!topSellingContainer) {
        console.log('Could not load the top selling component.');
        return;
    }

    // Populate "Top Selling Books"
    async function loadTopSellingBooks() {
        const response = await BooksManager.getTopSelling();
        isTopSellingBooksLoaded = true;

        if (response === null) {
            return;
        }

        try {
            response.data.forEach(book => {
                let parsedBook;
                try {
                    parsedBook = Book.fromJSON(book);
                } catch (e) {
                    console.error('Could not parse a book in top selling books');
                    return;
                }

                const imagesArray = parsedBook.images;
                const mainImage = imagesArray.find(image => image.isMain);

                // Create elements
                const bookElement = document.createElement("div");
                bookElement.classList.add("book-card");

                const imgElement = document.createElement('img');
                imgElement.src = mainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
                imgElement.alt = book.title;
                imgElement.className = 'product-image';

                const titleElement = document.createElement('h3');
                titleElement.textContent = book.title;

                const overviewElement = document.createElement('p');
                overviewElement.textContent = book.overview;

                const wishListButton = createWishListButton(parsedBook);

                // Append elements
                bookElement.append(imgElement, titleElement, overviewElement, wishListButton);

                // Update function (closure captures elements)
                function updateBookDetailsOnViewingPopup(updatedBook) {
                    titleElement.textContent = updatedBook.title || book.title;
                    overviewElement.textContent = updatedBook.overview || book.overview;

                    const newImg = updatedBook.images?.find(img => img.isMain)?.url ||
                        URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
                    if (newImg !== imgElement.src) {
                        imgElement.src = newImg;
                    }
                }

                // Click handler for book image
                imgElement.addEventListener('click', () => {
                    displayProduct(parsedBook, updateBookDetailsOnViewingPopup);
                });

                topSellingContainer.appendChild(bookElement);
            });
        } catch (error) {
            console.error('Error processing top selling books:', error);
        }
    }

    // Top Selling in Genre Section
    const topSellingGenreBookContainer = document.getElementById("topSellingGenreBook");
    if (!topSellingGenreBookContainer) {
        console.log('Could not load the top selling genre book component.');
        return;
    }

    // Populate "Top Selling in Genre"
    async function loadTopSellingGenreBooks() {
        const response = await BooksManager.getTopSellingInGenres();
        isTopSellingBookInGenresLoaded = true;

        if (response === null) {
            return;
        }

        try {
            response.data.forEach(book => {
                let parsedBook;
                try {
                    parsedBook = Book.fromJSON(book);
                } catch (e) {
                    console.log('Could not parse a book inside top selling for genre function.');
                    return;
                }

                const bookElement = createBookCard(parsedBook);
                topSellingGenreBookContainer.appendChild(bookElement);
            });
        } catch (error) {
            console.error('Error processing genre books:', error);
        }
    }

    // Load both sections
    await loadTopSellingBooks();
    await loadTopSellingGenreBooks();
});