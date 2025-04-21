import "./header.js"
import UserAuthTracker from "./UserAuthTracker.js"

// This file ensures that common components like the header are loaded on all pages
document.addEventListener("DOMContentLoaded", () => {
  console.log("Page loader initialized")

  // Check if user is authenticated
  const userObject = UserAuthTracker.userObject
  console.log("User authentication status:", userObject ? "Logged in" : "Not logged in")

  // Add a header container if it doesn't exist
  if (!document.getElementById("siteHeader")) {
    const headerContainer = document.createElement("header")
    headerContainer.id = "siteHeader"
    document.body.insertBefore(headerContainer, document.body.firstChild)
    console.log("Header container added to page")
  }
})
