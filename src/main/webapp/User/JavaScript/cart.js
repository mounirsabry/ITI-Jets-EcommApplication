import checkForErrorMessageParameter from "./Common/checkForError.js"
import "./Common/pageLoader.js" // Import the page loader to ensure header is loaded
import URL_Mapper from "./Utils/URL_Mapper.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
import MessagePopup from "./Common/MessagePopup.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // DOM Elements
  const cartItemsContainer = document.getElementById("cartItems")
  const cartSummaryContainer = document.getElementById("cartSummary")
  const checkoutButton = document.getElementById("checkoutButton")
  const emptyCartMessage = document.getElementById("emptyCartMessage")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize cart page
  function initCartPage() {
    // Show loading state
    cartItemsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading cart"></div>
      </div>
    `

    // In a real app, this would fetch from CartManager
    // For now, we'll use mock data
    const mockCartItems = [
      {
        bookID: 1,
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 75.0,
        quantity: 1,
        image: "/placeholder.svg?height=300&width=200",
        stock: 10,
      },
      {
        bookID: 2,
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 85.5,
        quantity: 2,
        image: "/placeholder.svg?height=300&width=200",
        stock: 5,
      },
    ]

    // Simulate API call delay
    setTimeout(() => {
      if (mockCartItems.length === 0) {
        displayEmptyCart()
      } else {
        displayCartItems(mockCartItems)
        updateCartSummary(mockCartItems)
      }
    }, 500)
  }

  // Display cart items
  function displayCartItems(cartItems) {
    cartItemsContainer.innerHTML = ""
    emptyCartMessage.classList.add("hidden")

    cartItems.forEach((item, index) => {
      const cartItemElement = document.createElement("div")
      cartItemElement.classList.add("cart-item")
      cartItemElement.style.animationDelay = `${index * 0.1}s`

      cartItemElement.innerHTML = `
        <div class="cart-item-image">
          <img src="${item.image}" alt="${item.title}">
        </div>

        <div class="cart-item-details">
          <h3>${item.title}</h3>
          <p class="cart-item-author">By ${item.author}</p>
          <p class="cart-item-price">${item.price.toFixed(2)} EGP</p>

          <div class="cart-item-quantity">
            <button class="quantity-button decrease-quantity" data-book-id="${item.bookID}">-</button>
            <input type="number" min="1" max="${item.stock}" value="${item.quantity}" class="quantity-input" data-book-id="${item.bookID}">
            <button class="quantity-button increase-quantity" data-book-id="${item.bookID}">+</button>
          </div>
        </div>

        <div class="cart-item-actions">
          <span class="cart-item-subtotal">${(item.price * item.quantity).toFixed(2)} EGP</span>
          <button class="remove-item" data-book-id="${item.bookID}">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      `

      cartItemsContainer.appendChild(cartItemElement)
    })

    // Add event listeners
    const decreaseButtons = document.querySelectorAll(".decrease-quantity")
    const increaseButtons = document.querySelectorAll(".increase-quantity")
    const quantityInputs = document.querySelectorAll(".quantity-input")
    const removeButtons = document.querySelectorAll(".remove-item")

    decreaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId
        const input = document.querySelector(`.quantity-input[data-book-id="${bookID}"]`)
        const currentValue = Number.parseInt(input.value)
        if (currentValue > 1) {
          input.value = currentValue - 1
          updateCartItemQuantity(bookID, currentValue - 1)
        }
      })
    })

    increaseButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId
        const input = document.querySelector(`.quantity-input[data-book-id="${bookID}"]`)
        const currentValue = Number.parseInt(input.value)
        const maxValue = Number.parseInt(input.max)
        if (currentValue < maxValue) {
          input.value = currentValue + 1
          updateCartItemQuantity(bookID, currentValue + 1)
        }
      })
    })

    quantityInputs.forEach((input) => {
      input.addEventListener("change", () => {
        const bookID = input.dataset.bookId
        let value = Number.parseInt(input.value)
        const maxValue = Number.parseInt(input.max)

        if (value < 1) value = 1
        if (value > maxValue) value = maxValue

        input.value = value
        updateCartItemQuantity(bookID, value)
      })
    })

    removeButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const bookID = button.dataset.bookId
        removeCartItem(bookID)
      })
    })
  }

  // Update cart summary
  function updateCartSummary(cartItems) {
    const subtotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)
    const shipping = subtotal > 0 ? 15 : 0
    const total = subtotal + shipping

    cartSummaryContainer.innerHTML = `
      <h2>Order Summary</h2>

      <div class="summary-row">
        <span>Subtotal</span>
        <span>${subtotal.toFixed(2)} EGP</span>
      </div>

      <div class="summary-row">
        <span>Shipping</span>
        <span>${shipping.toFixed(2)} EGP</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>${total.toFixed(2)} EGP</span>
      </div>

      <button id="checkoutButton" class="checkout-button">
        Proceed to Checkout
      </button>

      <a href="${URL_Mapper.PRODUCTS}" class="continue-shopping">
        Continue Shopping
      </a>
    `

    // Add event listener to checkout button
    document.getElementById("checkoutButton").addEventListener("click", () => {
      // In a real app, this would navigate to checkout page
      alert("Proceeding to checkout...")
    })
  }

  // Display empty cart message
  function displayEmptyCart() {
    cartItemsContainer.innerHTML = ""
    emptyCartMessage.classList.remove("hidden")
    cartSummaryContainer.innerHTML = `
      <h2>Order Summary</h2>

      <div class="summary-row">
        <span>Subtotal</span>
        <span>0.00 EGP</span>
      </div>

      <div class="summary-row">
        <span>Shipping</span>
        <span>0.00 EGP</span>
      </div>

      <div class="summary-row total">
        <span>Total</span>
        <span>0.00 EGP</span>
      </div>

      <a href="${URL_Mapper.PRODUCTS}" class="continue-shopping">
        Browse Books
      </a>
    `
  }

  // Update cart item quantity
  function updateCartItemQuantity(bookID, quantity) {
    // In a real app, this would call CartManager.updateItemQuantity
    // For now, we'll simulate a successful update
    setTimeout(() => {
      // Update subtotal display
      const cartItems = document.querySelectorAll(".cart-item")
      const updatedItems = []

      cartItems.forEach((item) => {
        const itemBookID = item.querySelector(".quantity-input").dataset.bookId
        const itemQuantity = Number.parseInt(item.querySelector(".quantity-input").value)
        const itemPrice = Number.parseFloat(item.querySelector(".cart-item-price").textContent)
        const subtotalElement = item.querySelector(".cart-item-subtotal")

        if (itemBookID === bookID) {
          subtotalElement.textContent = `${(itemPrice * quantity).toFixed(2)} EGP`
        }

        updatedItems.push({
          bookID: itemBookID,
          price: itemPrice,
          quantity: itemBookID === bookID ? quantity : itemQuantity,
        })
      })

      // Update cart summary
      updateCartSummary(updatedItems)
    }, 100)
  }

  // Remove cart item
  function removeCartItem(bookID) {
    // In a real app, this would call CartManager.removeItem
    // For now, we'll simulate a successful removal
    const itemToRemove = document
      .querySelector(`.cart-item .quantity-input[data-book-id="${bookID}"]`)
      .closest(".cart-item")

    // Add removal animation
    itemToRemove.classList.add("removing")

    setTimeout(() => {
      itemToRemove.remove()

      // Check if cart is empty
      const remainingItems = document.querySelectorAll(".cart-item")
      if (remainingItems.length === 0) {
        displayEmptyCart()
      } else {
        // Update cart summary
        const updatedItems = []
        remainingItems.forEach((item) => {
          const itemBookID = item.querySelector(".quantity-input").dataset.bookId
          const itemQuantity = Number.parseInt(item.querySelector(".quantity-input").value)
          const itemPrice = Number.parseFloat(item.querySelector(".cart-item-price").textContent)

          updatedItems.push({
            bookID: itemBookID,
            price: itemPrice,
            quantity: itemQuantity,
          })
        })

        updateCartSummary(updatedItems)
      }

      MessagePopup.show("Item removed from cart")
    }, 300)
  }

  // Initialize the page
  initCartPage()
})
