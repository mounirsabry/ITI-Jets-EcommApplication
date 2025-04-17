'use strict';

import BooksDAO from '../DB/BooksDAO.js';
import Book from "../Models/Book.js";

export class BooksController {
    static getTopSelling() {
        const rawAllBooks = BooksDAO.getAllRawBooks();
        if (rawAllBooks === null) {
            throw new Error('Error while reading the books!');
        }
        const allBooks = rawAllBooks.map(book => Book.fromJSON(book));

        const topSelling = allBooks
            .sort((a, b) => b.copiesSold - a.copiesSold).slice(0, 10);
        return { success: true, data: topSelling };
    }

    static getTopSellingInGenres() {
        // Get all books from storage
        const rawAllBooks = BooksDAO.getAllRawBooks();
        if (rawAllBooks === null) {
            throw new Error('Error while reading the books!');
        }
        const allBooks = rawAllBooks.map(book => Book.fromJSON(book));
        
        // Extract all unique genre strings from the books
        const uniqueGenres = [...new Set(allBooks.map(book => book.genre))];
        
        // Group books by their genre
        const genreBooks = {};
        uniqueGenres.forEach(genre => {
            genreBooks[genre] = allBooks.filter(book => book.genre === genre);
        });
        
        // Find the top-selling book for each genre
        const topSellingByGenre = [];
        
        Object.keys(genreBooks).forEach(genre => {
            const booksForGenre = genreBooks[genre];
            if (booksForGenre.length > 0) {
                // Sort by copies sold (descending) and get the top one
                const topBook = booksForGenre.sort((a, b) => b.copiesSold - a.copiesSold)[0];
                topSellingByGenre.push(topBook);
            }
        });
        
        return { success: true, data: topSellingByGenre };
    }

    static getAllBooks() {
        const rawAllBooks = BooksDAO.getAllRawBooks();
        if (rawAllBooks === null) {
            throw new Error('Error while reading the books!');
        }
        const allBooks = rawAllBooks.map(book => Book.fromJSON(book));

        return { success: true, data: allBooks };
    }

    static search(keywords) {
        const books = BooksDAO.searchBooks(keywords);
        if (books === null) {
            throw new Error('Error while reading the books!');
        }

        return { success: true, data: books };
    }

    static getBookDetails(bookID) {
        const book = BooksDAO.getBook(bookID);
        if (book) {
            return { success: true, data: book };
        } else {
            return { success: false, data: 'Book not found!' };
        }
    }
}
