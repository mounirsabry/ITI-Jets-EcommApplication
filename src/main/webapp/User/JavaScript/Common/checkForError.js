import MessagePopup from "./MessagePopup.js"

export default function checkForErrorMessageParameter() {
  const urlParams = new URLSearchParams(window.location.search)
  const errorMessage = urlParams.get("errorMessage")

  if (errorMessage) {
    MessagePopup.show(decodeURIComponent(errorMessage), true)

    // Remove the error message from the URL
    const newUrl = window.location.pathname
    window.history.replaceState({}, document.title, newUrl)
  }
}
