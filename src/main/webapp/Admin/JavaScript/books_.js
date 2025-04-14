var booksString = [];
document.addEventListener("DOMContentLoaded", () => {

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


  //console.log("data to be loaded ---------->", booksString, "type ", typeof (booksString));

  let books = JSON.parse(booksString) || []

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
        <td><img src="Images/${book.mainImage}" alt="${book.title}" class="book-cover"></td>
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

  clientSideSearch(searchTerm)
}

// Client-side search fallback
function clientSideSearch(searchTerm) {
  const books = JSON.parse(booksString) || []

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


  // For now, use localStorage
  const books = JSON.parse(booksString) || []
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
    document.getElementById("mainImagePreview").style.backgroundImage = `url('Images/${book.mainImage}')`;


  }




  // Set additional image previews
  if (book.images && book.images.length > 0) {
    const previewIds = ["image1Preview", "image2Preview", "image3Preview", "image4Preview"]
    book.images.forEach((imageUrl, index) => {

      if (index < previewIds.length) {
        document.getElementById(previewIds[index]).style.backgroundImage = `url('Images/${imageUrl}')`
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

  deleteWebSocket.send(id);
  closeModal(document.getElementById("deleteModal"));

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


  const mainImageInput = document.getElementById("mainImage");


  let mainImage = "bookCover.jpg";
  if (bookId) {
    const books = JSON.parse(booksString) || [];
    console.log("-----books ", booksString);
    console.log(bookId);
    const book = books.find((book) => book.id == bookId)
    if (book) {
      mainImage = book.mainImage;

    }
  }



  if (mainImageInput.files && mainImageInput.files[0]) {
    const file = mainImageInput.files[0];
    mainImage = file.name; // Get the image filename


    const formData = new FormData();
    formData.append("file", file); // Matches the name in getPart("file")

    //upload the file
    fetch("uploadServlet", {
      method: "POST",
      body: formData
    })
      .then(response => response.text())
      .then(data => {
        //document.getElementById("result").innerText = data;
      })
      .catch(error => {
        console.error("Error:", error);
        //   document.getElementById("result").innerText = "Upload failed!";
      });

  }



  const imagePreviewIds = ["image1", "image2", "image3", "image4"]
  const images = []

  imagePreviewIds.forEach(previewId => {

    const preview = document.getElementById(previewId)

    if (preview.files && preview.files[0]) {
      images.push(preview.files[0].name); // Get the actual uploaded file name
      const file = preview.files[0];
      const formData = new FormData();
      formData.append("file", file); // Matches the name in getPart("file")

      //upload the file
      fetch("uploadServlet", {
        method: "POST",
        body: formData
      })
        .then(response => response.text())
        .then(data => {
          //document.getElementById("result").innerText = data;
        })
        .catch(error => {
          console.error("Error:", error);
          //   document.getElementById("result").innerText = "Upload failed!";
        });
    }

  })


  id = -1;

  const bookData = {
    id,
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

    // For now, use client-side update
    updateLocalStorageBook(bookData)
  } else {

    // For now, use client-side addition
    let books = JSON.parse(booksString) || [];
    bookData.id = books.length;
    addBook(bookData)
  }

  closeModal(document.getElementById("bookModal"))
  loadBooks()

}

// Update book in localStorage
function updateLocalStorageBook(bookData) {
  var jsonString = JSON.stringify(bookData); //convert into a json string


  editBookWebSokcet.send(jsonString);



}

// Add book to localStorage
function addBook(bookData) {


  var jsonString = JSON.stringify(bookData); //convert into a json string


  addBookWebSokcet.send(jsonString);




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


//-----------------------------------------------------------------------


var viewWebSocket;
var deleteWebSocket;
var addBookWebSokcet;
var editBookWebSokcet;
function connect() {

  console.log("In connect in books.js");


  viewWebSocket = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/ViewBooks");
  viewWebSocket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  viewWebSocket.onopen = onOpen;
  viewWebSocket.onmessage = viewOnMessage;

  //delete book websocket implementation
  deleteWebSocket = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/DeleteBook");
  deleteWebSocket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  deleteWebSocket.onopen = onOpen;
  deleteWebSocket.onmessage = deleteOnMessage;

  //add book websocket implementation
  addBookWebSokcet = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/AddBook");
  addBookWebSokcet.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  addBookWebSokcet.onopen = onOpen;
  addBookWebSokcet.onmessage = addOnMessage;

  //edit book websocket implementation
  editBookWebSokcet = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/EditBook");
  editBookWebSokcet.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  editBookWebSokcet.onopen = onOpen;
  editBookWebSokcet.onmessage = editOnMessage;

}

function onOpen() {
  console.log("connection established in books.js");

}

function viewOnMessage(event) {


  booksString = event.data;
  loadBooks();

}

function deleteOnMessage(event) {


  booksString = event.data;
  loadBooks();

}


function addOnMessage(event) {


  booksString = event.data;
  loadBooks();

}

function editOnMessage(event) {


  booksString = event.data;
  loadBooks();

}


