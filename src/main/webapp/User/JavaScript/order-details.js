import checkForErrorMessageParameter from "./Common/checkForError.js"
import URL_Mapper from "./Utils/URL_Mapper.js"
import displayProduct from "./Common/BookPopup.js"
import OrdersManager from "./Managers/OrdersManager.js"
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
  const orderTitle = document.getElementById("orderTitle")
  const orderDetailsContainer = document.getElementById("orderDetails")
  const orderItemsContainer = document.getElementById("orderItems")
  const subtotalElement = document.getElementById("subtotal")
  const shippingFeeElement = document.getElementById("shippingFee")
  const totalAmountElement = document.getElementById("totalAmount")
  const backToOrdersButton = document.getElementById("backToOrdersButton")

  // Get order ID from URL
  const urlParams = new URLSearchParams(window.location.search)
  const orderID = urlParams.get("orderID")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Check if order ID is provided
  if (!orderID) {
    MessagePopup.show("Order ID is missing", true)
    window.location.href = URL_Mapper.ORDERS
    return
  }

  // Initialize order details page
  function initOrderDetailsPage() {
    // Show loading state
    orderDetailsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading order details"></div>
      </div>
    `
    orderItemsContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading order items"></div>
      </div>
    `

    // Fetch order details
    OrdersManager.getOrderDetails(userObject.userID, orderID, onOrderDetailsLoaded, onError)

    // Event listeners
    backToOrdersButton.addEventListener("click", () => {
      window.location.href = URL_Mapper.ORDERS
    })
  }

  // Handle order details loaded from API
  function onOrderDetailsLoaded(orderDetails) {
    if (!orderDetails) {
      MessagePopup.show("Order not found", true)
      window.location.href = URL_Mapper.ORDERS
      return
    }

    // Update order title
    orderTitle.textContent = `Order #${orderDetails.orderID}`

    // Display order details
    displayOrderDetails(orderDetails)

    // Display order items
    displayOrderItems(orderDetails.items)

    // Update order summary
    updateOrderSummary(orderDetails)
  }

  // Handle API errors
  function onError(error) {
    console.error("Error loading order details:", error)
    orderDetailsContainer.innerHTML = `
      <div class="error-container">
        <p>Failed to load order details. Please try again later.</p>
      </div>
    `
    orderItemsContainer.innerHTML = ""
    MessagePopup.show("Error loading order details: " + error, true)
  }

  // Display order details
  function displayOrderDetails(orderDetails) {
    // Format date
    const orderDate = new Date(orderDetails.orderDate)
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Get status badge class
    const statusClass = getStatusBadgeClass(orderDetails.status)

    orderDetailsContainer.innerHTML = `
      <div class="order-detail-group">
        <h3>Order Date</h3>
        <p>${formattedDate}</p>
      </div>
      
      <div class="order-detail-group">
        <h3>Status</h3>
        <p class="order-status">
          <span class="status-badge ${statusClass}">${orderDetails.status}</span>
        </p>
      </div>
      
      <div class="order-detail-group">
        <h3>Shipping Address</h3>
        <p>${orderDetails.shippingAddress || "Not available"}</p>
      </div>
      
      <div class="order-detail-group">
        <h3>Payment Method</h3>
        <p>${orderDetails.paymentMethod || "Not available"}</p>
      </div>
    `
  }

  // Display order items
  function displayOrderItems(items) {
    if (!items || items.length === 0) {
      orderItemsContainer.innerHTML = `
        <p>No items in this order</p>
      `
      return
    }

    // Clear loading state
    orderItemsContainer.innerHTML = ""

    // Create order items
    items.forEach((item, index) => {
      try {
        const book = Book.fromJSON(item.book)
        const quantity = item.quantity
        const itemTotal = book.price * quantity

        const orderItemElement = createOrderItemElement(book, quantity, itemTotal, index)
        orderItemsContainer.appendChild(orderItemElement)
      } catch (e) {
        console.error("Could not parse book:", e)
      }
    })
  }

  // Create order item element
  function createOrderItemElement(book, quantity, itemTotal, index) {
    const orderItem = document.createElement("div")
    orderItem.classList.add("order-item")
    orderItem.style.animationDelay = `${index * 0.1}s`
    orderItem.classList.add("fade-in")

    // Get main image
    const imagesArray = book.images
    const mainImage = imagesArray.find((image) => image.isMain)
    const imageUrl = mainImage?.url || URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE

    orderItem.innerHTML = `
      <img src="${imageUrl}" alt="${book.title}" class="book-image" data-book-id="${book.bookID}">
      
      <div class="book-details">
        <h2>${book.title}</h2>
        <p class="overview">${book.overview || "No overview available"}</p>
        <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
        <p><strong>Price:</strong> ${book.price} EGP</p>
        <p><strong>Quantity:</strong> ${quantity}</p>
      </div>
      
      <div class="price-section">
        <p><strong>Item Total</strong></p>
        <p class="item-total">${itemTotal.toFixed(2)} EGP</p>
      </div>
    `

    // Add event listener for book image
    const bookImage = orderItem.querySelector(".book-image")
    bookImage.addEventListener("click", () => {
      displayProduct(book)
    })

    return orderItem
  }

  // Update order summary
  function updateOrderSummary(orderDetails) {
    subtotalElement.textContent = orderDetails.subtotal.toFixed(2)
    shippingFeeElement.textContent = orderDetails.shippingFee.toFixed(2)
    totalAmountElement.textContent = orderDetails.totalAmount.toFixed(2)
  }

  // Get status badge class based on order status
  function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
      case "pending":
        return "status-pending"
      case "processing":
        return "status-processing"
      case "shipped":
        return "status-shipped"
      case "delivered":
        return "status-delivered"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  // Initialize the page
  initOrderDetailsPage()
})
