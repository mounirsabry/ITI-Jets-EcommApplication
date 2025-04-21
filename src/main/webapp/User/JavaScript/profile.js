import checkForErrorMessageParameter from "./Common/checkForError.js"
import "./Common/pageLoader.js" // Import the page loader to ensure header is loaded
import URL_Mapper from "./Utils/URL_Mapper.js"
import UserAuthTracker from "./Common/UserAuthTracker.js"
import MessagePopup from "./Common/MessagePopup.js"

document.addEventListener("DOMContentLoaded", () => {
  checkForErrorMessageParameter()

  // DOM Elements - Profile Header
  const profileName = document.getElementById("profileName")
  const memberSince = document.getElementById("memberSince")

  // DOM Elements - Account Tab
  const displayEmail = document.getElementById("displayEmail")
  const editUserName = document.getElementById("editUserName")
  const editPhone = document.getElementById("editPhone")
  const editAddress = document.getElementById("editAddress")
  const editBirthDate = document.getElementById("editBirthDate")
  const profileChangesError = document.getElementById("profileChangesError")
  const personalInfoForm = document.getElementById("personalInfoForm")
  const editPersonalInfoBtn = document.getElementById("editPersonalInfoBtn")
  const cancelPersonalInfoBtn = document.getElementById("cancelPersonalInfoBtn")
  const personalInfoActions = document.getElementById("personalInfoActions")

  // DOM Elements - Tabs
  const profileTabs = document.querySelectorAll(".profile-tab")
  const profileTabContents = document.querySelectorAll(".profile-tab-content")

  // DOM Elements - Orders Tab
  const recentOrders = document.getElementById("recentOrders")

  // DOM Elements - Wishlist Tab
  const recentWishlist = document.getElementById("recentWishlist")

  // DOM Elements - Popups
  const popupOverlay = document.querySelector(".popup-overlay")
  const emailPopup = document.getElementById("emailPopup")
  const passwordPopup = document.getElementById("passwordPopup")
  const openChangeEmailPopupButton = document.getElementById("openChangeEmailPopupButton")
  const openChangePasswordPopupButton = document.getElementById("openChangePasswordPopupButton")
  const confirmEmailUpdate = document.getElementById("confirmEmailUpdate")
  const cancelEmailUpdate = document.getElementById("cancelEmailUpdate")
  const confirmPasswordChangeButton = document.getElementById("confirmPasswordChangeButton")
  const cancelPasswordChangeButton = document.getElementById("cancelPasswordChangeButton")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  if (!userObject) {
    UserAuthTracker.handleUserInvalidState()
    return
  }

  // Initialize profile page
  function initProfilePage() {
    // Set profile header
    if (profileName) {
      profileName.textContent = userObject.userName || "My Profile"
    }

    if (memberSince) {
      memberSince.textContent = formatDate(userObject.registrationDate) || "..."
    }

    // Set account info
    if (displayEmail) {
      displayEmail.textContent = userObject.email || "No email available"
    }

    if (editUserName) {
      editUserName.value = userObject.userName || ""
    }

    if (editPhone) {
      editPhone.value = userObject.phoneNumber || ""
    }

    if (editAddress) {
      editAddress.value = userObject.address || ""
    }

    if (editBirthDate) {
      editBirthDate.value = formatDateForInput(userObject.birthDate) || ""
    }

    // Hide error messages initially
    if (profileChangesError) {
      profileChangesError.classList.add("hidden")
    }

    // Load recent orders
    loadRecentOrders()

    // Load recent wishlist
    loadRecentWishlist()

    // Set up event listeners
    setupEventListeners()
  }

  // Set up event listeners
  function setupEventListeners() {
    // Tab navigation
    profileTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const tabName = tab.getAttribute("data-tab")
        switchTab(tabName)
      })
    })

    // Personal info form
    if (personalInfoForm) {
      personalInfoForm.addEventListener("submit", handleProfileUpdate)
    }

    if (editPersonalInfoBtn) {
      editPersonalInfoBtn.addEventListener("click", enableProfileEditing)
    }

    if (cancelPersonalInfoBtn) {
      cancelPersonalInfoBtn.addEventListener("click", cancelProfileEditing)
    }

    // Email popup
    if (openChangeEmailPopupButton && emailPopup) {
      openChangeEmailPopupButton.addEventListener("click", () => {
        showPopup(emailPopup)
      })
    }

    if (confirmEmailUpdate) {
      confirmEmailUpdate.addEventListener("click", handleEmailUpdate)
    }

    if (cancelEmailUpdate) {
      cancelEmailUpdate.addEventListener("click", () => {
        hidePopup(emailPopup)
      })
    }

    // Password popup
    if (openChangePasswordPopupButton && passwordPopup) {
      openChangePasswordPopupButton.addEventListener("click", () => {
        showPopup(passwordPopup)
      })
    }

    if (confirmPasswordChangeButton) {
      confirmPasswordChangeButton.addEventListener("click", handlePasswordChange)
    }

    if (cancelPasswordChangeButton) {
      cancelPasswordChangeButton.addEventListener("click", () => {
        hidePopup(passwordPopup)
      })
    }

    // Close popups when clicking outside
    if (popupOverlay) {
      popupOverlay.addEventListener("click", (e) => {
        if (e.target === popupOverlay) {
          hideAllPopups()
        }
      })
    }

    // Close popups with escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        hideAllPopups()
      }
    })
  }

  // Switch tab
  function switchTab(tabName) {
    // Update tab buttons
    profileTabs.forEach((tab) => {
      if (tab.getAttribute("data-tab") === tabName) {
        tab.classList.add("active")
      } else {
        tab.classList.remove("active")
      }
    })

    // Update tab content
    profileTabContents.forEach((content) => {
      if (content.id === `${tabName}Tab`) {
        content.classList.add("active")
      } else {
        content.classList.remove("active")
      }
    })
  }

  // Enable profile editing
  function enableProfileEditing() {
    const inputs = document.querySelectorAll("#personalInfoForm input")
    inputs.forEach((input) => {
      input.disabled = false
    })

    editPersonalInfoBtn.classList.add("hidden")
    personalInfoActions.classList.remove("hidden")
  }

  // Cancel profile editing
  function cancelProfileEditing() {
    // Reset form values
    editUserName.value = userObject.userName || ""
    editPhone.value = userObject.phoneNumber || ""
    editAddress.value = userObject.address || ""
    editBirthDate.value = formatDateForInput(userObject.birthDate) || ""

    // Disable editing
    const inputs = document.querySelectorAll("#personalInfoForm input")
    inputs.forEach((input) => {
      input.disabled = true
    })

    editPersonalInfoBtn.classList.remove("hidden")
    personalInfoActions.classList.add("hidden")
    profileChangesError.classList.add("hidden")
  }

  // Handle profile update
  function handleProfileUpdate(e) {
    e.preventDefault()

    // Validate form
    if (!editUserName.value.trim()) {
      showError(profileChangesError, "Username is required")
      return
    }

    if (!editPhone.value.trim()) {
      showError(profileChangesError, "Phone number is required")
      return
    }

    if (!editAddress.value.trim()) {
      showError(profileChangesError, "Address is required")
      return
    }

    if (!editBirthDate.value) {
      showError(profileChangesError, "Birth date is required")
      return
    }

    // Create updated user object
    const updatedUser = {
      ...userObject,
      userName: editUserName.value.trim(),
      phoneNumber: editPhone.value.trim(),
      address: editAddress.value.trim(),
      birthDate: editBirthDate.value,
    }

    // In a real app, this would call an API to update the user profile
    // For now, we'll simulate a successful update
    setTimeout(() => {
      // Update the user object
      UserAuthTracker.updateUserObject(updatedUser)

      // Update profile name
      if (profileName) {
        profileName.textContent = updatedUser.userName
      }

      // Disable editing
      const inputs = document.querySelectorAll("#personalInfoForm input")
      inputs.forEach((input) => {
        input.disabled = true
      })

      editPersonalInfoBtn.classList.remove("hidden")
      personalInfoActions.classList.add("hidden")
      profileChangesError.classList.add("hidden")

      MessagePopup.show("Profile updated successfully!")
    }, 500)
  }

  // Handle email update
  function handleEmailUpdate() {
    const newEmail = document.getElementById("newEmail")
    const emailChangeError = document.getElementById("emailChangeError")

    if (!newEmail || !newEmail.value.trim()) {
      if (emailChangeError) {
        emailChangeError.textContent = "Email is required"
        emailChangeError.classList.remove("hidden")
      }
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail.value.trim())) {
      if (emailChangeError) {
        emailChangeError.textContent = "Please enter a valid email address"
        emailChangeError.classList.remove("hidden")
      }
      return
    }

    // In a real app, this would call an API to update the email
    // For now, we'll simulate a successful update
    setTimeout(() => {
      // Update the user object
      const updatedUser = {
        ...userObject,
        email: newEmail.value.trim(),
      }
      UserAuthTracker.updateUserObject(updatedUser)

      // Update displayed email
      if (displayEmail) {
        displayEmail.textContent = newEmail.value.trim()
      }

      // Hide popup
      hidePopup(emailPopup)

      // Reset form
      newEmail.value = ""
      if (emailChangeError) {
        emailChangeError.classList.add("hidden")
      }

      MessagePopup.show("Email updated successfully!")
    }, 500)
  }

  // Handle password change
  function handlePasswordChange() {
    const currentPassword = document.getElementById("currentPassword")
    const newPassword = document.getElementById("newPassword")
    const confirmPassword = document.getElementById("confirmPassword")
    const passwordChangeError = document.getElementById("passwordChangeError")

    // Validate form
    if (!currentPassword || !currentPassword.value) {
      if (passwordChangeError) {
        passwordChangeError.textContent = "Current password is required"
        passwordChangeError.classList.remove("hidden")
      }
      return
    }

    if (!newPassword || !newPassword.value) {
      if (passwordChangeError) {
        passwordChangeError.textContent = "New password is required"
        passwordChangeError.classList.remove("hidden")
      }
      return
    }

    if (!confirmPassword || !confirmPassword.value) {
      if (passwordChangeError) {
        passwordChangeError.textContent = "Please confirm your new password"
        passwordChangeError.classList.remove("hidden")
      }
      return
    }

    if (newPassword.value !== confirmPassword.value) {
      if (passwordChangeError) {
        passwordChangeError.textContent = "Passwords do not match"
        passwordChangeError.classList.remove("hidden")
      }
      return
    }

    // In a real app, this would call an API to update the password
    // For now, we'll simulate a successful update
    setTimeout(() => {
      // Hide popup
      hidePopup(passwordPopup)

      // Reset form
      currentPassword.value = ""
      newPassword.value = ""
      confirmPassword.value = ""
      if (passwordChangeError) {
        passwordChangeError.classList.add("hidden")
      }

      MessagePopup.show("Password updated successfully!")
    }, 500)
  }

  // Load recent orders
  function loadRecentOrders() {
    if (!recentOrders) return

    // In a real app, this would fetch from an API
    // For now, we'll use mock data
    const mockOrders = [
      {
        orderId: "ORD-12345",
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        total: 150.75,
        status: "Delivered",
      },
      {
        orderId: "ORD-12346",
        date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
        total: 65.25,
        status: "Processing",
      },
    ]

    // Simulate API call delay
    setTimeout(() => {
      if (mockOrders.length === 0) {
        recentOrders.innerHTML = `
          <div class="empty-state">
            <p>You haven't placed any orders yet.</p>
            <a href="${URL_Mapper.PRODUCTS}" class="primary-button">Browse Books</a>
          </div>
        `
      } else {
        recentOrders.innerHTML = mockOrders
          .map(
            (order) => `
          <div class="order-item">
            <div class="order-info">
              <h3>${order.orderId}</h3>
              <p>${formatDate(order.date)} • ${order.total.toFixed(2)} EGP</p>
            </div>
            <span class="order-status ${order.status.toLowerCase()}">${order.status}</span>
          </div>
        `,
          )
          .join("")
      }
    }, 500)
  }

  // Load recent wishlist
  function loadRecentWishlist() {
    if (!recentWishlist) return

    // Get wishlist IDs from localStorage
    let wishlistIds = []
    try {
      wishlistIds = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []
    } catch (e) {
      console.error("Error parsing wishlist:", e)
    }

    // Mock data for demonstration
    const mockBooks = [
      {
        bookID: 1,
        title: "The Great Gatsby",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
      },
      {
        bookID: 2,
        title: "To Kill a Mockingbird",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
      },
      {
        bookID: 3,
        title: "1984",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
      },
      {
        bookID: 4,
        title: "Pride and Prejudice",
        images: [
          {
            url: "/placeholder.svg?height=300&width=200",
            isMain: true,
          },
        ],
      },
    ]

    // Filter books based on wishlist IDs (limit to 4)
    const wishlistBooks = mockBooks.filter((book) => wishlistIds.includes(book.bookID)).slice(0, 4)

    // Simulate API call delay
    setTimeout(() => {
      if (wishlistBooks.length === 0) {
        recentWishlist.innerHTML = `
          <div class="empty-state" style="grid-column: 1 / -1;">
            <p>Your wishlist is empty.</p>
            <a href="${URL_Mapper.PRODUCTS}" class="primary-button">Browse Books</a>
          </div>
        `
      } else {
        recentWishlist.innerHTML = wishlistBooks
          .map((book) => {
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

            return `
            <div class="wishlist-item-preview">
              <img src="${imageUrl}" alt="${book.title}">
              <div class="item-title">${book.title}</div>
            </div>
          `
          })
          .join("")
      }
    }, 500)
  }

  // Show error message
  function showError(element, message) {
    if (element) {
      element.textContent = message
      element.classList.remove("hidden")
    }
  }

  // Show popup
  function showPopup(popup) {
    if (popup && popupOverlay) {
      popup.classList.remove("hidden")
      popupOverlay.classList.remove("hidden")
    }
  }

  // Hide popup
  function hidePopup(popup) {
    if (popup) {
      popup.classList.add("hidden")

      // Check if all popups are hidden
      const visiblePopups = document.querySelectorAll(".popup:not(.hidden)")
      if (visiblePopups.length === 0 && popupOverlay) {
        popupOverlay.classList.add("hidden")
      }
    }
  }

  // Hide all popups
  function hideAllPopups() {
    const popups = document.querySelectorAll(".popup")
    popups.forEach((popup) => {
      popup.classList.add("hidden")
    })

    if (popupOverlay) {
      popupOverlay.classList.add("hidden")
    }
  }

  // Helper function to format date
  function formatDate(dateString) {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }).format(date)
    } catch (e) {
      console.error("Error formatting date:", e)
      return ""
    }
  }

  // Helper function to format date for input fields
  function formatDateForInput(dateString) {
    if (!dateString) return ""

    try {
      const date = new Date(dateString)
      return date.toISOString().split("T")[0]
    } catch (e) {
      console.error("Error formatting date for input:", e)
      return ""
    }
  }

  // Initialize the page
  initProfilePage()
})
