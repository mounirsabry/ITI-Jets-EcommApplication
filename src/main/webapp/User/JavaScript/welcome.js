'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from "./Utils/URL_Mapper.js";

import { createBookCard } from "./Utils/bookUIFunctions.js";
import displayProduct from "./Common/BookPopup.js";
import BooksManager from "./Managers/BooksManager.js";
import Book from "./Models/Book.js";

document.addEventListener("DOMContentLoaded", function() {
    checkForErrorMessageParameter();
    
    // Event Banner.
    const messages = document.querySelectorAll(".banner-text");
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    
    let currentIndex = 0;
    let autoScroll;

    function updateBanner(index) {
        messages.forEach((msg, i) => {
            msg.classList.remove("active");
            if (i === index) {
                msg.classList.add("active");
            }
        });
    }

    function nextMessage() {
        currentIndex = (currentIndex + 1) % messages.length;
        updateBanner(currentIndex);
    }

    function prevMessage() {
        currentIndex = (currentIndex - 1 + messages.length) % messages.length;
        updateBanner(currentIndex);
    }

    function startAutoScroll() {
        autoScroll = setInterval(nextMessage, 3000);
    }

    function resetAutoScroll() {
        clearInterval(autoScroll);
        startAutoScroll();
    }

    prevBtn.addEventListener("click", () => {
        prevMessage();
        resetAutoScroll();
    });

    nextBtn.addEventListener("click", () => {
        nextMessage();
        resetAutoScroll();
    });

    startAutoScroll();
    updateBanner(currentIndex);

    // Set the browse button.
    const browseButton = document.getElementById('browseButton');
    if (!browseButton) {
        console.log('Could not load the browse button.');
        return;
    }
    browseButton.addEventListener('click', () => {
        window.location.href = URL_Mapper.PRODUCTS;
    });

    const topSellingContainer = document.getElementById("topSelling");
    if (!topSellingContainer) {
        console.log('Could not load the top selling component.');
        return;
    }

    // Populate "Top Selling Books"
    function topSellingBooksOnSuccess(topSellingBooks) {

        topSellingBooks.forEach(book => {
            let parsedBook;
            try {
                parsedBook = Book.fromJSON(book);
            } catch (e) {
                console.error('Could not parse a book in top selling book');
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

            // Append elements
            bookElement.append(imgElement, titleElement, overviewElement);

            // Update function (closure captures elements)
            function updateBookDetailsOnViewingPopup(updatedBook) {
                titleElement.textContent = updatedBook.title || book.title; // Fallback to original
                overviewElement.textContent = updatedBook.overview || book.overview;

                const newImg = updatedBook.images?.find(img => img.isMain)?.url ||
                    URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE;
                if (newImg !== imgElement.src) {
                    imgElement.src = newImg;
                }
            }

            // Click handler
            imgElement.addEventListener('click', () => {
                displayProduct(parsedBook, updateBookDetailsOnViewingPopup);
            });

            topSellingContainer.appendChild(bookElement);
        });
    }

    const topSellingGenreBookContainer = document.getElementById("topSellingGenreBook");
    if (!topSellingGenreBookContainer) {
        console.log('Could not load the top selling genre book component.');
        return;
    }

    // Populate "Top Selling in Genre" with cart functionality.
    function topSellingGenreBooksOnSuccess(topSellingGenreBooks) {
        topSellingGenreBooks.forEach(book => {
            let parsedBook = Book.fromJSON(book);
            try {
                parsedBook = Book.fromJSON(book);
            } catch (e) {
                console.log('Could not parse a book inside top selling for genre function.');
                return;
            }

            const bookElement = createBookCard(parsedBook);
            topSellingGenreBookContainer.appendChild(bookElement);
        });
    }

    BooksManager.getTopSelling(topSellingBooksOnSuccess, null);
    BooksManager.getTopSellingInGenres(topSellingGenreBooksOnSuccess, null);
});
