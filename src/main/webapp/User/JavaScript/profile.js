import checkForErrorMessageParameter from "./Common/checkForError.js"
import "./Common/pageLoader.js" // Import the page loader to ensure header is loaded
import URL_Mapper from "./Utils/URL_Mapper.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
import MessagePopup from "./Common/MessagePopup.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // DOM Elements
  const profileContainer = document.getElementById("profileContainer")
  const orderHistoryContainer = document.getElementById("orderHistory")
  const editProfileButton = document.getElementById("editProfileButton")
  const saveProfileButton = document.getElementById("saveProfileButton")
  const cancelEditButton = document.getElementById("cancelEditButton")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize profile page
  function initProfilePage() {
    // Show loading state
    profileContainer.innerHTML = `
      <div class="loading-container">
        <div class="loading-spinner" aria-label="Loading profile"></div>
      </div>
    `

    // Simulate API call delay
    setTimeout(() => {
      displayUserProfile(userObject)
    }, 500)
  }

  // Display user profile
  function displayUserProfile(user) {
    profileContainer.innerHTML = `
      <div class="profile-card">
        <div class="profile-header">
          <div class="profile-avatar">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <h2>${user.userName}</h2>
          <p class="member-since">Member since ${formatDate(user.registrationDate)}</p>
        </div>

        <div class="profile-details">
          <form id="profileForm">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" value="${user.email}" disabled>
            </div>

            <div class="form-group">
              <label for="userName">Username</label>
              <input type="text" id="userName" value="${user.userName}" disabled>
            </div>

            <div class="form-group">
              <label for="phoneNumber">Phone Number</label>
              <input type="tel" id="phoneNumber" value="${user.phoneNumber}" disabled>
            </div>

            <div class="form-group">
              <label for="address">Address</label>
              <textarea id="address" disabled>${user.address}</textarea>
            </div>

            <div class="form-group">
              <label for="birthDate">Birth Date</label>
              <input type="date" id="birthDate" value="${formatDateForInput(user.birthDate)}" disabled>
            </div>
          </form>
        </div>

        <div class="profile-actions">
          <button id="editProfileButton" class="edit-profile-button">Edit Profile</button>
          <button id="saveProfileButton" class="save-profile-button hidden">Save Changes</button>
          <button id="cancelEditButton" class="cancel-edit-button hidden">Cancel</button>
        </div>
      </div>

      <div class="profile-links">
        <a href="${URL_Mapper.WISH_LIST}" class="profile-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          My Wishlist
        </a>
        <a href="${URL_Mapper.CART}" class="profile-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="9" cy="21" r="1"></circle>
            <circle cx="20" cy="21" r="1"></circle>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
          </svg>
          My Cart
        </a>
      </div>
    `

    // Re-attach event listeners
    const editProfileButton = document.getElementById("editProfileButton")
    const saveProfileButton = document.getElementById("saveProfileButton")
    const cancelEditButton = document.getElementById("cancelEditButton")

    if (editProfileButton) {
      editProfileButton.addEventListener("click", enableProfileEditing)
    }

    if (saveProfileButton) {
      saveProfileButton.addEventListener("click", saveProfileChanges)
    }

    if (cancelEditButton) {
      cancelEditButton.addEventListener("click", cancelProfileEditing)
    }

    // Display order history
    displayOrderHistory()
  }

  // Enable profile editing
  function enableProfileEditing() {
    const inputs = document.querySelectorAll("#profileForm input, #profileForm textarea")
    inputs.forEach((input) => {
      if (input.id !== "email") {
        input.disabled = false
      }
    })

    document.getElementById("editProfileButton").classList.add("hidden")
    document.getElementById("saveProfileButton").classList.remove("hidden")
    document.getElementById("cancelEditButton").classList.remove("hidden")
  }

  // Save profile changes
  function saveProfileChanges() {
    const updatedUser = {
      ...userObject,
      userName: document.getElementById("userName").value,
      phoneNumber: document.getElementById("phoneNumber").value,
      address: document.getElementById("address").value,
      birthDate: document.getElementById("birthDate").value,
    }

    // In a real app, this would call an API to update the user profile
    // For now, we'll simulate a successful update
    setTimeout(() => {
      // Update the user object
      UserAuthTracker.updateUserObject(updatedUser)

      // Disable editing
      const inputs = document.querySelectorAll("#profileForm input, #profileForm textarea")
      inputs.forEach((input) => {
        input.disabled = true
      })

      document.getElementById("editProfileButton").classList.remove("hidden")
      document.getElementById("saveProfileButton").classList.add("hidden")
      document.getElementById("cancelEditButton").classList.add("hidden")

      MessagePopup.show("Profile updated successfully!")
    }, 500)
  }

  // Cancel profile editing
  function cancelProfileEditing() {
    // Reset form values
    document.getElementById("userName").value = userObject.userName
    document.getElementById("phoneNumber").value = userObject.phoneNumber
    document.getElementById("address").value = userObject.address
    document.getElementById("birthDate").value = formatDateForInput(userObject.birthDate)

    // Disable editing
    const inputs = document.querySelectorAll("#profileForm input, #profileForm textarea")
    inputs.forEach((input) => {
      input.disabled = true
    })

    document.getElementById("editProfileButton").classList.remove("hidden")
    document.getElementById("saveProfileButton").classList.add("hidden")
    document.getElementById("cancelEditButton").classList.add("hidden")
  }

  // Display order history
  function displayOrderHistory() {
    // In a real app, this would fetch order history from an API
    // For now, we'll use mock data
    const mockOrders = [
      {
        orderId: "ORD-12345",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        total: 150.75,
        status: "Delivered",
        items: [
          { title: "The Great Gatsby", quantity: 1, price: 75.0 },
          { title: "To Kill a Mockingbird", quantity: 1, price: 75.75 },
        ],
      },
      {
        orderId: "ORD-12346",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        total: 65.25,
        status: "Delivered",
        items: [{ title: "1984", quantity: 1, price: 65.25 }],
      },
    ]

    if (orderHistoryContainer) {
      if (mockOrders.length === 0) {
        orderHistoryContainer.innerHTML = `
          <div class="empty-orders">
            <p>You haven't placed any orders yet.</p>
            <a href="${URL_Mapper.PRODUCTS}" class="browse-books-link">Browse Books</a>
          </div>
        `
      } else {
        orderHistoryContainer.innerHTML = `
          <h2>Order History</h2>
          <div class="orders-list">
            ${mockOrders
              .map(
                (order, index) => `
              <div class="order-card" style="animation-delay: ${index * 0.1}s">
                <div class="order-header">
                  <div>
                    <h3>Order #${order.orderId}</h3>
                    <p class="order-date">${formatDate(order.date)}</p>
                  </div>
                  <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
                </div>

                <div class="order-items">
                  ${order.items
                    .map(
                      (item) => `
                    <div class="order-item">
                      <span class="item-title">${item.title}</span>
                      <span class="item-quantity">x${item.quantity}</span>
                      <span class="item-price">${item.price.toFixed(2)} EGP</span>
                    </div>
                  `,
                    )
                    .join("")}
                </div>

                <div class="order-footer">
                  <span class="order-total">Total: ${order.total.toFixed(2)} EGP</span>
                  <button class="view-order-details">View Details</button>
                </div>
              </div>
            `,
              )
              .join("")}
          </div>
        `

        // Add event listeners to view details buttons
        const viewDetailsButtons = document.querySelectorAll(".view-order-details")
        viewDetailsButtons.forEach((button, index) => {
          button.addEventListener("click", () => {
            // In a real app, this would navigate to an order details page
            alert(`View details for order ${mockOrders[index].orderId}`)
          })
        })
      }
    }
  }

  // Helper function to format date
  function formatDate(date) {
    if (typeof date === "string") {
      date = new Date(date)
    }
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  // Helper function to format date for input fields
  function formatDateForInput(dateString) {
    const date = new Date(dateString)
    return date.toISOString().split("T")[0]
  }

  // Initialize the page
  initProfilePage()
})
