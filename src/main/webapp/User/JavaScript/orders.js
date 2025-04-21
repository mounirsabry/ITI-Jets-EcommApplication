import checkForErrorMessageParameter from "./Common/checkForError.js"
import URL_Mapper from "./Utils/URL_Mapper.js"
import OrdersManager from "./Managers/OrdersManager.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
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
  const ordersListContainer = document.getElementById("ordersList")
  const backToProfileButton = document.getElementById("backToProfile")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize orders page
  function initOrdersPage() {
    // Show loading state
    ordersListContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading orders"></div>
      </div>
    `

    // Fetch orders
    OrdersManager.getOrdersList(userObject.userID, onOrdersLoaded, onError)

    // Event listeners
    backToProfileButton.addEventListener("click", () => {
      window.location.href = URL_Mapper.PROFILE
    })
  }

  // Handle orders loaded from API
  function onOrdersLoaded(orders) {
    if (!orders || orders.length === 0) {
      displayNoOrders()
      return
    }

    // Clear loading state
    ordersListContainer.innerHTML = ""

    // Create order items
    orders.forEach((order, index) => {
      const orderElement = createOrderElement(order, index)
      ordersListContainer.appendChild(orderElement)
    })
  }

  // Handle API errors
  function onError(error) {
    console.error("Error loading orders:", error)
    ordersListContainer.innerHTML = `
      <div class="error-container">
        <p>Failed to load orders. Please try again later.</p>
      </div>
    `
    MessagePopup.show("Error loading orders: " + error, true)
  }

  // Create order element
  function createOrderElement(order, index) {
    const orderItem = document.createElement("div")
    orderItem.classList.add("order-item")
    orderItem.style.animationDelay = `${index * 0.1}s`
    orderItem.classList.add("fade-in")

    // Format date
    const orderDate = new Date(order.orderDate)
    const formattedDate = orderDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    // Get status badge class
    const statusClass = getStatusBadgeClass(order.status)

    orderItem.innerHTML = `
      <div class="order-details">
        <h2>Order #${order.orderID}</h2>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Status:</strong> <span class="status-badge ${statusClass}">${order.status}</span></p>
        <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)} EGP</p>
        <p><strong>Items:</strong> ${order.numberOfItems} items</p>
      </div>
      
      <button class="view-order-button" data-order-id="${order.orderID}">
        View Details
      </button>
    `

    // Add event listener for view button
    const viewButton = orderItem.querySelector(".view-order-button")
    viewButton.addEventListener("click", () => {
      window.location.href = `${URL_Mapper.ORDER_DETAILS}?orderID=${order.orderID}`
    })

    return orderItem
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

  // Display no orders message
  function displayNoOrders() {
    ordersListContainer.innerHTML = `
      <div class="no-orders">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p>You haven't placed any orders yet</p>
        <a href="${URL_Mapper.PRODUCTS}">Browse Books</a>
      </div>
    `
  }

  // Initialize the page
  initOrdersPage()
})
