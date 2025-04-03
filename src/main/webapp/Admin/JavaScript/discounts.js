document.addEventListener("DOMContentLoaded", () => {
  // Load data
  loadBanners()
  loadDiscounts()
  loadBooksForSelector()

  // Tab switching
  const tabBtns = document.querySelectorAll(".tab-btn")
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Remove active class from all tabs and contents
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"))
      document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"))

      // Add active class to clicked tab and corresponding content
      btn.classList.add("active")
      const tabId = btn.getAttribute("data-tab") + "-tab"
      document.getElementById(tabId).classList.add("active")
    })
  })

  // Add banner button
  const addBannerBtn = document.getElementById("addBannerBtn")
  addBannerBtn.addEventListener("click", () => {
    document.getElementById("bannerModalTitle").textContent = "Add New Banner"
    document.getElementById("bannerForm").reset()
    document.getElementById("bannerId").value = ""
    document.getElementById("bannerImagePreview").style.backgroundImage = ""

    // Set default dates
    const today = new Date().toISOString().split("T")[0]
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthDate = nextMonth.toISOString().split("T")[0]

    document.getElementById("bannerStartDate").value = today
    document.getElementById("bannerEndDate").value = nextMonthDate

    openModal("bannerModal")
  })

  // Add discount button
  const addDiscountBtn = document.getElementById("addDiscountBtn")
  addDiscountBtn.addEventListener("click", () => {
    document.getElementById("discountModalTitle").textContent = "Add New Discount"
    document.getElementById("discountForm").reset()
    document.getElementById("discountId").value = ""
    document.getElementById("categorySelector").classList.add("hidden")
    document.getElementById("booksSelector").classList.add("hidden")
    document.getElementById("valueType").textContent = "%"

    // Set default dates
    const today = new Date().toISOString().split("T")[0]
    const nextMonth = new Date()
    nextMonth.setMonth(nextMonth.getMonth() + 1)
    const nextMonthDate = nextMonth.toISOString().split("T")[0]

    document.getElementById("discountStartDate").value = today
    document.getElementById("discountEndDate").value = nextMonthDate

    openModal("discountModal")
  })

  // View discounted books button
  const viewDiscountedBooksBtn = document.getElementById("viewDiscountedBooksBtn")
  viewDiscountedBooksBtn.addEventListener("click", () => {
    loadDiscountedBooks()
    openModal("discountedBooksModal")
  })

  // Remove all discounts button
  const removeAllDiscountsBtn = document.getElementById("removeAllDiscountsBtn")
  removeAllDiscountsBtn.addEventListener("click", () => {
    openModal("removeAllDiscountsModal")
  })

  // Confirm remove all discounts
  const confirmRemoveAllBtn = document.getElementById("confirmRemoveAllBtn")
  confirmRemoveAllBtn.addEventListener("click", () => {
    removeAllDiscounts()
  })

  // Cancel remove all discounts
  const cancelRemoveAllBtn = document.getElementById("cancelRemoveAllBtn")
  cancelRemoveAllBtn.addEventListener("click", () => {
    closeModal(document.getElementById("removeAllDiscountsModal"))
  })

  // Discount type change
  const discountType = document.getElementById("discountType")
  discountType.addEventListener("change", function () {
    const valueType = document.getElementById("valueType")
    valueType.textContent = this.value === "percentage" ? "%" : "$"
  })

  // Apply to change
  const applyTo = document.getElementById("applyTo")
  applyTo.addEventListener("change", function () {
    const categorySelector = document.getElementById("categorySelector")
    const booksSelector = document.getElementById("booksSelector")

    categorySelector.classList.add("hidden")
    booksSelector.classList.add("hidden")

    if (this.value === "category") {
      categorySelector.classList.remove("hidden")
    } else if (this.value === "books") {
      booksSelector.classList.remove("hidden")
      loadAvailableBooks()
    }
  })

  // Banner form submission
  const bannerForm = document.getElementById("bannerForm")
  bannerForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveBanner()
  })

  // Discount form submission
  const discountForm = document.getElementById("discountForm")
  discountForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveDiscount()
  })

  // Banner image preview
  const bannerImage = document.getElementById("bannerImage")
  bannerImage.addEventListener("change", (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        document.getElementById("bannerImagePreview").style.backgroundImage = `url(${e.target.result})`
      }
      reader.readAsDataURL(file)
    }
  })

  // Banner status toggle
  const bannerStatus = document.getElementById("bannerStatus")
  bannerStatus.addEventListener("change", function () {
    const toggleLabel = this.nextElementSibling.nextElementSibling
    toggleLabel.textContent = this.checked ? "Active" : "Inactive"
  })

  // Books selection buttons
  const addSelectedBooksBtn = document.getElementById("addSelectedBooks")
  addSelectedBooksBtn.addEventListener("click", () => {
    moveSelectedBooks("available", "selected")
  })

  const removeSelectedBooksBtn = document.getElementById("removeSelectedBooks")
  removeSelectedBooksBtn.addEventListener("click", () => {
    moveSelectedBooks("selected", "available")
  })

  // Cancel buttons
  const cancelBannerBtn = document.getElementById("cancelBannerBtn")
  cancelBannerBtn.addEventListener("click", () => {
    closeModal(document.getElementById("bannerModal"))
  })

  const cancelDiscountBtn = document.getElementById("cancelDiscountBtn")
  cancelDiscountBtn.addEventListener("click", () => {
    closeModal(document.getElementById("discountModal"))
  })

  // Cancel delete button
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
  cancelDeleteBtn.addEventListener("click", () => {
    closeModal(document.getElementById("deleteModal"))
  })

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
  confirmDeleteBtn.addEventListener("click", () => {
    const type = confirmDeleteBtn.getAttribute("data-type")
    const id = Number.parseInt(confirmDeleteBtn.getAttribute("data-id"))

    if (type === "banner") {
      deleteBanner(id)
    } else if (type === "discount") {
      deleteDiscount(id)
    } else if (type === "book-discount") {
      removeBookDiscount(id)
    }
  })

  // Make functions available globally
  window.editBanner = editBanner
  window.confirmDeleteBanner = confirmDeleteBanner
  window.editDiscount = editDiscount
  window.confirmDeleteDiscount = confirmDeleteDiscount
  window.removeBookDiscount = removeBookDiscount
})

// Load banners from localStorage or initialize with sample data
function loadBanners() {
  let banners = JSON.parse(localStorage.getItem("banners")) || []

  // If no banners in localStorage, initialize with sample data
  if (banners.length === 0) {
    banners = [
      {
        id: 1,
        title: "Summer Reading Sale",
        image: "https://placeholder.svg?height=300&width=800",
        text: "Get up to 30% off on all summer reading books!",
        startDate: "2023-06-01",
        endDate: "2023-08-31",
        status: true,
      },
      {
        id: 2,
        title: "Back to School",
        image: "https://placeholder.svg?height=300&width=800",
        text: "Prepare for the new school year with our educational books collection.",
        startDate: "2023-08-15",
        endDate: "2023-09-15",
        status: true,
      },
      {
        id: 3,
        title: "Holiday Gift Guide",
        image: "https://placeholder.svg?height=300&width=800",
        text: "Find the perfect book gifts for your loved ones.",
        startDate: "2023-11-15",
        endDate: "2023-12-25",
        status: false,
      },
    ]
    localStorage.setItem("banners", JSON.stringify(banners))
  }

  displayBanners(banners)
}

// Load discounts from localStorage or initialize with sample data
function loadDiscounts() {
  let discounts = JSON.parse(localStorage.getItem("discounts")) || []

  // If no discounts in localStorage, initialize with sample data
  if (discounts.length === 0) {
    discounts = [
      {
        id: 1,
        name: "Summer Sale",
        type: "percentage",
        value: 15,
        applyTo: "all",
        startDate: "2023-06-01",
        endDate: "2023-08-31",
        status: "Active",
      },
      {
        id: 2,
        name: "Fiction Books Discount",
        type: "percentage",
        value: 10,
        applyTo: "category",
        category: "Fiction",
        startDate: "2023-07-15",
        endDate: "2023-09-15",
        status: "Active",
      },
      {
        id: 3,
        name: "Classics Collection",
        type: "percentage",
        value: 20,
        applyTo: "books",
        books: [1, 3, 4], // Book IDs
        startDate: "2023-08-01",
        endDate: "2023-10-31",
        status: "Active",
      },
    ]
    localStorage.setItem("discounts", JSON.stringify(discounts))
  }

  displayDiscounts(discounts)
}

// Load books for selector
function loadBooksForSelector() {
  const books = JSON.parse(localStorage.getItem("books")) || []
  if (books.length === 0) return
}

// Load available books for selection
function loadAvailableBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || []
  const availableBooksContainer = document.getElementById("availableBooksContainer")
  const selectedBooksContainer = document.getElementById("selectedBooksContainer")

  availableBooksContainer.innerHTML = ""
  selectedBooksContainer.innerHTML = ""

  books.forEach((book) => {
    availableBooksContainer.innerHTML += `
      <div class="book-item" data-id="${book.id}">
        <img src="${book.coverImage}" alt="${book.title}">
        <span>${book.title}</span>
      </div>
    `
  })

  // Add click event to book items
  const bookItems = availableBooksContainer.querySelectorAll(".book-item")
  bookItems.forEach((item) => {
    item.addEventListener("click", function () {
      this.classList.toggle("selected")
    })
  })
}

// Move selected books between containers
function moveSelectedBooks(fromType, toType) {
  const fromContainer = document.getElementById(`${fromType}BooksContainer`)
  const toContainer = document.getElementById(`${toType}BooksContainer`)
  const selectedBooks = fromContainer.querySelectorAll(".book-item.selected")

  selectedBooks.forEach((book) => {
    book.classList.remove("selected")
    toContainer.appendChild(book)

    // Re-add click event
    book.addEventListener("click", function () {
      this.classList.toggle("selected")
    })
  })
}

// Load discounted books
function loadDiscountedBooks() {
  const books = JSON.parse(localStorage.getItem("books")) || []
  const discountedBooksTable = document.getElementById("discountedBooksTable")

  discountedBooksTable.innerHTML = ""

  const discountedBooks = books.filter((book) => book.discount > 0)

  if (discountedBooks.length === 0) {
    discountedBooksTable.innerHTML = `
      <tr>
        <td colspan="6" class="text-center">No books with discounts found.</td>
      </tr>
    `
    return
  }

  discountedBooks.forEach((book) => {
    const finalPrice = book.price * (1 - book.discount / 100)

    discountedBooksTable.innerHTML += `
      <tr>
        <td><img src="${book.coverImage}" alt="${book.title}" class="book-cover"></td>
        <td>${book.title}</td>
        <td>${formatCurrency(book.price)}</td>
        <td>${book.discount}%</td>
        <td>${formatCurrency(finalPrice)}</td>
        <td>
          <button class="btn btn-danger" onclick="removeBookDiscount(${book.id})">Remove Discount</button>
        </td>
      </tr>
    `
  })
}

// Display banners in the table
function displayBanners(banners) {
  const bannersTable = document.getElementById("bannersTable")
  bannersTable.innerHTML = ""

  banners.forEach((banner) => {
    const today = new Date()
    const startDate = new Date(banner.startDate)
    const endDate = new Date(banner.endDate)

    let status = "Inactive"
    if (banner.status) {
      if (today >= startDate && today <= endDate) {
        status = "Active"
      } else if (today < startDate) {
        status = "Scheduled"
      } else if (today > endDate) {
        status = "Expired"
      }
    }

    const statusClass = `status-${status.toLowerCase()}`

    bannersTable.innerHTML += `
      <tr>
        <td>${banner.id}</td>
        <td><img src="${banner.image}" alt="${banner.title}" class="banner-thumbnail"></td>
        <td>${banner.title}</td>
        <td>${formatDate(banner.startDate)}</td>
        <td>${formatDate(banner.endDate)}</td>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="editBanner(${banner.id})">Edit</button>
            <button class="btn btn-danger" onclick="confirmDeleteBanner(${banner.id})">Delete</button>
          </div>
        </td>
      </tr>
    `
  })
}

// Display discounts in the table
function displayDiscounts(discounts) {
  const discountsTable = document.getElementById("discountsTable")
  discountsTable.innerHTML = ""

  discounts.forEach((discount) => {
    const today = new Date()
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    let status = "Inactive"
    if (today >= startDate && today <= endDate) {
      status = "Active"
    } else if (today < startDate) {
      status = "Scheduled"
    } else if (today > endDate) {
      status = "Expired"
    }

    const statusClass = `status-${status.toLowerCase()}`
    const valueDisplay = discount.type === "percentage" ? `${discount.value}%` : `$${discount.value.toFixed(2)}`

    let applyToDisplay = "All Books"
    if (discount.applyTo === "category") {
      applyToDisplay = `Category: ${discount.category}`
    } else if (discount.applyTo === "books") {
      applyToDisplay = `${discount.books ? discount.books.length : 0} Books`
    }

    discountsTable.innerHTML += `
      <tr>
        <td>${discount.id}</td>
        <td>${discount.name}</td>
        <td>${discount.type === "percentage" ? "Percentage" : "Fixed Amount"}</td>
        <td>${valueDisplay}</td>
        <td>${applyToDisplay}</td>
        <td>${formatDate(discount.startDate)}</td>
        <td>${formatDate(discount.endDate)}</td>
        <td><span class="status-badge ${statusClass}">${status}</span></td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="editDiscount(${discount.id})">Edit</button>
            <button class="btn btn-danger" onclick="confirmDeleteDiscount(${discount.id})">Delete</button>
          </div>
        </td>
      </tr>
    `
  })
}

// Edit banner
function editBanner(id) {
  const banners = JSON.parse(localStorage.getItem("banners")) || []
  const banner = banners.find((banner) => banner.id === id)

  if (banner) {
    document.getElementById("bannerModalTitle").textContent = "Edit Banner"
    document.getElementById("bannerId").value = banner.id
    document.getElementById("bannerTitle").value = banner.title
    document.getElementById("bannerText").value = banner.text || ""
    document.getElementById("bannerStartDate").value = banner.startDate
    document.getElementById("bannerEndDate").value = banner.endDate
    document.getElementById("bannerStatus").checked = banner.status

    // Update toggle label
    const toggleLabel = document.querySelector(".toggle-label")
    toggleLabel.textContent = banner.status ? "Active" : "Inactive"

    // Set banner image preview
    if (banner.image) {
      document.getElementById("bannerImagePreview").style.backgroundImage = `url(${banner.image})`
    }

    openModal("bannerModal")
  }
}

// Edit discount
function editDiscount(id) {
  const discounts = JSON.parse(localStorage.getItem("discounts")) || []
  const discount = discounts.find((discount) => discount.id === id)

  if (discount) {
    document.getElementById("discountModalTitle").textContent = "Edit Discount"
    document.getElementById("discountId").value = discount.id
    document.getElementById("discountName").value = discount.name
    document.getElementById("discountType").value = discount.type
    document.getElementById("discountValue").value = discount.value
    document.getElementById("applyTo").value = discount.applyTo
    document.getElementById("discountStartDate").value = discount.startDate
    document.getElementById("discountEndDate").value = discount.endDate

    // Set value type
    document.getElementById("valueType").textContent = discount.type === "percentage" ? "%" : "$"

    // Show/hide category or books selector
    const categorySelector = document.getElementById("categorySelector")
    const booksSelector = document.getElementById("booksSelector")

    categorySelector.classList.add("hidden")
    booksSelector.classList.add("hidden")

    if (discount.applyTo === "category") {
      categorySelector.classList.remove("hidden")
      document.getElementById("category").value = discount.category || ""
    } else if (discount.applyTo === "books") {
      booksSelector.classList.remove("hidden")
      loadAvailableBooks()

      // Move selected books to the selected container
      setTimeout(() => {
        if (discount.books && discount.books.length > 0) {
          const availableBooksContainer = document.getElementById("availableBooksContainer")
          const selectedBooksContainer = document.getElementById("selectedBooksContainer")

          discount.books.forEach((bookId) => {
            const bookItem = availableBooksContainer.querySelector(`.book-item[data-id="${bookId}"]`)
            if (bookItem) {
              selectedBooksContainer.appendChild(bookItem)
            }
          })
        }
      }, 100)
    }

    openModal("discountModal")
  }
}

// Confirm delete banner
function confirmDeleteBanner(id) {
  document.getElementById("deleteMessage").textContent =
    "Are you sure you want to delete this banner? This action cannot be undone."
  document.getElementById("confirmDeleteBtn").setAttribute("data-type", "banner")
  document.getElementById("confirmDeleteBtn").setAttribute("data-id", id)
  openModal("deleteModal")
}

// Confirm delete discount
function confirmDeleteDiscount(id) {
  document.getElementById("deleteMessage").textContent =
    "Are you sure you want to delete this discount? This action cannot be undone."
  document.getElementById("confirmDeleteBtn").setAttribute("data-type", "discount")
  document.getElementById("confirmDeleteBtn").setAttribute("data-id", id)
  openModal("deleteModal")
}

// Confirm remove book discount
function confirmRemoveBookDiscount(id) {
  document.getElementById("deleteMessage").textContent = "Are you sure you want to remove the discount from this book?"
  document.getElementById("confirmDeleteBtn").setAttribute("data-type", "book-discount")
  document.getElementById("confirmDeleteBtn").setAttribute("data-id", id)
  openModal("deleteModal")
}

// Delete banner
function deleteBanner(id) {
  let banners = JSON.parse(localStorage.getItem("banners")) || []

  banners = banners.filter((banner) => banner.id !== id)
  localStorage.setItem("banners", JSON.stringify(banners))

  closeModal(document.getElementById("deleteModal"))
  loadBanners()
}

// Delete discount
function deleteDiscount(id) {
  let discounts = JSON.parse(localStorage.getItem("discounts")) || []

  discounts = discounts.filter((discount) => discount.id !== id)
  localStorage.setItem("discounts", JSON.stringify(discounts))

  closeModal(document.getElementById("deleteModal"))
  loadDiscounts()
}

// Remove book discount
function removeBookDiscount(id) {
  const books = JSON.parse(localStorage.getItem("books")) || []

  const bookIndex = books.findIndex((book) => book.id === id)
  if (bookIndex !== -1) {
    books[bookIndex].discount = 0
    localStorage.setItem("books", JSON.stringify(books))
  }

  closeModal(document.getElementById("deleteModal"))
  loadDiscountedBooks()
}

// Remove all discounts
function removeAllDiscounts() {
  let books = JSON.parse(localStorage.getItem("books")) || []

  books = books.map((book) => ({
    ...book,
    discount: 0,
  }))

  localStorage.setItem("books", JSON.stringify(books))

  closeModal(document.getElementById("removeAllDiscountsModal"))
  alert("All discounts have been removed from books.")
}

// Save banner
function saveBanner() {
  const bannerId = document.getElementById("bannerId").value
  const title = document.getElementById("bannerTitle").value
  const text = document.getElementById("bannerText").value
  const startDate = document.getElementById("bannerStartDate").value
  const endDate = document.getElementById("bannerEndDate").value
  const status = document.getElementById("bannerStatus").checked

  let image = "https://placeholder.svg?height=300&width=800"
  const imagePreview = document.getElementById("bannerImagePreview")
  if (imagePreview.style.backgroundImage) {
    const bgImage = imagePreview.style.backgroundImage
    image = bgImage.replace(/url$$['"](.+)['"]$$/, "$1")
  }

  const banners = JSON.parse(localStorage.getItem("banners")) || []

  if (bannerId) {
    // Update existing banner
    const index = banners.findIndex((banner) => banner.id === Number.parseInt(bannerId))
    if (index !== -1) {
      banners[index] = {
        ...banners[index],
        title,
        text,
        image,
        startDate,
        endDate,
        status,
      }
    }
  } else {
    // Add new banner
    const newId = banners.length > 0 ? Math.max(...banners.map((banner) => banner.id)) + 1 : 1
    banners.push({
      id: newId,
      title,
      text,
      image,
      startDate,
      endDate,
      status,
    })
  }

  localStorage.setItem("banners", JSON.stringify(banners))
  closeModal(document.getElementById("bannerModal"))
  loadBanners()
}

// Save discount
function saveDiscount() {
  const discountId = document.getElementById("discountId").value
  const name = document.getElementById("discountName").value
  const type = document.getElementById("discountType").value
  const value = Number.parseFloat(document.getElementById("discountValue").value)
  const applyTo = document.getElementById("applyTo").value
  const startDate = document.getElementById("discountStartDate").value
  const endDate = document.getElementById("discountEndDate").value

  let category = null
  let books = []

  if (applyTo === "category") {
    category = document.getElementById("category").value
  } else if (applyTo === "books") {
    const selectedBooksContainer = document.getElementById("selectedBooksContainer")
    const selectedBooks = selectedBooksContainer.querySelectorAll(".book-item")
    books = Array.from(selectedBooks).map((book) => Number.parseInt(book.getAttribute("data-id")))
  }

  const discounts = JSON.parse(localStorage.getItem("discounts")) || []

  if (discountId) {
    // Update existing discount
    const index = discounts.findIndex((discount) => discount.id === Number.parseInt(discountId))
    if (index !== -1) {
      discounts[index] = {
        ...discounts[index],
        name,
        type,
        value,
        applyTo,
        category,
        books,
        startDate,
        endDate,
      }
    }
  } else {
    // Add new discount
    const newId = discounts.length > 0 ? Math.max(...discounts.map((discount) => discount.id)) + 1 : 1
    discounts.push({
      id: newId,
      name,
      type,
      value,
      applyTo,
      category,
      books,
      startDate,
      endDate,
      status: "Active",
    })
  }

  localStorage.setItem("discounts", JSON.stringify(discounts))

  // Apply discounts to books
  applyDiscountsToBooks()

  closeModal(document.getElementById("discountModal"))
  loadDiscounts()
}

// Apply discounts to books
function applyDiscountsToBooks() {
  const discounts = JSON.parse(localStorage.getItem("discounts")) || []
  let books = JSON.parse(localStorage.getItem("books")) || []

  // Reset all discounts
  books = books.map((book) => ({
    ...book,
    discount: 0,
  }))

  // Apply active discounts
  const today = new Date()

  discounts.forEach((discount) => {
    const startDate = new Date(discount.startDate)
    const endDate = new Date(discount.endDate)

    if (today >= startDate && today <= endDate) {
      if (discount.applyTo === "all") {
        // Apply to all books
        books = books.map((book) => ({
          ...book,
          discount: Math.max(book.discount, discount.value),
        }))
      } else if (discount.applyTo === "category" && discount.category) {
        // Apply to specific category
        books = books.map((book) => ({
          ...book,
          discount: book.genre === discount.category ? Math.max(book.discount, discount.value) : book.discount,
        }))
      } else if (discount.applyTo === "books" && discount.books && discount.books.length > 0) {
        // Apply to specific books
        books = books.map((book) => ({
          ...book,
          discount: discount.books.includes(book.id) ? Math.max(book.discount, discount.value) : book.discount,
        }))
      }
    }
  })

  localStorage.setItem("books", JSON.stringify(books))
}

// Helper functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = "block"
  document.body.style.overflow = "hidden"
}

function closeModal(modal) {
  modal.style.display = "none"
  document.body.style.overflow = "auto"
}

function formatDate(dateString) {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatCurrency(number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(number)
}

