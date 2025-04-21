import checkForErrorMessageParameter from "./Common/checkForError.js"
import URL_Mapper from "./Utils/URL_Mapper.js"
import displayProduct from "./Common/BookPopup.js"
import CartManager from "./Managers/CartManager.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
import Book from "./Models/Book.js"
import MessagePopup from "./Common/MessagePopup.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // Add fade-in animation to main sections
  const sections = document.querySelectorAll("main > section")
  sections.forEach((section, index) => {
    section.classList.add("fade-in")
    section.style.animationDelay = `${index * 0.2}s`
  })

  // DOM Elements
  const wishListContainer = document.getElementById("wishList")
  const backToProfileButton = document.getElementById("backToProfile")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize wish list page
  function initWishListPage() {
    // Show loading state
    wishListContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading wish list"></div>
      </div>
    `

    // Get wishlist items from localStorage
    let wishlistIds = []
    try {
      wishlistIds = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []
    } catch (e) {
      console.error("Error parsing wishlist:", e)
    }

    // If wishlist is empty, show empty state
    if (!wishlistIds || wishlistIds.length === 0) {
      displayEmptyWishList()
      return
    }

    // Mock data for demonstration - in a real app, this would be fetched from an API
    const mockBooks = [
      {
        bookID: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 75.0,
        overview: "A classic novel about the American Dream and the Roaring Twenties.",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 10,
        isAvailable: true,
        dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      },
      {
        bookID: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 85.5,
        overview: "A powerful story of racial injustice and moral growth in the American South.",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 5,
        isAvailable: true,
        dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
      },
      {
        bookID: 3,
        title: "1984",
        author: "George Orwell",
        price: 65.25,
        overview: "A dystopian novel about totalitarianism, surveillance, and thought control.",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 0,
        isAvailable: false,
        dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      },
      {
        bookID: 4,
        title: "Pride and Prejudice",
        author: "Jane Austen",
        price: 70.0,
        overview: "A romantic novel of manners that satirizes issues of class, marriage, and misconceptions.",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
        stock: 8,
        isAvailable: true,
        dateAdded: new Date().toISOString(), // Today
      },
    ]

    // Filter books based on wishlist IDs
    const wishlistBooks = mockBooks.filter((book) => wishlistIds.includes(book.bookID))

    // Simulate API call delay
    setTimeout(() => {
      onWishListLoaded(wishlistBooks)
    }, 500)

    // Event listeners
    if (backToProfileButton) {
      backToProfileButton.addEventListener("click", () => {
        window.location.href = URL_Mapper.PROFILE
      })
    }
  }

  // Handle wish list loaded
  function onWishListLoaded(wishListItems) {
    if (!wishListItems || wishListItems.length === 0) {
      displayEmptyWishList()
      return
    }

    // Clear loading state
    wishListContainer.innerHTML = ""

    // Create wish list items
    wishListItems.forEach((item, index) => {
      try {
        // Create a proper Book object with all required properties
        const book = new Book()
        Object.assign(book, item)

        // Ensure images are properly set
        if (!book.images || !book.images.length) {
          book.images = [
            {
              url: URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE,
              isMain: true,
            },
          ]
        }

        const wishListItemElement = createWishListItemElement(book, index, item.dateAdded)
        wishListContainer.appendChild(wishListItemElement)
      } catch (e) {
        console.error("Could not create book object:", e)
      }
    })
  }

  // Create wish list item element
  function createWishListItemElement(book, index, dateAdded) {
    const wishListItem = document.createElement("div")
    wishListItem.classList.add("wishlist-item")
    wishListItem.style.animationDelay = `${index * 0.1}s`

    // Get main image
    let imageUrl = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE
    if (book.images && book.images.length > 0) {
      const mainImage = book.images.find((img) => img.isMain)
      if (mainImage && mainImage.url) {
        imageUrl = mainImage.url
      } else if (book.images[0].url) {
        imageUrl = book.images[0].url
      }
    }

    // Determine availability status
    const isAvailable = book.isAvailable && book.stock > 0

    // Format date added
    const formattedDate = formatDate(dateAdded)

    wishListItem.innerHTML = `
      <div class="date-added">${formattedDate}</div>
      <img src="${imageUrl}" alt="${book.title}" class="wishlist-image" data-book-id="${book.bookID}">

      <div class="wishlist-item-details">
        <h3>${book.title}</h3>
        <p class="author">By ${book.author || "Unknown Author"}</p>
        <p class="overview">${book.overview || "No overview available"}</p>
        <span class="availability ${isAvailable ? "in-stock" : "out-of-stock"}">
          ${isAvailable ? `In Stock (${book.stock} available)` : "Out of Stock"}
        </span>
        <p class="price">${book.price ? book.price.toFixed(2) : "0.00"} EGP</p>

        <div class="wishlist-actions">
          <button class="add-to-cart-button" data-book-id="${book.bookID}" ${!isAvailable ? "disabled" : ""}>
            Add to Cart
          </button>
          <button class="remove-from-wishlist-button" data-book-id="${book.bookID}">
            Remove
          </button>
        </div>
      </div>
    `

    // Add event listeners
    const bookImage = wishListItem.querySelector(".wishlist-image")
    if (bookImage) {
      bookImage.addEventListener("click", () => {
        displayProduct(book)
      })
    }

    const addToCartButton = wishListItem.querySelector(".add-to-cart-button")
    if (addToCartButton) {
      addToCartButton.addEventListener("click", () => {
        addToCart(book.bookID)
      })
    }

    const removeButton = wishListItem.querySelector(".remove-from-wishlist-button")
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        removeFromWishList(book.bookID)
      })
    }

    return wishListItem
  }

  // Display empty wish list message
  function displayEmptyWishList() {
    wishListContainer.innerHTML = `
      <div class="empty-wishlist">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
        <p>Your wish list is empty</p>
        <a href="${URL_Mapper.PRODUCTS}">Browse Books</a>
      </div>
    `
  }

  // Format date
  function formatDate(dateString) {
    if (!dateString) {
      return "Recently added"
    }

    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now - date)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        return "Added today"
      } else if (diffDays === 1) {
        return "Added yesterday"
      } else {
        return `Added ${diffDays} days ago`
      }
    } catch (e) {
      console.error("Error formatting date:", e)
      return "Recently added"
    }
  }

  // Add to cart
  function addToCart(bookID) {
    // In a real app, this would call an API to add the item to the cart
    CartManager.addItem(
      userObject.userID,
      bookID,
      1,
      () => {
        MessagePopup.show("Item added to cart!")
      },
      (error) => {
        MessagePopup.show("Failed to add item to cart: " + error, true)
      },
    )
  }

  // Remove from wish list
  function removeFromWishList(bookID) {
    // Get current wishlist from localStorage
    let wishlist = []
    try {
      wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []
      wishlist = wishlist.filter((id) => id !== bookID)
      localStorage.setItem(`wishlist_${userObject.userID}`, JSON.stringify(wishlist))
    } catch (e) {
      console.error("Error updating wishlist:", e)
    }

    MessagePopup.show("Item removed from wish list!")

    // Refresh wish list
    initWishListPage()
  }

  // Initialize the page
  initWishListPage()
})
