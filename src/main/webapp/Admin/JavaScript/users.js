var usersString = [];
document.addEventListener("DOMContentLoaded", () => {

  // Search functionality
  const searchBtn = document.getElementById("searchBtn")
  searchBtn.addEventListener("click", () => {
    const searchTerm = document.getElementById("userSearch").value.toLowerCase()
    searchUsers(searchTerm)
  })

  // Search on enter key
  const userSearch = document.getElementById("userSearch")
  userSearch.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      const searchTerm = e.target.value.toLowerCase()
      searchUsers(searchTerm)
    }
  })

  // User form submission
  const userForm = document.getElementById("userForm")
  userForm.addEventListener("submit", (e) => {
    e.preventDefault()
    saveUser()
  })

  // Cancel button
  const cancelBtn = document.getElementById("cancelBtn")
  cancelBtn.addEventListener("click", () => {
    closeModal(document.getElementById("userModal"))
  })

  // Cancel delete button
  const cancelDeleteBtn = document.getElementById("cancelDeleteBtn")
  cancelDeleteBtn.addEventListener("click", () => {
    closeModal(document.getElementById("deleteModal"))
  })

  // Confirm delete button
  const confirmDeleteBtn = document.getElementById("confirmDeleteBtn")
  confirmDeleteBtn.addEventListener("click", () => {
    deleteUser()
  })

  // Make edit and delete buttons work globally
  window.confirmDelete = confirmDelete

})

// Load users from localStorage or initialize with sample data
function loadUsers() {

  let users = JSON.parse(usersString) || []
  displayUsers(users)
}

// Display users in the table
function displayUsers(users) {
  const usersTable = document.getElementById("usersTable")
  usersTable.innerHTML = ""

  users.forEach((user) => {
    usersTable.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.firstName} ${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.phone || "N/A"}</td>
        <td>${formatDate(user.registrationDate)}</td>
        <td>${user.orders}</td>
        <td>
          <div class="action-buttons">
            <button class="btn" onclick="viewUser(${user.id})">View</button>
            <button class="btn btn-danger" onclick="confirmDelete(${user.id})">Delete</button>
          </div>
        </td>
      </tr>
    `
  })
}

// Search users
function searchUsers(searchTerm) {
  const users = JSON.parse(usersString) || []


  if (!searchTerm) {
    displayUsers(users)
    return
  }

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm),
  )

  displayUsers(filteredUsers)
}

// Client-side search fallback
function clientSideSearch(searchTerm) {
  const users = JSON.parse(usersString) || []

  if (!searchTerm) {
    displayUsers(users)
    return
  }

  const filteredUsers = users.filter(
    (user) =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm),
  )

  displayUsers(filteredUsers)
}

// Edit user
function viewUser(id) {

  // For now, use localStorage
  const users = JSON.parse(usersString) || []
  const user = users.find((user) => user.id === id)

  if (user) {
    populateUserForm(user)
  }
}

// Populate user form with data
function populateUserForm(user) {
  document.getElementById("modalTitle").textContent = "View User"
  document.getElementById("userId").value = user.id
  document.getElementById("firstName").value = user.firstName
  document.getElementById("lastName").value = user.lastName
  document.getElementById("email").value = user.email
  document.getElementById("phone").value = user.phone || ""
  document.getElementById("address").value = user.address || ""

  openModal("userModal")
}

// Confirm delete
function confirmDelete(id) {
  document.getElementById("confirmDeleteBtn").setAttribute("data-id", id)
  openModal("deleteModal")
}

// Delete user
function deleteUser() {
  const id = Number.parseInt(document.getElementById("confirmDeleteBtn").getAttribute("data-id"));
  deleteWebSocket.send(id);
  closeModal(document.getElementById("deleteModal"));


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

//-----------------------------------------------------------------------


var viewWebSocket;
var deleteWebSocket;
function connect() {


  viewWebSocket = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/ViewUsers");
  viewWebSocket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  viewWebSocket.onopen = onOpen;
  viewWebSocket.onmessage = viewOnMessage;

  //delete user websocket implementation
  deleteWebSocket = new WebSocket("ws://" + window.location.host + "/ITI-Jets-EcommApplication/Admin/DeleteUser");
  deleteWebSocket.onerror = (error) => {
    console.error('WebSocket Error:', error);
  };


  deleteWebSocket.onopen = onOpen;
  deleteWebSocket.onmessage = deleteOnMessage;
}

function onOpen() {
  console.log("connection established in users.js");

}

function viewOnMessage(event) {

  console.log(event.data);
  usersString = event.data;
  loadUsers();

}

function deleteOnMessage(event) {

  console.log(event.data);
  usersString = event.data;
  loadUsers();

}


