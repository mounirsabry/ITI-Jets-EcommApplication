document.addEventListener("DOMContentLoaded", () => {



  // Load dashboard data
  loadDashboardData()

  // Initialize charts
  initChartPlaceholders()
})

function formatDate(dateString) {
  const date = new Date(dateString)
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString(undefined, options)
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

function loadDashboardData() {
  // In a real application, this would be an API call
  // For demo purposes, we'll use mock data

  // Update stats
  document.getElementById("totalBooks").textContent = "1,245"
  document.getElementById("totalSales").textContent = "$45,678"
  document.getElementById("totalUsers").textContent = "867"
  document.getElementById("pendingOrders").textContent = "23"

  // Load recent orders
  const recentOrders = [
    { id: "ORD-1234", customer: "John Doe", date: "2023-03-15", amount: 59.99, status: "Delivered" },
    { id: "ORD-1235", customer: "Jane Smith", date: "2023-03-16", amount: 129.5, status: "Shipped" },
    { id: "ORD-1236", customer: "Robert Johnson", date: "2023-03-17", amount: 45.75, status: "Pending" },
    { id: "ORD-1237", customer: "Emily Davis", date: "2023-03-18", amount: 89.99, status: "Pending" },
    { id: "ORD-1238", customer: "Michael Brown", date: "2023-03-19", amount: 34.5, status: "Delivered" },
    { id: "ORD-1239", customer: "Sarah Wilson", date: "2023-03-20", amount: 75.25, status: "Shipped" },
    { id: "ORD-1240", customer: "David Miller", date: "2023-03-21", amount: 112.99, status: "Pending" },
  ]

  const recentOrdersTable = document.getElementById("recentOrdersTable")
  recentOrdersTable.innerHTML = ""

  recentOrders.forEach((order) => {
    const statusClass = `status-${order.status.toLowerCase()}`

    recentOrdersTable.innerHTML += `
      <tr>
        <td>${order.id}</td>
        <td>${order.customer}</td>
        <td>${formatDate(order.date)}</td>
        <td>${formatCurrency(order.amount)}</td>
        <td><span class="status-badge ${statusClass}">${order.status}</span></td>
      </tr>
    `
  })
}

function initChartPlaceholders() {
  // Create placeholder for sales chart
  const salesChartContainer = document.getElementById("salesChart").parentNode
  document.getElementById("salesChart").remove()

  const salesPlaceholder = document.createElement("canvas")
  salesPlaceholder.id = "salesChart"
  salesChartContainer.appendChild(salesPlaceholder)

  new Chart(salesPlaceholder, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      datasets: [{
        label: "Monthly Sales",
        data: [3500, 4200, 3800, 5100, 4800, 5500, 6200, 5900, 6500, 7100, 6800, 7500],
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: "#007bff",
        borderWidth: 2,
        fill: true
      }]
    },
    options: {
      legend: {
        display: true
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  })

  // Create placeholder for books chart
  const booksChartContainer = document.getElementById("booksChart").parentNode
  document.getElementById("booksChart").remove()

  const booksPlaceholder = document.createElement("canvas")
  booksPlaceholder.id = "booksChart"
  booksChartContainer.appendChild(booksPlaceholder)

  new Chart(booksPlaceholder, {
    type: "bar",
    data: {
      labels: ["To Kill a Mockingbird", "1984", "The Great Gatsby", "The Catcher in the Rye", "Pride and Prejudice"],
      datasets: [{
        label: "Book Sales",
        data: [120, 95, 85, 70, 65],
        backgroundColor: ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6c757d"],
        borderColor: "#fff",
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: true
      }
    }
  })
}

