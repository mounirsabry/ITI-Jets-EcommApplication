document.addEventListener("DOMContentLoaded", () => {
  // Ensure all popups are hidden by default
  const popups = document.querySelectorAll(".header-popup-overlay, .header-popup")
  popups.forEach((popup) => {
    popup.classList.add("hidden")
  })

  // Setup login button
  const loginButton = document.getElementById("loginButton")
  if (loginButton) {
    loginButton.addEventListener("click", () => {
      const loginPopupOverlay = document.getElementById("loginPopupOverlay")
      if (loginPopupOverlay) {
        loginPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Setup register button
  const registerButton = document.getElementById("registerButton")
  if (registerButton) {
    registerButton.addEventListener("click", () => {
      const registerPopupOverlay = document.getElementById("registerPopupOverlay")
      if (registerPopupOverlay) {
        registerPopupOverlay.classList.remove("hidden")
      }
    })
  }

  // Setup close buttons
  const closeButtons = document.querySelectorAll(".header-close-popup")
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const popup = button.closest(".header-popup-overlay")
      if (popup) {
        popup.classList.add("hidden")
      }
    })
  })

  // Setup switch to register
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

  // Setup switch to login
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
