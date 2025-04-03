document.addEventListener("DOMContentLoaded", () => {
  // Load books data
  loadBooks()

  // Add book button
  const addBookBtn = document.getElementById("addBookBtn")
  addBookBtn.addEventListener("click", () => {
    document.getElementById("modalTitle").textContent = "Add New Book"
    document.getElementById("bookForm").reset()
    document.getElementById("bookId").value = ""
    
    // Clear all image previews
    document.getElementById("mainImagePreview").style.backgroundImage = ""
    document.getElementById("image1Preview").style.backgroundImage = ""
    document.getElementById("image2Preview").style.backgroundImage = ""
    document.getElementById("image3Preview").style.backgroundImage = ""
    document.getElementById("image4Preview").style.backgroundImage = ""

    // Set default publication date to today
    const today = new Date().toISOString().split("T")[0]
    document.getElementById("publicationDate").value = today

    openModal("bookModal")
  })

  // Book form submission
  const bookForm = document.getElementById("bookForm")
  bookForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveBook()
  })

  // Cancel button
  const cancelBtn = document.getElementById("cancelBtn")
  cancelBtn.addEventListener("click", () => {
    closeModal(document.getElementById("bookModal"))
  })

  // Cancel delete button
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
  cancelDeleteBtn.addEventListener("click", () => {
    closeModal(document.getElementById("deleteModal"))
  })

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
  confirmDeleteBtn.addEventListener("click", () => {
    deleteBook()
  })

  // Image preview functionality
  setupImagePreviews()

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  searchBtn.addEventListener("click", () => {
    const searchTerm = document.getElementById("bookSearch").value.toLowerCase()
    searchBooks(searchTerm)
  })

  // Search on enter key
  const bookSearch = document.getElementById("bookSearch")
  bookSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.toLowerCase()
      searchBooks(searchTerm)
    }
  })

  // Make functions available globally
  window.editBook = editBook
  window.confirmDelete = confirmDelete
})

// Setup image preview functionality for all image inputs
function setupImagePreviews() {
  const imageInputs = [
    { input: "mainImage", preview: "mainImagePreview" },
    { input: "image1", preview: "image1Preview" },
    { input: "image2", preview: "image2Preview" },
    { input: "image3", preview: "image3Preview" },
    { input: "image4", preview: "image4Preview" }
  ]

  imageInputs.forEach(item => {
    const inputElement = document.getElementById(item.input)
    inputElement.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          document.getElementById(item.preview).style.backgroundImage = `url(${e.target.result})`
        }
        reader.readAsDataURL(file)
      }
    })
  })
}

// Load books from localStorage or initialize with sample data
function loadBooks() {
  // AJAX call to get books data (commented out as backend is not ready)
  /*
  fetch('/api/books')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      // Store books in localStorage for offline use
      localStorage.setItem("books", JSON.stringify(data));
      displayBooks(data);
    })
    .catch(error => {
      console.error('Error fetching books:', error);
      // Fall back to localStorage if API call fails
      const books = JSON.parse(localStorage.getItem("books")) || [];
      displayBooks(books);
    });
  */

  // For now, use dummy data
  let books = JSON.parse(localStorage.getItem("books")) || []

  // If no books in localStorage, initialize with sample data
  if (books.length === 0) {
    books = [
      {
        id: 1,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        publisher: "J. B. Lippincott & Co.",
        isbn: "978-0446310789",
        genre: "Fiction",
        price: 12.99,
        discount: 0,
        quantity: 25,
        status: "Available",
        mainImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1433739169i/25685842.jpg",
        images: [], // Additional images array
        publicationDate: "1960-07-11",
        language: "English",
        pages: 281,
        overview:
          "To Kill a Mockingbird is a novel by Harper Lee published in 1960. It was immediately successful, winning the Pulitzer Prize, and has become a classic of modern American literature.",
      },
      {
        id: 2,
        title: "1984",
        author: "George Orwell",
        publisher: "Secker & Warburg",
        isbn: "978-0451524935",
        genre: "Science Fiction",
        price: 10.99,
        discount: 15,
        quantity: 15,
        status: "Available",
        mainImage: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1433739169i/25685842.jpg",
        images: [], // Additional images array
        publicationDate: "1949-06-08",
        language: "English",
        pages: 328,
        overview:
          "1984 is a dystopian novel by George Orwell published in 1949. The novel is set in Airstrip One, a province of the superstate Oceania in a world of perpetual war, omnipresent government surveillance, and public manipulation.",
      },
      {
        id: 3,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        publisher: "Charles Scribner's Sons",
        isbn: "978-0743273565",
        genre: "Fiction",
        price: 9.99,
        discount: 0,
        quantity: 10,
        status: "Available",
        mainImage: "https://placeholder.svg?height=150&width=100",
        images: [], // Additional images array
        publicationDate: "1925-04-10",
        language: "English",
        pages: 180,
        overview:
          "The Great Gatsby is a 1925 novel by American writer F. Scott Fitzgerald. Set in the Jazz Age on Long Island, the novel depicts narrator Nick Carraway's interactions with mysterious millionaire Jay Gatsby and Gatsby's obsession to reunite with his former lover, Daisy Buchanan.",
      },
      {
        id: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        publisher: "T. Egerton",
        isbn: "978-0141439518",
        genre: "Romance",
        price: 8.99,
        discount: 10,
        quantity: 5,
        status: "Available",
        mainImage: "https://placeholder.svg?height=150&width=100",
        images: [], // Additional images array
        publicationDate: "1813-01-28",
        language: "English",
        pages: 432,
        overview:
          "Pride and Prejudice is an 1813 romantic novel of manners written by Jane Austen. The novel follows the character development of Elizabeth Bennet, the dynamic protagonist of the book who learns about the repercussions of hasty judgments and comes to appreciate the difference between superficial goodness and actual goodness.",
      },
      {
        id: 5,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        publisher: "George Allen & Unwin",
        isbn: "978-0547928227",
        genre: "Fantasy",
        price: 14.99,
        discount: 20,
        quantity: 0,
        status: "Not Available",
        mainImage: "https://placeholder.svg?height=150&width=100",
        images: [], // Additional images array
        publicationDate: "1937-09-21",
        language: "English",
        pages: 310,
        overview:
          "The Hobbit, or There and Back Again is a children's fantasy novel by English author J. R. R. Tolkien. It was published on 21 September 1937 to wide critical acclaim, being nominated for the Carnegie Medal and awarded a prize from the New York Herald Tribune for best juvenile fiction.",
      },
    ]
    localStorage.setItem("books", JSON.stringify(books))
  }

  displayBooks(books)
}

// Display books in the table
function displayBooks(books) {
  const booksTable = document.getElementById("booksTable")
  booksTable.innerHTML = ""

  books.forEach((book) => {
    const statusClass = book.status === "Available" ? "status-available" : "status-unavailable"
    const discountDisplay = book.discount > 0 ? `${book.discount}%` : "-"

    booksTable.innerHTML += `
      <tr>
        <td><img src="${book.mainImage}" alt="${book.title}" class="book-cover"></td>
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.genre}</td>
        <td>${formatCurrency(book.price)}</td>
        <td>${discountDisplay}</td>
        <td>${book.quantity}</td>
        <td><span class="status-badge ${statusClass}">${book.status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="editBook(${book.id})">Edit</button>
            <button class="btn btn-danger" onclick="confirmDelete(${book.id})">Delete</button>
          </div>
        </td>
      </tr>
    `
  })
}

// Search books
function searchBooks(searchTerm) {
  // AJAX call to search books (commented out as backend is not ready)
  /*
  fetch(`/api/books/search?term=${encodeURIComponent(searchTerm)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      displayBooks(data);
    })
    .catch(error => {
      console.error('Error searching books:', error);
      // Fall back to client-side search
      clientSideSearch(searchTerm);
    });
  */

  // For now, use client-side search
  clientSideSearch(searchTerm)
}

// Client-side search fallback
function clientSideSearch(searchTerm) {
  const books = JSON.parse(localStorage.getItem("books")) || []

  if (!searchTerm) {
    displayBooks(books)
    return
  }

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm) ||
      book.author.toLowerCase().includes(searchTerm) ||
      book.isbn.toLowerCase().includes(searchTerm),
  )

  displayBooks(filteredBooks)
}

// Edit book
function editBook(id) {
  // AJAX call to get book details (commented out as backend is not ready)
  /*
  fetch(`/api/books/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      return response.json();
    })
    .then(book => {
      populateBookForm(book);
    })
    .catch(error => {
      console.error('Error fetching book details:', error);
      // Fall back to localStorage
      const books = JSON.parse(localStorage.getItem("books")) || [];
      const book = books.find((book) => book.id === id);
      if (book) {
        populateBookForm(book);
      }
    });
  */

  // For now, use localStorage
  const books = JSON.parse(localStorage.getItem("books")) || []
  const book = books.find((book) => book.id === id)

  if (book) {
    populateBookForm(book)
  }
}

// Populate book form with data
function populateBookForm(book) {
  document.getElementById("modalTitle").textContent = "Edit Book"
  document.getElementById("bookId").value = book.id
  document.getElementById("title").value = book.title
  document.getElementById("author").value = book.author
  document.getElementById("publisher").value = book.publisher
  document.getElementById("isbn").value = book.isbn
  document.getElementById("genre").value = book.genre
  document.getElementById("price").value = book.price
  document.getElementById("discount").value = book.discount || 0
  document.getElementById("quantity").value = book.quantity
  document.getElementById("status").value = book.status
  document.getElementById("description").value = book.description || ""
  document.getElementById("publicationDate").value = book.publicationDate || ""
  document.getElementById("language").value = book.language || "English"
  document.getElementById("pages").value = book.pages || ""
  document.getElementById("overview").value = book.overview || ""

  // Set main image preview
  if (book.mainImage) {
    document.getElementById("mainImagePreview").style.backgroundImage = `url(${book.mainImage})`
  }

  // Set additional image previews
  if (book.images && book.images.length > 0) {
    const previewIds = ["image1Preview", "image2Preview", "image3Preview", "image4Preview"]
    book.images.forEach((imageUrl, index) => {
      if (index < previewIds.length) {
        document.getElementById(previewIds[index]).style.backgroundImage = `url(${imageUrl})`
      }
    })
  }

  openModal("bookModal")
}

// Confirm delete
function confirmDelete(id) {
  document.getElementById("confirmDeleteBtn").setAttribute("data-id", id)
  openModal("deleteModal")
}

// Delete book
function deleteBook() {
  const id = Number.parseInt(document.getElementById("confirmDeleteBtn").getAttribute("data-id"))

  // AJAX call to delete book (commented out as backend is not ready)
  /*
  fetch(`/api/books/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Update localStorage after successful deletion
      let books = JSON.parse(localStorage.getItem("books")) || [];
      books = books.filter((book) => book.id !== id);
      localStorage.setItem("books", JSON.stringify(books));
      
      closeModal(document.getElementById("deleteModal"));
      loadBooks();
    })
    .catch(error => {
      console.error('Error deleting book:', error);
      // Fall back to client-side deletion
      clientSideDelete(id);
    });
  */

  // For now, use client-side deletion
  clientSideDelete(id)
}

// Client-side delete fallback
function clientSideDelete(id) {
  let books = JSON.parse(localStorage.getItem("books")) || []
  books = books.filter((book) => book.id !== id)
  localStorage.setItem("books", JSON.stringify(books))

  closeModal(document.getElementById("deleteModal"))
  loadBooks()
}

// Save book
function saveBook() {
  const bookId = document.getElementById("bookId").value
  const title = document.getElementById("title").value
  const author = document.getElementById("author").value
  const publisher = document.getElementById("publisher").value
  const isbn = document.getElementById("isbn").value
  const genre = document.getElementById("genre").value
  const price = Number.parseFloat(document.getElementById("price").value)
  const discount = Number.parseInt(document.getElementById("discount").value) || 0
  const quantity = Number.parseInt(document.getElementById("quantity").value)
  const status = document.getElementById("status").value
  const description = document.getElementById("description").value
  const publicationDate = document.getElementById("publicationDate").value
  const language = document.getElementById("language").value
  const pages = Number.parseInt(document.getElementById("pages").value)
  const overview = document.getElementById("overview").value

  // Get main image from preview
  let mainImage = "https://placeholder.svg?height=150&width=100"
  const mainImagePreview = document.getElementById("mainImagePreview")
  if (mainImagePreview.style.backgroundImage) {
    const bgImage = mainImagePreview.style.backgroundImage
    mainImage = bgImage.replace(/url\(['"](.+)['"]\)/, "$1")
  }

  // Get additional images from previews
  const imagePreviewIds = ["image1Preview", "image2Preview", "image3Preview", "image4Preview"]
  const images = []
  
  imagePreviewIds.forEach(previewId => {
    const preview = document.getElementById(previewId)
    if (preview.style.backgroundImage) {
      const bgImage = preview.style.backgroundImage
      const imageUrl = bgImage.replace(/url\(['"](.+)['"]\)/, "$1")
      images.push(imageUrl)
    }
  })

  const bookData = {
    title,
    author,
    publisher,
    isbn,
    genre,
    price,
    discount,
    quantity,
    status,
    description,
    mainImage,
    images,
    publicationDate,
    language,
    pages,
    overview,
  }

  if (bookId) {
    // Update existing book
    bookData.id = Number.parseInt(bookId)

    // AJAX call to update book (commented out as backend is not ready)
    /*
    fetch(`/api/books/${bookId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update localStorage after successful update
        updateLocalStorageBook(bookData);
        
        closeModal(document.getElementById("bookModal"));
        loadBooks();
      })
      .catch(error => {
        console.error('Error updating book:', error);
        // Fall back to client-side update
        updateLocalStorageBook(bookData);
        closeModal(document.getElementById("bookModal"));
        loadBooks();
      });
    */

    // For now, use client-side update
    updateLocalStorageBook(bookData)
  } else {
    // Add new book
    // AJAX call to add book (commented out as backend is not ready)
    /*
    fetch('/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update localStorage after successful addition
        addLocalStorageBook(data);
        
        closeModal(document.getElementById("bookModal"));
        loadBooks();
      })
      .catch(error => {
        console.error('Error adding book:', error);
        // Fall back to client-side addition
        addLocalStorageBook(bookData);
        closeModal(document.getElementById("bookModal"));
        loadBooks();
      });
    */

    // For now, use client-side addition
    addLocalStorageBook(bookData)
  }

  closeModal(document.getElementById("bookModal"))
  loadBooks()
}

// Update book in localStorage
function updateLocalStorageBook(bookData) {
  const books = JSON.parse(localStorage.getItem("books")) || []
  const index = books.findIndex((book) => book.id === bookData.id)

  if (index !== -1) {
    books[index] = {
      ...books[index],
      ...bookData,
    }
    localStorage.setItem("books", JSON.stringify(books))
  }
}

// Add book to localStorage
function addLocalStorageBook(bookData) {
  const books = JSON.parse(localStorage.getItem("books")) || []
  const newId = books.length > 0 ? Math.max(...books.map((book) => book.id)) + 1 : 1

  books.push({
    id: newId,
    ...bookData,
  })

  localStorage.setItem("books", JSON.stringify(books))
}

// Helper functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal(modal) {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number)
}