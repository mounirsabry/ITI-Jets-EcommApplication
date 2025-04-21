import UserAuthTracker from "../Common/UserAuthTracker.js"
import MessagePopup from "../Common/MessagePopup.js"
import VanillaAJAX from "../Ajax/VanillaAJAX.js"

class WishlistManager {
  static #ajax = new VanillaAJAX()
  static #wishlistCache = new Map() // Cache for wishlist items

  // Add item to wishlist
  static addToWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      MessagePopup.show("Please login to add items to your wishlist", true)
      return false
    }

    try {
      // Try to use backend API first
      this.#ajax
        .post("/api/wishlist/add", { bookID, userID: userObject.userID })
        .then((response) => {
          console.log("Book added to wishlist via API:", response)
          MessagePopup.show("Book added to wishlist!")
          // Update local cache
          this.#updateLocalWishlist(bookID, true)
          return true
        })
        .catch((error) => {
          console.warn("API error, falling back to localStorage:", error)
          // Fallback to localStorage
          return this.#updateLocalWishlist(bookID, true)
        })

      return true
    } catch (e) {
      console.error("Error adding to wishlist:", e)
      // Fallback to localStorage
      return this.#updateLocalWishlist(bookID, true)
    }
  }

  // Remove item from wishlist
  static removeFromWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return false
    }

    try {
      // Try to use backend API first
      this.#ajax
        .post("/api/wishlist/remove", { bookID, userID: userObject.userID })
        .then((response) => {
          console.log("Book removed from wishlist via API:", response)
          // Update local cache
          this.#updateLocalWishlist(bookID, false)
          return true
        })
        .catch((error) => {
          console.warn("API error, falling back to localStorage:", error)
          // Fallback to localStorage
          return this.#updateLocalWishlist(bookID, false)
        })

      return true
    } catch (e) {
      console.error("Error removing from wishlist:", e)
      // Fallback to localStorage
      return this.#updateLocalWishlist(bookID, false)
    }
  }

  // Check if item is in wishlist
  static isInWishlist(bookID) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return false
    }

    try {
      // Check cache first
      if (this.#wishlistCache.has(userObject.userID)) {
        return this.#wishlistCache.get(userObject.userID).includes(bookID)
      }

      // Get from localStorage as fallback
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Update cache
      this.#wishlistCache.set(userObject.userID, wishlist)

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
      // Check cache first
      if (this.#wishlistCache.has(userObject.userID)) {
        return this.#wishlistCache.get(userObject.userID).length
      }

      // Get from localStorage as fallback
      const wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Update cache
      this.#wishlistCache.set(userObject.userID, wishlist)

      return wishlist.length
    } catch (e) {
      console.error("Error getting wishlist count:", e)
      return 0
    }
  }

  // Get all wishlist items
  static getWishlistItems(callback) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      callback([])
      return
    }

    try {
      // Try to use backend API first
      this.#ajax
        .get("/api/wishlist", { userID: userObject.userID })
        .then((response) => {
          console.log("Wishlist items retrieved via API:", response)
          if (response && Array.isArray(response)) {
            // Update cache
            const wishlistIds = response.map((item) => item.bookID)
            this.#wishlistCache.set(userObject.userID, wishlistIds)
            callback(response)
          } else {
            throw new Error("Invalid API response")
          }
        })
        .catch((error) => {
          console.warn("API error, falling back to localStorage:", error)
          // Fallback to localStorage and mock data
          this.#getWishlistItemsFallback(callback)
        })
    } catch (e) {
      console.error("Error getting wishlist items:", e)
      // Fallback to localStorage and mock data
      this.#getWishlistItemsFallback(callback)
    }
  }

  // Private method to get wishlist items from localStorage and mock data
  static #getWishlistItemsFallback(callback) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      callback([])
      return
    }

    try {
      // Get wishlist IDs from localStorage
      const wishlistIds = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      // Update cache
      this.#wishlistCache.set(userObject.userID, wishlistIds)

      if (wishlistIds.length === 0) {
        callback([])
        return
      }

      // Mock data for demonstration - in a real app, this would be fetched from an API
      const mockBooks = [
        {
          bookID: 1,
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          price: 75.0,
          discountedPercentage: 15,
          overview: "A classic novel about the American Dream and the Roaring Twenties.",
          genre: "Classic",
          images: [
            {
              url: "/placeholder.svg?height=300&width=200",
              isMain: true,
            },
          ],
          stock: 10,
          isAvailable: true,
          dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
        },
        {
          bookID: 2,
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          price: 85.5,
          discountedPercentage: 0,
          overview: "A powerful story of racial injustice and moral growth in the American South.",
          genre: "Classic",
          images: [
            {
              url: "/placeholder.svg?height=300&width=200",
              isMain: true,
            },
          ],
          stock: 5,
          isAvailable: true,
          dateAdded: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        },
        {
          bookID: 3,
          title: "1984",
          author: "George Orwell",
          price: 65.25,
          discountedPercentage: 10,
          overview: "A dystopian novel about totalitarianism, surveillance, and thought control.",
          genre: "Science Fiction",
          images: [
            {
              url: "/placeholder.svg?height=300&width=200",
              isMain: true,
            },
          ],
          stock: 0,
          isAvailable: false,
          dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        },
        {
          bookID: 4,
          title: "Pride and Prejudice",
          author: "Jane Austen",
          price: 70.0,
          discountedPercentage: 0,
          overview: "A romantic novel of manners that satirizes issues of class, marriage, and misconceptions.",
          genre: "Romance",
          images: [
            {
              url: "/placeholder.svg?height=300&width=200",
              isMain: true,
            },
          ],
          stock: 8,
          isAvailable: true,
          dateAdded: new Date().toISOString(), // Today
        },
      ]

      // Filter books based on wishlist IDs
      const wishlistBooks = mockBooks.filter((book) => wishlistIds.includes(book.bookID))
      callback(wishlistBooks)
    } catch (e) {
      console.error("Error getting wishlist items fallback:", e)
      callback([])
    }
  }

  // Private method to update localStorage wishlist
  static #updateLocalWishlist(bookID, isAdd) {
    const userObject = UserAuthTracker.userObject
    if (!userObject) {
      return false
    }

    try {
      // Get current wishlist from localStorage
      let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userObject.userID}`)) || []

      if (isAdd) {
        // Check if item is already in wishlist
        if (!wishlist.includes(bookID)) {
          wishlist.push(bookID)
          localStorage.setItem(`wishlist_${userObject.userID}`, JSON.stringify(wishlist))

          // Update cache
          this.#wishlistCache.set(userObject.userID, wishlist)

          MessagePopup.show("Book added to wishlist!")
          return true
        } else {
          MessagePopup.show("This book is already in your wishlist")
          return false
        }
      } else {
        // Remove item from wishlist
        wishlist = wishlist.filter((id) => id !== bookID)
        localStorage.setItem(`wishlist_${userObject.userID}`, JSON.stringify(wishlist))

        // Update cache
        this.#wishlistCache.set(userObject.userID, wishlist)

        return true
      }
    } catch (e) {
      console.error("Error updating local wishlist:", e)
      return false
    }
  }
}

export default WishlistManager
