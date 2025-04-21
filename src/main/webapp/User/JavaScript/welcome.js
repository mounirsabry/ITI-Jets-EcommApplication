import checkForErrorMessageParameter from "./Common/checkForError.js"
import "./Common/pageLoader.js" // Import the page loader to ensure header is loaded
import URL_Mapper from "./Utils/URL_Mapper.js"
import { createBookCard } from "./Utils/bookUIFunctions.js"
import Book from "./Models/Book.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // Add fade-in animation to main sections
  const sections = document.querySelectorAll("main > section")
  sections.forEach((section, index) => {
    section.classList.add("fade-in")
    section.style.animationDelay = `${index * 0.2}s`
  })

  // DOM Elements
  const browseButton = document.getElementById("browseButton")
  const bannerMessages = document.getElementById("bannerMessages")
  const prevBtn = document.getElementById("prevBtn")
  const nextBtn = document.getElementById("nextBtn")
  const topSellingSection = document.getElementById("topSellingSection")
  const topSellingGenreSection = document.getElementById("topSellingGenreSection")

  // Initialize welcome page
  function initWelcomePage() {
    // Set up browse button
    if (browseButton) {
      browseButton.addEventListener("click", () => {
        window.location.href = URL_Mapper.PRODUCTS
      })
    }

    // Set up event listeners for banner navigation
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", showPreviousMessage)
      nextBtn.addEventListener("click", showNextMessage)

      // Auto-rotate messages
      setInterval(showNextMessage, 5000)
    }

    // Create containers for book sections if they don't exist
    if (topSellingSection) {
      const topBooksContainer = document.getElementById("topSelling")
      if (topBooksContainer) {
        topBooksContainer.innerHTML = `
          <div class="loading-container">
            <div class="loading-spinner" aria-label="Loading top books"></div>
          </div>
        `
      }
    }

    if (topSellingGenreSection) {
      const topGenreBooksContainer = document.getElementById("topSellingGenreBook")
      if (topGenreBooksContainer) {
        topGenreBooksContainer.innerHTML = `
          <div class="loading-container">
            <div class="loading-spinner" aria-label="Loading genre books"></div>
          </div>
        `
      }
    }

    // Mock data for demonstration - in a real app, this would be fetched from an API
    const mockTopBooks = [
      {
        bookID: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 75.0,
        discountedPercentage: 15,
        overview: "A classic novel about the American Dream and the Roaring Twenties.",
        genre: "Classic",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 10,
        isAvailable: true,
      },
      {
        bookID: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 85.5,
        discountedPercentage: 0,
        overview: "A powerful story of racial injustice and moral growth in the American South.",
        genre: "Classic",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 5,
        isAvailable: true,
      },
      {
        bookID: 3,
        title: "1984",
        author: "George Orwell",
        price: 65.25,
        discountedPercentage: 10,
        overview: "A dystopian novel about totalitarianism, surveillance, and thought control.",
        genre: "Science Fiction",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 8,
        isAvailable: true,
      },
      {
        bookID: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 70.0,
        discountedPercentage: 0,
        overview: "A romantic novel of manners that satirizes issues of class, marriage, and misconceptions.",
        genre: "Romance",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 12,
        isAvailable: true,
      },
    ]

    const mockTopGenreBooks = [
      {
        bookID: 5,
        title: "Dune",
        author: "Frank Herbert",
        price: 95.0,
        discountedPercentage: 5,
        overview: "A science fiction epic set in a distant future amidst a feudal interstellar society.",
        genre: "Science Fiction",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 7,
        isAvailable: true,
      },
      {
        bookID: 6,
        title: "Neuromancer",
        author: "William Gibson",
        price: 80.0,
        discountedPercentage: 0,
        overview: "A groundbreaking cyberpunk novel that explores artificial intelligence and virtual reality.",
        genre: "Science Fiction",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 3,
        isAvailable: true,
      },
      {
        bookID: 7,
        title: "Foundation",
        author: "Isaac Asimov",
        price: 85.5,
        discountedPercentage: 12,
        overview: "A science fiction novel about the decline and fall of a galactic empire.",
        genre: "Science Fiction",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 6,
        isAvailable: true,
      },
      {
        bookID: 8,
        title: "The Hitchhiker's Guide to the Galaxy",
        author: "Douglas Adams",
        price: 75.0,
        discountedPercentage: 0,
        overview: "A comedic science fiction series about the adventures of an unwitting human and his alien friend.",
        genre: "Science Fiction",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 9,
        isAvailable: true,
      },
    ]

    // Simulate API call delay
    setTimeout(() => {
      displayTopBooks(mockTopBooks)
      displayTopGenreBooks(mockTopGenreBooks)
    }, 500)
  }

  // Show previous message
  function showPreviousMessage() {
    const messages = document.querySelectorAll(".banner-text")
    if (!messages.length) return

    let currentMessageIndex = Array.from(messages).findIndex((msg) => msg.classList.contains("active"))
    if (currentMessageIndex === -1) currentMessageIndex = 0

    messages[currentMessageIndex].classList.remove("active")
    currentMessageIndex = (currentMessageIndex - 1 + messages.length) % messages.length
    messages[currentMessageIndex].classList.add("active")
  }

  // Show next message
  function showNextMessage() {
    const messages = document.querySelectorAll(".banner-text")
    if (!messages.length) return

    let currentMessageIndex = Array.from(messages).findIndex((msg) => msg.classList.contains("active"))
    if (currentMessageIndex === -1) currentMessageIndex = 0

    messages[currentMessageIndex].classList.remove("active")
    currentMessageIndex = (currentMessageIndex + 1) % messages.length
    messages[currentMessageIndex].classList.add("active")
  }

  // Display top selling books
  function displayTopBooks(books) {
    const topBooksContainer = document.getElementById("topSelling")
    if (!topBooksContainer) {
      console.error("Top selling books container not found")
      return
    }

    // Clear loading state
    topBooksContainer.innerHTML = ""

    // Create book cards
    books.forEach((bookData) => {
      try {
        // Create a proper Book object with all required properties
        const book = new Book()
        Object.assign(book, bookData)

        // Ensure images are properly set
        if (!book.images || !book.images.length) {
          book.images = [
            {
              url: URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE,
              isMain: true,
            },
          ]
        }

        const bookCard = createBookCard(book)
        topBooksContainer.appendChild(bookCard)
      } catch (e) {
        console.error("Could not create book object:", e)
      }
    })
  }

  // Display top genre books
  function displayTopGenreBooks(books) {
    const topGenreBooksContainer = document.getElementById("topSellingGenreBook")
    if (!topGenreBooksContainer) {
      console.error("Top genre books container not found")
      return
    }

    // Clear loading state
    topGenreBooksContainer.innerHTML = ""

    // Create book cards
    books.forEach((bookData) => {
      try {
        // Create a proper Book object with all required properties
        const book = new Book()
        Object.assign(book, bookData)

        // Ensure images are properly set
        if (!book.images || !book.images.length) {
          book.images = [
            {
              url: URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE,
              isMain: true,
            },
          ]
        }

        const bookCard = createBookCard(book)
        topGenreBooksContainer.appendChild(bookCard)
      } catch (e) {
        console.error("Could not create book object:", e)
      }
    })
  }

  // Initialize the page
  initWelcomePage()
})
