import URL_Mapper from "../Utils/URL_Mapper.js"
import MessagePopup from "./MessagePopup.js"

class UserAuthTracker {
  static get userObject() {
    const userJSON = localStorage.getItem("currentUser")
    return userJSON ? JSON.parse(userJSON) : null
  }

  static set userObject(user) {
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("currentUser")
    }
  }

  static login(email, password) {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful login
    setTimeout(() => {
      // Mock user data
      const user = {
        userID: 1,
        email: email,
        userName: "Demo User",
        phoneNumber: "+20 123 456 789",
        address: "123 Book St, Reading City",
        birthDate: "1990-01-01",
        accountBalance: 500,
      }

      this.userObject = user
      MessagePopup.show("Login successful!")

      // Reload the page to update the UI
      window.location.reload()
    }, 1000)
  }

  static register(email, password, userName, phoneNumber, address, birthDate) {
    // In a real app, this would be an API call
    // For now, we'll simulate a successful registration
    setTimeout(() => {
      // Mock user data
      const user = {
        userID: 1,
        email: email,
        userName: userName,
        phoneNumber: phoneNumber,
        address: address,
        birthDate: birthDate,
        accountBalance: 500,
      }

      this.userObject = user
      MessagePopup.show("Registration successful!")

      // Reload the page to update the UI
      window.location.reload()
    }, 1000)
  }

  static logout() {
    this.userObject = null
    MessagePopup.show("Logout successful!")

    // Redirect to welcome page
    window.location.href = URL_Mapper.WELCOME
  }

  static handleUserInvalidState() {
    MessagePopup.show("Please login to continue", true)

    // Redirect to welcome page after a short delay
    setTimeout(() => {
      window.location.href = URL_Mapper.WELCOME
    }, 2000)
  }
}

export default UserAuthTracker
