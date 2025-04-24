'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import BooksManager from './Managers/BooksManager.js';
import Genres from './Models/Genres.js';
import MessagePopup from "./Common/MessagePopup.js";
import { createBookCard } from './Utils/bookUIFunctions.js';
import { parseBooksFromData } from "./Utils/UICommonFunctions.js";
import LoadingOverlay from "./Common/LoadingOverlay.js";

document.addEventListener("DOMContentLoaded", async function() {
    checkForErrorMessageParameter();

    // Constants
    const BOOKS_PER_PAGE = 12;

    // DOM Elements
    const elements = {
        booksList: document.getElementById('booksList'),
        searchBar: document.getElementById('searchBar'),
        searchButton: document.getElementById('searchButton'),
        unavailableToggle: document.getElementById('unavailableToggle'),
        genreFilter: document.getElementById('genreFilter'),
        prevPageButton: document.getElementById('prevPage'),
        nextPageButton: document.getElementById('nextPage'),
        pageInput: document.getElementById('pageInput'),
        pageIndicator: document.getElementById('pageIndicator')
    };

    // State variables
    let allBooksPossiblySearched = null;
    const currentDisplayedMap = new Map();
    let currentPage = 1;
    let totalPages = 1;

    // Initialize
    populateGenreFilter();
    await loadInitialBooks();

    function populateGenreFilter() {
        Object.values(Genres).forEach(genre => {
            const option = document.createElement('option');
            option.value = genre;
            option.textContent = genre;
            elements.genreFilter.appendChild(option);
        });
    }

    function handleIncomingResponse(response) {
        if (!response) return;
        if (!response.success) return MessagePopup.show(response.data, true);

        allBooksPossiblySearched = parseBooksFromData(response.data);
        filterBooks();
        renderBooks();
    }

    async function loadInitialBooks() {
        const loadingOverlay = new LoadingOverlay();
        loadingOverlay.createAndDisplay('Loading Books List...');

        const response = await BooksManager.getAllBooks();
        loadingOverlay.remove();
        handleIncomingResponse(response);
    }

    function filterBooks() {
        currentDisplayedMap.clear();
        const { genreFilter, unavailableToggle } = elements;
        const selectedGenre = genreFilter.value;

        allBooksPossiblySearched?.forEach(book => {
            if (selectedGenre !== 'all' && book.genre !== selectedGenre) return;
            if (unavailableToggle && !unavailableToggle.checked && (book.stock === 0 || !book.isAvailable)) return;
            currentDisplayedMap.set(book.bookID, book);
        });

        currentPage = 1;
        updatePagination();
    }

    function renderBooks() {
        elements.booksList.innerHTML = '';

        if (currentDisplayedMap.size === 0) {
            const emptyElement = document.createElement('div');
            emptyElement.textContent = 'No books found matching your criteria!';
            emptyElement.classList.add('no-data-found');
            elements.booksList.appendChild(emptyElement);

            currentPage = 0;
            totalPages = 0;
            updatePagination();
            return;
        }

        const booksArray = Array.from(currentDisplayedMap.values());
        totalPages = Math.ceil(booksArray.length / BOOKS_PER_PAGE);
        updatePagination();

        const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
        const booksToDisplay = booksArray.slice(startIndex, startIndex + BOOKS_PER_PAGE);

        booksToDisplay.forEach(book => {
            elements.booksList.appendChild(createBookCard(book));
        });
    }

    function updatePagination() {
        const { pageIndicator, pageInput, prevPageButton, nextPageButton } = elements;
        pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`;
        pageInput.value = currentPage;
        prevPageButton.disabled = currentPage <= 1;
        nextPageButton.disabled = currentPage >= totalPages;
    }

    function goToPage(page) {
        const pageNum = parseInt(page);
        if (isNaN(pageNum)) return;

        currentPage = Math.max(1, Math.min(pageNum, totalPages));
        renderBooks();
    }

    // Event Listeners
    elements.searchBar.addEventListener('input', () => {
        const searchBarValue = elements.searchBar.value.trim().toLowerCase();
        if (searchBarValue === '') {
            elements.searchButton.value = 'Refresh';
        } else {
            elements.searchButton.value = 'Search';
        }
    });

    elements.searchButton.addEventListener('click', async () => {
        const searchingLoadingOverlay = new LoadingOverlay();
        searchingLoadingOverlay.createAndDisplay('Searching...');

        const searchTerm = elements.searchBar.value.trim().toLowerCase();
        if (!searchTerm) {
            searchingLoadingOverlay.updateMessage('Loading Books List...');
            const response = await loadInitialBooks();
            searchingLoadingOverlay.remove();
            return response;
        }

        const response = await BooksManager.search(searchTerm);
        searchingLoadingOverlay.remove();

        handleIncomingResponse(response);
    });

    elements.unavailableToggle.addEventListener("change", () => {
        filterBooks();
        renderBooks();
    });

    elements.genreFilter.addEventListener("change", () => {
        filterBooks();
        renderBooks();
    });

    elements.prevPageButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderBooks();
        }
    });

    elements.nextPageButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderBooks();
        }
    });

    elements.pageInput.addEventListener('change', (e) => goToPage(e.target.value));
    elements.pageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') goToPage(e.target.value);
    });
});