import URL_Mapper from "./URL_Mapper.js"
import UserAuthTracker from "../Common/UserAuthTracker.js"
import MessagePopup from "../Common/MessagePopup.js"
import displayProduct from "../Common/BookPopup.js"
import WishlistManager from "./WishlistManager.js"

// Create a book card element
export function createBookCard(book) {
  const bookElement = document.createElement("div")
  bookElement.classList.add("book-card")

  const imagesArray = book.images || []
  const mainImage = imagesArray.find((image) => image.isMain)
  const imageUrl = mainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE

  // Calculate discounted price if applicable
  const hasDiscount = book.discountedPercentage > 0
  const originalPrice = book.price
  const discountedPrice = hasDiscount ? originalPrice * (1 - book.discountedPercentage / 100) : originalPrice

  // Check if book is in wishlist
  const isInWishlist = WishlistManager.isInWishlist(book.bookID)

  // Check if book is available
  const isAvailable = book.isAvailable && book.stock > 0
  const stockStatusClass = isAvailable ? "stock-status" : "stock-status out-of-stock"
  const stockStatusText = isAvailable ? "In Stock" : "Out of Stock"

  // Create HTML structure
  bookElement.innerHTML = `
    <div class="book-image-container">
      <img src="${imageUrl}" alt="${book.title}" class="product-image" loading="lazy">
      ${hasDiscount ? `<div class="discount-badge">-${book.discountedPercentage}%</div>` : ""}
      <div class="book-overview">${book.overview || "No overview available"}</div>
      <button class="wishlist-button ${isInWishlist ? "in-wishlist" : ""}" data-book-id="${book.bookID}" aria-label="${isInWishlist ? "Remove from wishlist" : "Add to wishlist"}">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${isInWishlist ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
        </svg>
      </button>
    </div>
    <div class="book-content">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">by ${book.author || "Unknown author"}</p>
      <div class="book-category">${book.genre || "General"}</div>
      <div class="book-price">
        ${hasDiscount ? `<span class="original-price">${originalPrice.toFixed(2)} EGP</span>` : ""}
        <span class="current-price">${discountedPrice.toFixed(2)} EGP</span>
      </div>
      <div class="${stockStatusClass}">
        ${stockStatusText}
      </div>
      <div class="cart-controls">
        <div class="quantity-controls">
          <button class="quantity-button decrease-quantity" ${!isAvailable ? "disabled" : ""} aria-label="Decrease quantity">-</button>
          <input type="number" min="1" max="${book.stock}" value="1" class="quantity-input" aria-label="Quantity">
          <button class="quantity-button increase-quantity" ${!isAvailable ? "disabled" : ""} aria-label="Increase quantity">+</button>
        </div>
        <button class="add-to-cart" ${!isAvailable ? "disabled" : ""}>
          Add to Cart
        </button>
      </div>
    </div>
  `

  // Add event listeners
  const decreaseBtn = bookElement.querySelector(".decrease-quantity")
  const increaseBtn = bookElement.querySelector(".increase-quantity")
  const quantityInput = bookElement.querySelector(".quantity-input")
  const addToCartBtn = bookElement.querySelector(".add-to-cart")
  const productImage = bookElement.querySelector(".product-image")
  const bookImageContainer = bookElement.querySelector(".book-image-container")
  const wishlistButton = bookElement.querySelector(".wishlist-button")

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      e.stopPropagation() // Prevent event bubbling
      const currentValue = Number.parseInt(quantityInput.value) || 1
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })

    increaseBtn.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      e.stopPropagation() // Prevent event bubbling
      const currentValue = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.max) || 99
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1
      }
    })

    // Ensure valid input when manually typing
    quantityInput.addEventListener("change", (e) => {
      e.stopPropagation() // Prevent event bubbling
      let value = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.max) || 99

      if (value < 1) value = 1
      if (value > maxValue) value = maxValue

      quantityInput.value = value
    })
  }

  if (addToCartBtn && isAvailable) {
    addToCartBtn.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      e.stopPropagation() // Prevent event bubbling
      const quantity = Number.parseInt(quantityInput.value) || 1
      addToCart(book.bookID, quantity)
    })
  }

  // Make the entire image container clickable to show popup
  if (bookImageContainer) {
    bookImageContainer.addEventListener("click", (e) => {
      // Don't trigger if clicking on the wishlist button
      if (e.target.closest(".wishlist-button")) {
        return
      }
      displayProduct(book)
    })
  }

  // Also make the product image clickable
  if (productImage) {
    productImage.addEventListener("click", (e) => {
      e.stopPropagation() // Prevent event bubbling
      displayProduct(book)
    })
  }

  // Add wishlist button functionality
  if (wishlistButton) {
    wishlistButton.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      e.stopPropagation() // Prevent event bubbling

      const isCurrentlyInWishlist = wishlistButton.classList.contains("in-wishlist")

      if (isCurrentlyInWishlist) {
        // Remove from wishlist
        if (WishlistManager.removeFromWishlist(book.bookID)) {
          wishlistButton.classList.remove("in-wishlist")
          wishlistButton.setAttribute("aria-label", "Add to wishlist")
          wishlistButton.querySelector("svg").setAttribute("fill", "none")
          MessagePopup.show("Removed from wishlist")
        }
      } else {
        // Add to wishlist
        if (WishlistManager.addToWishlist(book.bookID)) {
          wishlistButton.classList.add("in-wishlist")
          wishlistButton.setAttribute("aria-label", "Remove from wishlist")
          wishlistButton.querySelector("svg").setAttribute("fill", "currentColor")
          MessagePopup.show("Added to wishlist")
        }
      }
    })
  }

  return bookElement
}

// Helper function to add to cart
function addToCart(bookID, quantity) {
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    MessagePopup.show("Please login to add items to your cart", true)
    return
  }

  // In a real app, this would call the CartManager.addItem method
  // For now, we'll simulate a successful addition
  setTimeout(() => {
    MessagePopup.show(`Added ${quantity} item(s) to cart!`)
  }, 500)
}
