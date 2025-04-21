// JavaScript/Common/BookPopup.js

// This file contains the JavaScript logic for the book popup functionality.
// It handles quantity adjustments and other interactive elements within the popup.

import URL_Mapper from "../Utils/URL_Mapper.js"
import UserAuthTracker from "./UserAuthTracker.js"
import CartManager from "../Managers/CartManager.js"
import MessagePopup from "./MessagePopup.js"

function displayProduct(book, updateCallback = null) {
  console.log("Displaying book popup for:", book.title)

  // Create popup elements
  const popupOverlay = document.createElement("div")
  popupOverlay.className = "popup-overlay"

  const popupModal = document.createElement("div")
  popupModal.className = "popup-modal"

  // Get main image
  const imagesArray = book.images || []
  const mainImage = imagesArray.find((image) => image.isMain)
  const imageUrl = mainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE

  // Calculate discounted price if applicable
  const hasDiscount = book.discountedPercentage > 0
  const originalPrice = book.price
  const discountedPrice = hasDiscount ? originalPrice * (1 - book.discountedPercentage / 100) : originalPrice

  // Create price display HTML
  const priceHTML = hasDiscount
    ? `<p><strong>Price:</strong> <span style="text-decoration: line-through; color: var(--text-light);">${originalPrice.toFixed(2)} EGP</span> <span style="color: var(--primary); font-weight: 700;">${discountedPrice.toFixed(2)} EGP</span> <span style="background-color: var(--secondary); color: white; padding: 0.25rem 0.5rem; border-radius: var(--radius); font-size: 0.75rem; font-weight: 700;">-${book.discountedPercentage}%</span></p>`
    : `<p><strong>Price:</strong> ${book.price.toFixed(2)} EGP</p>`

  // Create popup content
  popupModal.innerHTML = `
    <button class="close-popup" aria-label="Close popup">&times;</button>

    <div class="image-container">
      <img src="${imageUrl}" alt="${book.title}" class="popup-image">
    </div>

    <h2>${book.title}</h2>
    <p class="overview">${book.overview || "No overview available"}</p>
    <p><strong>Author:</strong> ${book.author || "Unknown author"}</p>
    <p><strong>Genre:</strong> ${book.genre || "Uncategorized"}</p>
    ${priceHTML}

    <div class="stock-status">
      In Stock
    </div>

    <div class="cart-controls">
      <div class="quantity-controls">
        <button class="quantity-button decrease-quantity" ${!book.isAvailable || book.stock <= 0 ? "disabled" : ""}>-</button>
        <input type="number" min="1" max="${book.stock}" value="1" class="quantity-input">
        <button class="quantity-button increase-quantity" ${!book.isAvailable || book.stock <= 0 ? "disabled" : ""}>+</button>
      </div>
      <button class="add-to-cart" ${!book.isAvailable || book.stock <= 0 ? "disabled" : ""}>
        Add to Cart
      </button>
    </div>

    <div class="description">
      <h3>Description</h3>
      <p>${book.description || "No detailed description available"}</p>
    </div>
  `

  // Append popup to body
  popupOverlay.appendChild(popupModal)
  document.body.appendChild(popupOverlay)

  // Add event listeners
  const closeButton = popupModal.querySelector(".close-popup")
  closeButton.addEventListener("click", () => {
    popupOverlay.remove()
  })

  // Close popup when clicking outside
  popupOverlay.addEventListener("click", (e) => {
    if (e.target === popupOverlay) {
      popupOverlay.remove()
    }
  })

  // Quantity controls
  const decreaseBtn = popupModal.querySelector(".decrease-quantity")
  const increaseBtn = popupModal.querySelector(".increase-quantity")
  const quantityInput = popupModal.querySelector(".quantity-input")

  if (decreaseBtn && increaseBtn && quantityInput) {
    decreaseBtn.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      const currentValue = Number.parseInt(quantityInput.value) || 1
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
      }
    })

    increaseBtn.addEventListener("click", (e) => {
      e.preventDefault() // Prevent form submission
      const currentValue = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.max) || 99
      if (currentValue < maxValue) {
        quantityInput.value = currentValue + 1
      }
    })

    // Ensure valid input when manually typing
    quantityInput.addEventListener("change", () => {
      let value = Number.parseInt(quantityInput.value) || 1
      const maxValue = Number.parseInt(quantityInput.max) || 99

      if (value < 1) value = 1
      if (value > maxValue) value = maxValue

      quantityInput.value = value
    })
  }

  // Add to cart button
  const addToCartBtn = popupModal.querySelector(".add-to-cart")
  if (addToCartBtn && book.isAvailable && book.stock > 0) {
    addToCartBtn.addEventListener("click", () => {
      const quantity = Number.parseInt(quantityInput.value) || 1
      addToCart(book.bookID, quantity)
    })
  }

  // Helper function to add to cart
  function addToCart(bookID, quantity) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      MessagePopup.show("Please login to add items to your cart", true)
      return
    }

    CartManager.addItem(
      userObject.userID,
      bookID,
      quantity,
      () => {
        MessagePopup.show("Item added to cart!")

        // Close popup after adding to cart
        popupOverlay.remove()

        // Call update callback if provided
        if (updateCallback) {
          updateCallback(book)
        }
      },
      (error) => {
        MessagePopup.show("Failed to add item to cart: " + error, true)
      },
    )
  }

  // Close popup with escape key
  const escKeyHandler = (e) => {
    if (e.key === "Escape") {
      popupOverlay.remove()
      document.removeEventListener("keydown", escKeyHandler)
    }
  }

  document.addEventListener("keydown", escKeyHandler)
}

export default displayProduct
