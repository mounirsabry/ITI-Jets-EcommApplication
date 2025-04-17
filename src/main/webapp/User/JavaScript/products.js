'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import { createBookCard } from './Utils/bookUIFunctions.js';
import { BooksManager } from './Managers/BooksManager.js';
import Book from './Models/Book.js';
import Genres from './Models/Genres.js';

document.addEventListener("DOMContentLoaded", function() {
    checkForErrorMessageParameter();

    // Constants
    const BOOKS_PER_PAGE = 12; // Can be easily changed here

    // DOM Elements
    const booksList = document.getElementById('booksList');
    const searchBar = document.getElementById('searchBar');
    const searchButton = document.getElementById('searchButton');
    const unavailableToggle = document.getElementById('unavailableToggle');
    const genreFilter = document.getElementById('genreFilter');
    const prevPageButton = document.getElementById('prevPage');
    const nextPageButton = document.getElementById('nextPage');
    const pageInput = document.getElementById('pageInput');
    const pageIndicator = document.getElementById('pageIndicator');

    // State variables
    let allBooksPossiblySearched = null;
    const currentDisplayedMap = new Map();
    let currentPage = 1;
    let totalPages = 1;

    // Initialize
    populateGenreFilter();
    BooksManager.getAllBooks(loadAllBooks, null);

    function populateGenreFilter() {
        Object.values(Genres).forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            genreFilter.appendChild(option);
        });
    }

    function filterBooks() {
        currentDisplayedMap.clear();
        const selectedGenre = genreFilter.value;

        allBooksPossiblySearched.forEach(book => {
            if (selectedGenre !== 'all' && book.genre !== selectedGenre) {
                return;
            }
            if (unavailableToggle && !unavailableToggle.checked && (book.stock === 0 || !book.isAvailable)) {
                return;
            }
            currentDisplayedMap.set(book.bookID, book);
        });

        // Reset to page 1 when filtering changes.
        currentPage = 1;
        updatePagination();
    }

    function renderBooks() {
        booksList.innerHTML = '';

        if (currentDisplayedMap.size === 0) {
            const emptyElement = document.createElement('div');
            emptyElement.textContent = 'No books found matching your criteria!';
            emptyElement.classList.add('no-data-found');
            booksList.appendChild(emptyElement);

            currentPage = 0;
            totalPages = 0;
            updatePagination();
            return;
        }

        const booksArray = Array.from(currentDisplayedMap.values());

        // Calculate pagination.
        totalPages = Math.ceil(booksArray.length / BOOKS_PER_PAGE);
        updatePagination();

        // Get books for current page.
        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const endIndex = Math.min(startIndex + BOOKS_PER_PAGE, booksArray.length);
        const booksToDisplay = booksArray.slice(startIndex, endIndex);

        // Render books.
        booksToDisplay.forEach(book => {
            const bookElement = createBookCard(book);
            booksList.appendChild(bookElement);
        });
    }

    function updatePagination() {
        // Update page indicator
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;

        // Update input value.
        pageInput.value = currentPage;

        // Update button states.
        prevPageButton.disabled = currentPage <= 1;
        nextPageButton.disabled = currentPage >= totalPages;
    }

    function goToPage(page) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum)) {
            return;
        }

        currentPage = Math.max(1, Math.min(pageNum, totalPages));
        renderBooks();
    }

    // Event Listeners.
    searchButton.addEventListener('click', () => {
        const searchBarValue = searchBar.value;
        if (!searchBarValue) {
            BooksManager.getAllBooks(loadAllBooks, null);
            return;
        }

        const searchTerm = searchBarValue.toLowerCase();
        BooksManager.search(searchTerm, (searchResult) => {
            allBooksPossiblySearched = searchResult.reduce((validBooks, book) => {
                try {
                    const parsedBook = Book.fromJSON(book);
                    validBooks.push(parsedBook);
                } catch (e) {
                    console.log('Could not parse a book in search book function!', e);
                }
                return validBooks;
            }, []);

            filterBooks();
            renderBooks();
        });
    });

    unavailableToggle.addEventListener("change", () => {
        filterBooks();
        renderBooks();
    });

    genreFilter.addEventListener("change", () => {
        filterBooks();
        renderBooks();
    });

    prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
        }
    });

    nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks();
        }
    });

    pageInput.addEventListener('change', (e) => {
        goToPage(e.target.value);
    });

    pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            goToPage(e.target.value);
        }
    });

    function loadAllBooks(allBooks) {
        allBooksPossiblySearched = allBooks.reduce((validBooks, book) => {
            try {
                const parsedBook = Book.fromJSON(book);
                validBooks.push(parsedBook);
            } catch (e) {
                console.log('Could not parse a book in search book function!', e);
            }
            return validBooks;
        }, []);

        filterBooks();
        renderBooks();
    }
});