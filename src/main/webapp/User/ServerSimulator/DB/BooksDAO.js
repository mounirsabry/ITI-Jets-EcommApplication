'use strict';

import Book from "../Models/Book.js";

class BooksDAO {
    #STORAGE_KEY = 'books';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]');
        }
    }

    getAllRawBooks() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY));
    }

    getBook(bookID) {
        const foundBook = this.getAllRawBooks()
            .map(book => Book.fromJSON(book))
            .find(book => book.bookID === bookID);
        return foundBook || null;
    }

    searchBooks(keywords) {
        const searchTerms = keywords.toLowerCase().split(' ');
        return this.getAllRawBooks()
            .map(book => Book.fromJSON(book))
            .filter(book => {
                const target = `${book.title} ${book.author} ${book.publisher} ${book.description} ${book.overview} ${book.language} ${book.isbn}`.toLowerCase();
                return searchTerms.every(term => target.includes(term));
            });
    }

    saveBook(updatedBook) {
        const books = this.getAllRawBooks().map(book => Book.fromJSON(book));
        const index = books.findIndex(b => b.bookID === updatedBook.bookID);
        if (index >= 0) {
            books[index] = updatedBook;
        } else {
            books.push(updatedBook);
        }
        this.saveAllBooks(books);
    }

    saveAllBooks(books) {
        const bookJSONList = books.map(book => book.toJSON());
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(bookJSONList));
    }
}

export default new BooksDAO();