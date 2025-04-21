import URL_Mapper from "../Utils/URL_Mapper.js"
import UserAuthTracker from "./UserAuthTracker.js"

document.addEventListener("DOMContentLoaded", () => {
  const headerContainer = document.getElementById("siteHeader")
  if (!headerContainer) {
    console.log("Could not load the header component.")
    return
  }

  // Get user authentication status
  const userObject = UserAuthTracker.userObject

  // Create header HTML
  headerContainer.innerHTML = `
    <div>
      <div class="logo-container">
        <a href="${URL_Mapper.WELCOME}">
          <img src="${URL_Mapper.ASSETS.LOGO}" alt="Book Alley Logo" />
        </a>
        <h1 class="site-title">Book Alley</h1>
      </div>

      <div class="navbar">
        <a href="${URL_Mapper.WELCOME}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          Home
        </a>
        <a href="${URL_Mapper.PRODUCTS}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          Books
        </a>
        <a href="${URL_Mapper.ABOUT}">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="16" x2="12" y2="12"></line>
            <line x1="12" y1="8" x2="12.01" y2="8"></line>
          </svg>
          About
        </a>
        ${
          userObject
            ? `
            <a href="${URL_Mapper.PROFILE}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="user-icon">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </a>
            <a href="${URL_Mapper.WISH_LIST}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
              </svg>
              Wishlist
            </a>
            <a href="${URL_Mapper.CART}">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              Cart
            </a>
            <button id="logoutButton" class="auth-button logout-button">Logout</button>
            `
            : `
            <button id="loginButton" class="auth-button login-button">Login</button>
            <button id="registerButton" class="auth-button register-button">Register</button>
            `
        }
      </div>
    </div>
  `

  // Check if popups already exist to avoid duplicates
  let loginPopupOverlay = document.getElementById("loginPopupOverlay")
  let registerPopupOverlay = document.getElementById("registerPopupOverlay")

  // Create login popup if it doesn't exist
  if (!loginPopupOverlay) {
    loginPopupOverlay = document.createElement("div")
    loginPopupOverlay.id = "loginPopupOverlay"
    loginPopupOverlay.className = "header-popup-overlay hidden"
    loginPopupOverlay.innerHTML = `
      <div id="loginPopup" class="header-popup">
        <button class="header-close-popup" id="closeLoginPopup">&times;</button>
        <div class="header-popup-content">
          <h3>Login</h3>
          <form id="loginForm">
            <input type="email" id="loginEmail" placeholder="Email" required />
            <input type="password" id="loginPassword" placeholder="Password" required />
            <div class="header-popup-buttons">
              <button type="submit">Login</button>
              <button type="button" id="switchToRegister">Register</button>
            </div>
          </form>
        </div>
      </div>
    `
    document.body.appendChild(loginPopupOverlay)
  }

  // Create register popup if it doesn't exist
  if (!registerPopupOverlay) {
    registerPopupOverlay = document.createElement("div")
    registerPopupOverlay.id = "registerPopupOverlay"
    registerPopupOverlay.className = "header-popup-overlay hidden"
    registerPopupOverlay.innerHTML = `
      <div id="registerPopup" class="header-popup">
        <button class="header-close-popup" id="closeRegisterPopup">&times;</button>
        <div class="header-popup-content">
          <h3>Register</h3>
          <form id="registerForm">
            <input type="email" id="registerEmail" placeholder="Email" required />
            <input type="password" id="registerPassword" placeholder="Password" required />
            <input type="password" id="confirmPassword" placeholder="Confirm Password" required />
            <input type="text" id="userName" placeholder="User Name" required />
            <input type="tel" id="phoneNumber" placeholder="Phone Number" required />
            <input type="text" id="address" placeholder="Address" required />
            <input type="date" id="birthDate" required />
            <div class="header-popup-buttons">
              <button type="submit">Register</button>
              <button type="button" id="switchToLogin">Login</button>
            </div>
          </form>
        </div>
      </div>
    `
    document.body.appendChild(registerPopupOverlay)
  }

  // Handle login button click
  const loginButton = document.getElementById("loginButton")
  if (loginButton) {
    loginButton.addEventListener("click", (e) => {
      e.preventDefault()
      const loginPopupOverlay = document.getElementById("loginPopupOverlay")
      if (loginPopupOverlay) {
        loginPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Handle register button click
  const registerButton = document.getElementById("registerButton")
  if (registerButton) {
    registerButton.addEventListener("click", (e) => {
      e.preventDefault()
      const registerPopupOverlay = document.getElementById("registerPopupOverlay")
      if (registerPopupOverlay) {
        registerPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Handle close buttons
  const closeButtons = document.querySelectorAll(".header-close-popup")
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const popup = button.closest(".header-popup-overlay")
      if (popup) {
        popup.classList.add("hidden")
      }
    })
  })

  // Handle switch to register
  const switchToRegister = document.getElementById("switchToRegister")
  if (switchToRegister) {
    switchToRegister.addEventListener("click", () => {
      const loginPopupOverlay = document.getElementById("loginPopupOverlay")
      const registerPopupOverlay = document.getElementById("registerPopupOverlay")

      if (loginPopupOverlay && registerPopupOverlay) {
        loginPopupOverlay.classList.add("hidden")
        registerPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Handle switch to login
  const switchToLogin = document.getElementById("switchToLogin")
  if (switchToLogin) {
    switchToLogin.addEventListener("click", () => {
      const loginPopupOverlay = document.getElementById("loginPopupOverlay")
      const registerPopupOverlay = document.getElementById("registerPopupOverlay")

      if (loginPopupOverlay && registerPopupOverlay) {
        registerPopupOverlay.classList.add("hidden")
        loginPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Close popups when clicking outside
  const popupOverlays = document.querySelectorAll(".header-popup-overlay")
  popupOverlays.forEach((overlay) => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.classList.add("hidden")
      }
    })
  })

  // Handle login form submission
  const loginForm = document.getElementById("loginForm")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("loginEmail").value
      const password = document.getElementById("loginPassword").value

      // Call login function from UserAuthTracker
      UserAuthTracker.login(email, password)
    })
  }

  // Handle register form submission
  const registerForm = document.getElementById("registerForm")
  if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("registerEmail").value
      const password = document.getElementById("registerPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value
      const userName = document.getElementById("userName").value
      const phoneNumber = document.getElementById("phoneNumber").value
      const address = document.getElementById("address").value
      const birthDate = document.getElementById("birthDate").value

      // Validate passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match")
        return
      }

      // Call register function from UserAuthTracker
      UserAuthTracker.register(email, password, userName, phoneNumber, address, birthDate)
    })
  }

  // Handle logout
  const logoutButton = document.getElementById("logoutButton")
  if (logoutButton) {
    logoutButton.addEventListener("click", () => {
      UserAuthTracker.logout()
    })
  }

  // Close popups with escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const visiblePopups = document.querySelectorAll(".header-popup-overlay:not(.hidden)")
      visiblePopups.forEach((popup) => {
        popup.classList.add("hidden")
      })
    }
  })
})
