import URL_Mapper from "../Utils/URL_Mapper.js"

// Function to display a product popup
const displayProduct = (book, updateCallback = null) => {
  // Check if there's already a popup open and remove it
  const existingOverlay = document.getElementById("bookPopupOverlay")
  if (existingOverlay) {
    document.body.removeChild(existingOverlay)
    document.body.style.overflow = ""
  }

  // Create overlay
  const overlay = document.createElement("div")
  overlay.className = "popup-overlay"
  overlay.setAttribute("id", "bookPopupOverlay")

  // Create modal
  const modal = document.createElement("div")
  modal.className = "popup-modal"

  // Close button
  const closeButton = document.createElement("button")
  closeButton.className = "close-popup"
  closeButton.innerHTML = "&times;"
  closeButton.setAttribute("aria-label", "Close popup")

  // Image container
  const imageContainer = document.createElement("div")
  imageContainer.className = "image-container"

  // Get book images
  const images = book.images || []
  let currentImageIndex = 0

  // Find main image
  const mainImageIndex = images.findIndex((img) => img.isMain)
  if (mainImageIndex !== -1) {
    currentImageIndex = mainImageIndex
  }

  // Create image element
  const imageElement = document.createElement("img")
  imageElement.className = "popup-image"

  // Set image source
  if (images.length > 0) {
    imageElement.src = images[currentImageIndex].url
    imageElement.alt = book.title
  } else {
    imageElement.src = URL_Mapper.ASSETS.FALLBACK_BOOK_IMAGE
    imageElement.alt = "No image available"
  }

  // Add discount badge if applicable
  if (book.discountedPercentage && book.discountedPercentage > 0) {
    const discountBadge = document.createElement("div")
    discountBadge.className = "discount-badge"
    discountBadge.textContent = `-${book.discountedPercentage}%`
    imageContainer.appendChild(discountBadge)
  }

  // Add image navigation if there are multiple images
  if (images.length > 1) {
    // Previous button
    const prevButton = document.createElement("button")
    prevButton.className = "image-nav prev"
    prevButton.innerHTML = "&#10094;"
    prevButton.setAttribute("aria-label", "Previous image")
    prevButton.disabled = currentImageIndex === 0

    // Next button
    const nextButton = document.createElement("button")
    nextButton.className = "image-nav next"
    nextButton.innerHTML = "&#10095;"
    nextButton.setAttribute("aria-label", "Next image")
    nextButton.disabled = currentImageIndex === images.length - 1

    // Image indicator
    const imageIndicator = document.createElement("div")
    imageIndicator.className = "image-indicator"
    imageIndicator.textContent = `Image ${currentImageIndex + 1} of ${images.length}`

    // Add navigation to container
    imageContainer.appendChild(prevButton)
    imageContainer.appendChild(nextButton)

    // Navigation event listeners
    prevButton.addEventListener("click", (e) => {
      e.stopPropagation()
      if (currentImageIndex > 0) {
        currentImageIndex--
        imageElement.src = images[currentImageIndex].url
        imageIndicator.textContent = `Image ${currentImageIndex + 1} of ${images.length}`
        prevButton.disabled = currentImageIndex === 0
        nextButton.disabled = false
      }
    })

    nextButton.addEventListener("click", (e) => {
      e.stopPropagation()
      if (currentImageIndex < images.length - 1) {
        currentImageIndex++
        imageElement.src = images[currentImageIndex].url
        imageIndicator.textContent = `Image ${currentImageIndex + 1} of ${images.length}`
        nextButton.disabled = currentImageIndex === images.length - 1
        prevButton.disabled = false
      }
    })

    // Add image indicator after image
    modal.appendChild(imageIndicator)
  }

  // Add image to container
  imageContainer.appendChild(imageElement)

  // Book title
  const titleElement = document.createElement("h2")
  titleElement.textContent = book.title

  // Book overview
  const overviewElement = document.createElement("div")
  overviewElement.className = "overview"
  overviewElement.textContent = book.overview || "No overview available"

  // Book details
  const detailsElement = document.createElement("div")
  detailsElement.className = "description"

  // Calculate price with discount if applicable
  let priceDisplay = `${book.price} EGP`
  if (book.discountedPercentage && book.discountedPercentage > 0) {
    const discountAmount = (book.price * book.discountedPercentage) / 100
    const discountedPrice = book.price - discountAmount
    priceDisplay = `<span class="original-price">${book.price} EGP</span> <span class="discounted-price">${discountedPrice.toFixed(2)} EGP</span>`
  }

  // Populate details
  detailsElement.innerHTML = `
    <p><strong>Author:</strong> ${book.author || "Unknown"}</p>
    <p><strong>Genre:</strong> ${book.genre || "Unspecified"}</p>
    <p><strong>Price:</strong> ${priceDisplay}</p>
    <p><strong>ISBN:</strong> ${book.isbn || "N/A"}</p>
    <p><strong>Publication Date:</strong> ${book.publicationDate || "Unknown"}</p>
    <p><strong>Publisher:</strong> ${book.publisher || "Unknown"}</p>
    <p><strong>Pages:</strong> ${book.pages || "Unknown"}</p>
    <p><strong>Language:</strong> ${book.language || "Unknown"}</p>
    <p><strong>Availability:</strong> ${book.isAvailable ? `<span class="in-stock">In Stock (${book.stock} available)</span>` : '<span class="out-stock">Out of Stock</span>'}</p>
  `

  // Assemble modal
  modal.appendChild(closeButton)
  modal.appendChild(imageContainer)
  modal.appendChild(titleElement)
  modal.appendChild(overviewElement)
  modal.appendChild(detailsElement)

  // Add modal to overlay
  overlay.appendChild(modal)

  // Add overlay to body
  document.body.appendChild(overlay)

  // Prevent scrolling of background
  document.body.style.overflow = "hidden"

  // Close modal when clicking close button
  closeButton.addEventListener("click", (e) => {
    e.stopPropagation()
    document.body.removeChild(overlay)
    document.body.style.overflow = ""
  })

  // Close modal when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      e.stopPropagation()
      document.body.removeChild(overlay)
      document.body.style.overflow = ""
    }
  })

  // Close modal on escape key
  document.addEventListener("keydown", function escHandler(e) {
    if (e.key === "Escape") {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay)
        document.body.style.overflow = ""
      }
      document.removeEventListener("keydown", escHandler)
    }
  })
}

export default displayProduct
