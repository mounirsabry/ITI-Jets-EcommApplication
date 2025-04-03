document.addEventListener("DOMContentLoaded", () => {
  // Load orders data
  loadOrders()

  // Status filter
  const statusFilter = document.getElementById("statusFilter")
  statusFilter.addEventListener("change", function () {
    filterOrders(this.value)
  })

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  searchBtn.addEventListener("click", () => {
    const searchTerm = document.getElementById("orderSearch").value.toLowerCase()
    searchOrders(searchTerm)
  })

  // Search on enter key
  const orderSearch = document.getElementById("orderSearch")
  orderSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.toLowerCase()
      searchOrders(searchTerm)
    }
  })

  // Update order status
  const updateStatusBtn = document.getElementById("updateStatusBtn")
  updateStatusBtn.addEventListener("click", () => {
    updateOrderStatus()
  })
})

// Helper functions (moved to top for clarity)
function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}

function formatCurrency(amount) {
  return amount.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

function openModal(modalId) {
  const modal = document.getElementById(modalId)
  modal.style.display = "block"
}

function closeModal(modal) {
  modal.style.display = "none"
}

// Load orders from localStorage or initialize with sample data
function loadOrders() {
  let orders = JSON.parse(localStorage.getItem("orders")) || []

  // If no orders in localStorage, initialize with sample data
  if (orders.length === 0) {
    orders = [
      {
        id: "ORD-1234",
        customer: {
          name: "John Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          address: "123 Main St, Anytown, CA 12345",
        },
        date: "2023-03-15",
        items: [
          { book: "To Kill a Mockingbird", price: 12.99, quantity: 1, total: 12.99 },
          { book: "1984", price: 10.99, quantity: 2, total: 21.98 },
        ],
        subtotal: 34.97,
        shipping: 5.99,
        tax: 3.5,
        total: 44.46,
        status: "Delivered",
      },
      {
        id: "ORD-1235",
        customer: {
          name: "Jane Smith",
          email: "jane.smith@example.com",
          phone: "555-987-6543",
          address: "456 Oak Ave, Somewhere, NY 67890",
        },
        date: "2023-03-16",
        items: [
          { book: "The Great Gatsby", price: 9.99, quantity: 1, total: 9.99 },
          { book: "Pride and Prejudice", price: 8.99, quantity: 1, total: 8.99 },
          { book: "The Hobbit", price: 14.99, quantity: 1, total: 14.99 },
        ],
        subtotal: 33.97,
        shipping: 5.99,
        tax: 3.4,
        total: 43.36,
        status: "Shipped",
      },
      {
        id: "ORD-1236",
        customer: {
          name: "Robert Johnson",
          email: "robert.johnson@example.com",
          phone: "555-456-7890",
          address: "789 Pine St, Elsewhere, TX 54321",
        },
        date: "2023-03-17",
        items: [{ book: "To Kill a Mockingbird", price: 12.99, quantity: 1, total: 12.99 }],
        subtotal: 12.99,
        shipping: 5.99,
        tax: 1.3,
        total: 20.28,
        status: "Pending",
      },
      {
        id: "ORD-1237",
        customer: {
          name: "Emily Davis",
          email: "emily.davis@example.com",
          phone: "555-789-0123",
          address: "321 Maple Rd, Nowhere, FL 98765",
        },
        date: "2023-03-18",
        items: [
          { book: "1984", price: 10.99, quantity: 1, total: 10.99 },
          { book: "The Great Gatsby", price: 9.99, quantity: 1, total: 9.99 },
        ],
        subtotal: 20.98,
        shipping: 5.99,
        tax: 2.1,
        total: 29.07,
        status: "Pending",
      },
      {
        id: "ORD-1238",
        customer: {
          name: "Michael Brown",
          email: "michael.brown@example.com",
          phone: "555-321-6547",
          address: "654 Cedar Ln, Anywhere, WA 13579",
        },
        date: "2023-03-19",
        items: [{ book: "Pride and Prejudice", price: 8.99, quantity: 1, total: 8.99 }],
        subtotal: 8.99,
        shipping: 5.99,
        tax: 0.9,
        total: 15.88,
        status: "Delivered",
      },
    ]
    localStorage.setItem("orders", JSON.stringify(orders))
  }

  displayOrders(orders)
}

// Display orders in the table
function displayOrders(orders) {
  const ordersTable = document.getElementById("ordersTable")
  ordersTable.innerHTML = ""

  orders.forEach((order) => {
    const statusClass = `status-${order.status.toLowerCase()}`

    ordersTable.innerHTML += `
            <tr>
                <td>${order.id}</td>
                <td>${order.customer.name}</td>
                <td>${formatDate(order.date)}</td>
                <td>${formatCurrency(order.total)}</td>
                <td><span class="status-badge ${statusClass}">${order.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn" onclick="viewOrder('${order.id}')">View</button>
                    </div>
                </td>
            </tr>
        `
  })
}

// Filter orders by status
function filterOrders(status) {
  const orders = JSON.parse(localStorage.getItem("orders")) || []

  if (status === "all") {
    displayOrders(orders)
    return
  }

  const filteredOrders = orders.filter((order) => order.status === status)
  displayOrders(filteredOrders)
}

// Search orders
function searchOrders(searchTerm) {
  const orders = JSON.parse(localStorage.getItem("orders")) || []

  if (!searchTerm) {
    displayOrders(orders)
    return
  }

  const filteredOrders = orders.filter(
    (order) => order.id.toLowerCase().includes(searchTerm) || order.customer.name.toLowerCase().includes(searchTerm),
  )

  displayOrders(filteredOrders)
}

// View order details
function viewOrder(id) {
  const orders = JSON.parse(localStorage.getItem("orders")) || []
  const order = orders.find((order) => order.id === id)

  if (order) {
    // Populate modal with order details
    document.getElementById("modalOrderId").textContent = order.id
    document.getElementById("modalOrderDate").textContent = formatDate(order.date)
    document.getElementById("modalOrderStatus").value = order.status
    document.getElementById("modalCustomerName").textContent = order.customer.name
    document.getElementById("modalCustomerEmail").textContent = order.customer.email
    document.getElementById("modalCustomerPhone").textContent = order.customer.phone
    document.getElementById("modalShippingAddress").textContent = order.customer.address

    // Populate order items
    const modalOrderItems = document.getElementById("modalOrderItems")
    modalOrderItems.innerHTML = ""

    order.items.forEach((item) => {
      modalOrderItems.innerHTML += `
                <tr>
                    <td>${item.book}</td>
                    <td>${formatCurrency(item.price)}</td>
                    <td>${item.quantity}</td>
                    <td>${formatCurrency(item.total)}</td>
                </tr>
            `
    })

    // Populate order summary
    document.getElementById("modalSubtotal").textContent = formatCurrency(order.subtotal)
    document.getElementById("modalShipping").textContent = formatCurrency(order.shipping)
    document.getElementById("modalTax").textContent = formatCurrency(order.tax)
    document.getElementById("modalTotal").textContent = formatCurrency(order.total)

    // Store order ID for status update
    document.getElementById("updateStatusBtn").setAttribute("data-id", order.id)

    openModal("orderModal")
  }
}

// Update order status
function updateOrderStatus() {
  const orderId = document.getElementById("updateStatusBtn").getAttribute("data-id")
  const newStatus = document.getElementById("modalOrderStatus").value

  const orders = JSON.parse(localStorage.getItem("orders")) || []
  const orderIndex = orders.findIndex((order) => order.id === orderId)

  if (orderIndex !== -1) {
    orders[orderIndex].status = newStatus
    localStorage.setItem("orders", JSON.stringify(orders))

    closeModal(document.getElementById("orderModal"))
    loadOrders()
  }
}

