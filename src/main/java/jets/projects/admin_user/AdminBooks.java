package jets.projects.admin_user;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Vector;

import jets.projects.beans.BookBean;

public class AdminBooks {

    public static int id = 7;

    // Changed from array to Vector
    public static Vector<BookBean> books = new Vector<>(Arrays.asList(
            new BookBean(
                    1,
                    "To Kill a Mockingbird",
                    "Harper Lee",
                    "J. B. Lippincott & Co.",
                    "978-0446310789",
                    "Fiction",
                    12.99,
                    0,
                    25,
                    "Available",
                    "bookCover.jpg",
                    new ArrayList<>(),
                    "1960-07-11",
                    "English",
                    281,
                    "To Kill a Mockingbird is a novel..."
            ),
            new BookBean(
                    2,
                    "1984",
                    "George Orwell",
                    "Secker & Warburg",
                    "978-0451524935",
                    "Science Fiction",
                    10.99,
                    15,
                    15,
                    "Available",
                    "bookCover2.jpg",
                    new ArrayList<>(),
                    "1949-06-08",
                    "English",
                    328,
                    "1984 is a dystopian novel..."
            ),
            new BookBean(
                    3,
                    "The Great Gatsby",
                    "F. Scott Fitzgerald",
                    "Charles Scribner's Sons",
                    "978-0743273565",
                    "Fiction",
                    9.99,
                    0,
                    10,
                    "Available",
                    "bookCover.jpg",
                    new ArrayList<>(),
                    "1925-04-10",
                    "English",
                    180,
                    "The Great Gatsby is a 1925 novel..."
            )
    ));

    public static boolean deleteBookById(int id) {
        for (int i = 0; i < books.size(); i++) {
            if (books.get(i).getId() == id) {
                books.remove(i);
                return true;
            }
        }
        return false;
    }

    public static boolean editBookById(int id, BookBean updatedBook) {
        for (int i = 0; i < books.size(); i++) {
            if (books.get(i).getId() == id) {
                books.set(i, updatedBook);
                return true;
            }
        }
        return false;
    }

    public static void addBook(BookBean newBook) {
        books.add(newBook);
    }

    public static Vector<BookBean> getBooks() {
        return new Vector<>(books); // Return a copy
    }

    public static void printAllBooks() {
        for (BookBean book : books) {
            System.out.println(book.getTitle() + " by " + book.getAuthor());
        }
    }
}
