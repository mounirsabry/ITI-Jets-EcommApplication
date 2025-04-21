class MessagePopup {
  static show(message, isError = false) {
    // Check if a popup already exists and remove it
    const existingPopup = document.querySelector(".popup-message-container")
    if (existingPopup) {
      existingPopup.remove()
    }

    // Create popup elements
    const popupContainer = document.createElement("div")
    popupContainer.className = `popup-message-container ${isError ? "popup-message-error" : "popup-message-info"}`

    const messageText = document.createElement("p")
    messageText.className = "popup-message-text"
    messageText.textContent = message

    const closeButton = document.createElement("button")
    closeButton.className = "popup-close-button"
    closeButton.innerHTML = "&times;"
    closeButton.setAttribute("aria-label", "Close message")

    // Add elements to container
    popupContainer.appendChild(messageText)
    popupContainer.appendChild(closeButton)

    // Add container to body
    document.body.appendChild(popupContainer)

    // Show popup with animation
    setTimeout(() => {
      popupContainer.classList.add("show")
    }, 10)

    // Close button event listener
    closeButton.addEventListener("click", () => {
      popupContainer.classList.remove("show")
      setTimeout(() => {
        popupContainer.remove()
      }, 300)
    })

    // Auto-close after 5 seconds
    setTimeout(() => {
      if (document.body.contains(popupContainer)) {
        popupContainer.classList.remove("show")
        setTimeout(() => {
          if (document.body.contains(popupContainer)) {
            popupContainer.remove()
          }
        }, 300)
      }
    }, 5000)
  }
}

export default MessagePopup
