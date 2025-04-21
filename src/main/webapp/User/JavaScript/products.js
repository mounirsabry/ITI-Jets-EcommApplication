import checkForErrorMessageParameter from "./Common/checkForError.js"
import { createBookCard } from "./Utils/bookUIFunctions.js"
import BooksManager from "./Managers/BooksManager.js"
import Book from "./Models/Book.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // DOM Elements
  const searchBar = document.getElementById("searchBar")
  const searchButton = document.getElementById("searchButton")
  const genreFilter = document.getElementById("genreFilter")
  const unavailableToggle = document.getElementById("unavailableToggle")
  const booksList = document.getElementById("booksList")
  const prevPageBtn = document.getElementById("prevPage")
  const nextPageBtn = document.getElementById("nextPage")
  const pageInput = document.getElementById("pageInput")
  const pageIndicator = document.getElementById("pageIndicator")
  const resultsCount = document.getElementById("resultsCount")
  const gridViewBtn = document.getElementById("gridViewBtn")
  const listViewBtn = document.getElementById("listViewBtn")

  // State variables
  let allBooks = []
  let filteredBooks = []
  let currentPage = 1
  const booksPerPage = 12
  let totalPages = 1
  const genres = new Set(["All Genres"])
  let currentView = "grid" // Default view

  // Add fade-in animation to main sections
  const sections = document.querySelectorAll("main > section")
  sections.forEach((section, index) => {
    section.classList.add("fade-in")
    section.style.animationDelay = `${index * 0.2}s`
  })

  // Initialize the page
  function init() {
    // Show loading state
    booksList.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading books"></div>
      </div>
    `

    // Fetch all books
    BooksManager.getAllBooks(onBooksLoaded, onError)

    // Event listeners
    searchButton.addEventListener("click", handleSearch)
    searchBar.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        handleSearch()
      }
    })
    genreFilter.addEventListener("change", filterBooks)
    unavailableToggle.addEventListener("change", filterBooks)
    prevPageBtn.addEventListener("click", goToPrevPage)
    nextPageBtn.addEventListener("click", goToNextPage)
    pageInput.addEventListener("change", goToSpecificPage)

    // View toggle buttons
    gridViewBtn.addEventListener("click", () => setView("grid"))
    listViewBtn.addEventListener("click", () => setView("list"))

    // Check for saved view preference
    const savedView = localStorage.getItem("bookViewPreference")
    if (savedView) {
      setView(savedView)
    }
  }

  // Set view (grid or list)
  function setView(view) {
    currentView = view

    // Update buttons
    gridViewBtn.classList.toggle("active", view === "grid")
    listViewBtn.classList.toggle("active", view === "list")

    // Update book list
    booksList.classList.toggle("grid-view", view === "grid")
    booksList.classList.toggle("list-view", view === "list")

    // Save preference
    localStorage.setItem("bookViewPreference", view)

    // Redisplay books to ensure proper layout
    displayBooks()
  }

  // Handle books loaded from API
  function onBooksLoaded(books) {
    if (!books || books.length === 0) {
      booksList.innerHTML = `
        <div class="no-results">
          <p>No books available at the moment.</p>
        </div>
      `
      resultsCount.textContent = "No books found"
      return
    }

    allBooks = books
      .map((book) => {
        try {
          return Book.fromJSON(book)
        } catch (e) {
          console.error("Could not parse book:", e)
          return null
        }
      })
      .filter((book) => book !== null)

    // Extract genres for filter
    allBooks.forEach((book) => {
      if (book.genre) {
        genres.add(book.genre)
      }
    })

    // Populate genre filter
    populateGenreFilter()

    // Initial filtering and display
    filterBooks()
  }

  // Handle API errors
  function onError(error) {
    console.error("Error loading books:", error)
    booksList.innerHTML = `
      <div class="no-results">
        <p>Failed to load books. Please try again later.</p>
      </div>
    `
    resultsCount.textContent = "Error loading books"
  }

  // Populate genre filter dropdown
  function populateGenreFilter() {
    genreFilter.innerHTML = '<option value="all">All Genres</option>'

    // Sort genres alphabetically
    const sortedGenres = Array.from(genres).sort()

    sortedGenres.forEach((genre) => {
      if (genre !== "All Genres") {
        const option = document.createElement("option")
        option.value = genre
        option.textContent = genre
        genreFilter.appendChild(option)
      }
    })
  }

  // Handle search button click
  function handleSearch() {
    const searchTerm = searchBar.value.trim()

    if (searchTerm === "") {
      // If search is empty, show all books
      filterBooks()
      return
    }

    // Show loading state
    booksList.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Searching books"></div>
      </div>
    `
    resultsCount.textContent = "Searching..."

    // Search via API
    BooksManager.search(searchTerm, onSearchResults, onError)
  }

  // Handle search results
  function onSearchResults(books) {
    if (!books || books.length === 0) {
      booksList.innerHTML = `
        <div class="no-results">
          <p>No books found matching your search.</p>
        </div>
      `
      resultsCount.textContent = "No books found"
      return
    }

    allBooks = books
      .map((book) => {
        try {
          return Book.fromJSON(book)
        } catch (e) {
          console.error("Could not parse book:", e)
          return null
        }
      })
      .filter((book) => book !== null)

    // Apply filters to search results
    filterBooks()
  }

  // Filter books based on selected criteria
  function filterBooks() {
    const selectedGenre = genreFilter.value
    const includeUnavailable = unavailableToggle.checked

    filteredBooks = allBooks.filter((book) => {
      // Filter by genre
      const genreMatch = selectedGenre === "all" || book.genre === selectedGenre

      // Filter by availability
      const availabilityMatch = includeUnavailable || (book.isAvailable && book.stock > 0)

      return genreMatch && availabilityMatch
    })

    // Reset pagination
    currentPage = 1
    totalPages = Math.ceil(filteredBooks.length / booksPerPage)

    // Update results count
    updateResultsCount()

    // Update UI
    updatePagination()
    displayBooks()
  }

  // Update results count text
  function updateResultsCount() {
    if (filteredBooks.length === 0) {
      resultsCount.textContent = "No books found"
    } else if (filteredBooks.length === 1) {
      resultsCount.textContent = "Showing 1 book"
    } else {
      resultsCount.textContent = `Showing ${filteredBooks.length} books`
    }
  }

  // Display books for current page
  function displayBooks() {
    if (filteredBooks.length === 0) {
      booksList.innerHTML = `
        <div class="no-results">
          <p>No books match your current filters.</p>
        </div>
      `
      return
    }

    // Calculate start and end indices for current page
    const startIndex = (currentPage - 1) * booksPerPage
    const endIndex = Math.min(startIndex + booksPerPage, filteredBooks.length)

    // Clear previous books
    booksList.innerHTML = ""

    // Display books for current page
    for (let i = startIndex; i < endIndex; i++) {
      const book = filteredBooks[i]
      const bookElement = createBookCard(book)
      bookElement.classList.add("fade-in")
      bookElement.style.animationDelay = `${(i - startIndex) * 0.1}s`
      booksList.appendChild(bookElement)
    }
  }

  // Update pagination controls
  function updatePagination() {
    pageInput.value = currentPage
    pageInput.max = totalPages
    pageIndicator.textContent = `Page ${currentPage} of ${totalPages}`

    // Enable/disable navigation buttons
    prevPageBtn.disabled = currentPage <= 1
    nextPageBtn.disabled = currentPage >= totalPages
  }

  // Navigation functions
  function goToPrevPage() {
    if (currentPage > 1) {
      currentPage--
      updatePagination()
      displayBooks()
      // Scroll to top of book list
      booksList.scrollIntoView({ behavior: "smooth" })
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      currentPage++
      updatePagination()
      displayBooks()
      // Scroll to top of book list
      booksList.scrollIntoView({ behavior: "smooth" })
    }
  }

  function goToSpecificPage() {
    const pageNum = Number.parseInt(pageInput.value)

    if (pageNum >= 1 && pageNum <= totalPages) {
      currentPage = pageNum
    } else {
      // Reset to valid value
      pageInput.value = currentPage
    }

    updatePagination()
    displayBooks()
    // Scroll to top of book list
    booksList.scrollIntoView({ behavior: "smooth" })
  }

  // Initialize the page
  init()
})
