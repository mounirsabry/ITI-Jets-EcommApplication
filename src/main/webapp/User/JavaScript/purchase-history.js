import checkForErrorMessageParameter from "./Common/checkForError.js"
import URL_Mapper from "./Utils/URL_Mapper.js"
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
  const historyListContainer = document.getElementById("historyList")
  const backToProfileButton = document.getElementById("backToProfile")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize purchase history page
  function initPurchaseHistoryPage() {
    // Show loading state
    historyListContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading purchase history"></div>
      </div>
    `

    // Mock data for demonstration - in a real app, this would be fetched from an API
    const mockPurchaseHistory = [
      {
        id: "PH12345",
        date: "2023-05-15",
        totalAmount: 125.50,
        items: 3,
        receiptUrl: "#"
      },
      {
        id: "PH12346",
        date: "2023-04-22",
        totalAmount: 78.25,
        items: 2,
        receiptUrl: "#"
      },
      {
        id: "PH12347",
        date: "2023-03-10",
        totalAmount: 210.00,
        items: 5,
        receiptUrl: "#"
      }
    ]

    // Simulate API call delay
    setTimeout(() => {
      onHistoryLoaded(mockPurchaseHistory)
    }, 1000)

    // Event listeners
    backToProfileButton.addEventListener("click", () => {
      window.location.href = URL_Mapper.PROFILE
    })
  }

  // Handle purchase history loaded
  function onHistoryLoaded(historyItems) {
    if (!historyItems || historyItems.length === 0) {
      displayNoHistory()
      return
    }

    // Clear loading state
    historyListContainer.innerHTML = ""

    // Create history items
    historyItems.forEach((item, index) => {
      const historyElement = createHistoryElement(item, index)
      historyListContainer.appendChild(historyElement)
    })
  }

  // Create history element
  function createHistoryElement(historyItem, index) {
    const historyElement = document.createElement("div")
    historyElement.classList.add("history-item")
    historyElement.style.animationDelay = `${index * 0.1}s`
    historyElement.classList.add("fade-in")

    // Format date
    const purchaseDate = new Date(historyItem.date)
    const formattedDate = purchaseDate.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    historyElement.innerHTML = `
      <div class="history-details">
        <h3>Purchase #${historyItem.id}</h3>
        <p><strong>Date:</strong> ${formattedDate}</p>
        <p><strong>Total Amount:</strong> ${historyItem.totalAmount.toFixed(2)} EGP</p>
        <p><strong>Items:</strong> ${historyItem.items} items</p>
      </div>

      <button class="download-button" data-receipt-url="${historyItem.receiptUrl}">
        Download Receipt
      </button>
    `

    // Add event listener for download button
    const downloadButton = historyElement.querySelector(".download-button")
    downloadButton.addEventListener("click", () => {
      // In a real app, this would download the receipt
      MessagePopup.show("Receipt download functionality will be implemented soon.")
    })

    return historyElement
  }

  // Display no history message
  function displayNoHistory() {
    historyListContainer.innerHTML = `
      <div class="no-history">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <p>You don't have any purchase history yet</p>
        <a href="${URL_Mapper.PRODUCTS}">Browse Books</a>
      </div>
    `
  }

  // Initialize the page
  initPurchaseHistoryPage()
})
