'use strict';

import Book from '../Models/Book.js';
import BookImage from '../Models/BookImage.js';
import Genres from '../Models/Genres.js';
import URL_Mapper from '../Utils/URL_Mapper.js';

// Function to generate a random overview and description
function generateRandomText(length) {
    const words = "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua".split(' ');
    let result = [];
    for (let i = 0; i < length; i++) {
        result.push(words[Math.floor(Math.random() * words.length)]);
    }
    return result.join(' ');
}

// Function to generate a random number within a range
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateRandomDateAndTime() {
    // Define the range for past dates.
    const now = new Date();
    const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());

    // Generate a random timestamp between the current date and ago date.
    const randomTimestamp = new Date(
        twoYearsAgo.getTime() +
        Math.random() * (now.getTime() - twoYearsAgo.getTime())
    );

    // Manually format the date to match ISO 8601 without milliseconds
    const year = randomTimestamp.getUTCFullYear();
    const month = String(randomTimestamp.getUTCMonth() + 1).padStart(2, '0');
    const day = String(randomTimestamp.getUTCDate()).padStart(2, '0');
    const hours = String(randomTimestamp.getUTCHours()).padStart(2, '0');
    const minutes = String(randomTimestamp.getUTCMinutes()).padStart(2, '0');
    const seconds = String(randomTimestamp.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;
}

// Function to shuffle an array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to generate a random book
function generateRandomBook(bookID) {
    const genresArray = Object.values(Genres);
    const randomGenre = genresArray[getRandomInt(0, genresArray.length - 1)];

    const imagePaths = shuffleArray(Object.values(URL_Mapper?.ASSETS?.BOOKS || {}));

    const numberOfImages = getRandomInt(0, 5);
    const images = Array.from({ length: numberOfImages }, (_, i) => new BookImage(
        imagePaths[i % imagePaths.length],
        i === 0 // Assuming the first image is the main image if available
    ));

    const book = new Book();
    book.bookID = bookID;
    book.title = `Random Book ${bookID}`;
    book.author = `Author ${String.fromCharCode(65 + getRandomInt(0, 25))}`;
    book.genre = randomGenre;
    book.publisher = `Publisher ${String.fromCharCode(65 + getRandomInt(0, 25))}`;
    book.publicationDate = generateRandomDateAndTime(); // Example publication date
    book.isbn = `978-3-16-148410-${bookID}`;
    book.description = generateRandomText(100);
    book.overview = generateRandomText(30);
    book.numberOfPages = getRandomInt(50, 500);
    book.language = 'English';
    book.isAvailable = Math.random() >= 0.15;
    book.stock = getRandomInt(0, 100);
    book.price = getRandomInt(40, 300);
    book.discountedPercentage = getRandomInt(0, 50);
    book.images = images;
    book.copiesSold = getRandomInt(0, 100);

    return book;
}

// Generate an array of n random books
const length = 60;
const testingBooks = [];

for (let i = 0; i < length; i++) {
    const book = generateRandomBook(i + 1);
    testingBooks.push(book);
}

// Export the random books array
export default testingBooks;
