import UserAuthTracker from "../Common/UserAuthTracker.js"
import MessagePopup from "../Common/MessagePopup.js"

class WishlistManager {
  // Add item to wishlist
  static addToWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      MessagePopup.show("Please login to add items to your wishlist", true)
      return false
    }

    try {
      // Get current wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Check if item is already in wishlist
      if (wishlist.includes(bookID)) {
        MessagePopup.show("This book is already in your wishlist")
        return false
      }

      // Add item to wishlist
      wishlist.push(bookID)
      localStorage.setItem(`wishlist_${userObject.userID}`, JSON.stringify(wishlist))

      MessagePopup.show("Book added to wishlist!")
      return true
    } catch (e) {
      console.error("Error adding to wishlist:", e)
      MessagePopup.show("Failed to add to wishlist", true)
      return false
    }
  }

  // Remove item from wishlist
  static removeFromWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return false
    }

    try {
      // Get current wishlist from localStorage
      let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Remove item from wishlist
      wishlist = wishlist.filter((id) => id !== bookID)
      localStorage.setItem(`wishlist_${userObject.userID}`, JSON.stringify(wishlist))

      return true
    } catch (e) {
      console.error("Error removing from wishlist:", e)
      return false
    }
  }

  // Check if item is in wishlist
  static isInWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return false
    }

    try {
      // Get current wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Check if item is in wishlist
      return wishlist.includes(bookID)
    } catch (e) {
      console.error("Error checking wishlist:", e)
      return false
    }
  }

  // Get wishlist count
  static getWishlistCount() {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return 0
    }

    try {
      // Get current wishlist from localStorage
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Return wishlist count
      return wishlist.length
    } catch (e) {
      console.error("Error getting wishlist count:", e)
      return 0
    }
  }
}

export default WishlistManager
