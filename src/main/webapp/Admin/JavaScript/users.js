document.addEventListener("DOMContentLoaded", () => {

  //startGetAllDataWorker();
  // Load users data
  //loadUsers()

  /*

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
  window.editUser = editUser
  window.confirmDelete = confirmDelete
  */
})

// Load users from localStorage or initialize with sample data
function loadUsers() {
  // AJAX call to get users data (commented out as backend is not ready)
  /*
  fetch('/api/users')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Store users in localStorage for offline use
      localStorage.setItem("users", JSON.stringify(data));
      displayUsers(data);
    })
    .catch(error => {
      console.error('Error fetching users:', error);
      // Fall back to localStorage if API call fails
      const users = JSON.parse(localStorage.getItem("users")) || [];
      displayUsers(users);
    });
  */

  // For now, use dummy data
  let users = JSON.parse(localStorage.getItem("users")) || []

  // If no users in localStorage, initialize with sample data
  if (users.length === 0) {
    users = [
      {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "555-123-4567",
        address: "123 Main St, Anytown, CA 12345",
        registrationDate: "2023-01-15",
        orders: 3,
      },
      {
        id: 2,
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "555-987-6543",
        address: "456 Oak Ave, Somewhere, NY 67890",
        registrationDate: "2023-01-20",
        orders: 2,
      },
      {
        id: 3,
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@example.com",
        phone: "555-456-7890",
        address: "789 Pine St, Elsewhere, TX 54321",
        registrationDate: "2023-02-05",
        orders: 1,
      },
      {
        id: 4,
        firstName: "Emily",
        lastName: "Davis",
        email: "emily.davis@example.com",
        phone: "555-789-0123",
        address: "321 Maple Rd, Nowhere, FL 98765",
        registrationDate: "2023-02-10",
        orders: 1,
      },
      {
        id: 5,
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
        phone: "555-321-6547",
        address: "654 Cedar Ln, Anywhere, WA 13579",
        registrationDate: "2023-02-15",
        orders: 1,
      },
    ]
    localStorage.setItem("users", JSON.stringify(users))
  }

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
  // AJAX call to search users (commented out as backend is not ready)
  /*
  fetch(`/api/users/search?term=${encodeURIComponent(searchTerm)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      displayUsers(data);
    })
    .catch(error => {
      console.error('Error searching users:', error);
      // Fall back to client-side search
      clientSideSearch(searchTerm);
    });
  */

  // For now, use client-side search
  clientSideSearch(searchTerm)
}

// Client-side search fallback
function clientSideSearch(searchTerm) {
  const users = JSON.parse(localStorage.getItem("users")) || []

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
  // AJAX call to get user details (commented out as backend is not ready)
  /*
  fetch(`/api/users/${id}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(user => {
      populateUserForm(user);
    })
    .catch(error => {
      console.error('Error fetching user details:', error);
      // Fall back to localStorage
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find((user) => user.id === id);
      if (user) {
        populateUserForm(user);
      }
    });
  */

  // For now, use localStorage
  const users = JSON.parse(localStorage.getItem("users")) || []
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
  const id = Number.parseInt(document.getElementById("confirmDeleteBtn").getAttribute("data-id"))

  // AJAX call to delete user (commented out as backend is not ready)
  /*
  fetch(`/api/users/${id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      // Update localStorage after successful deletion
      let users = JSON.parse(localStorage.getItem("users")) || [];
      users = users.filter((user) => user.id !== id);
      localStorage.setItem("users", JSON.stringify(users));
      
      closeModal(document.getElementById("deleteModal"));
      loadUsers();
    })
    .catch(error => {
      console.error('Error deleting user:', error);
      // Fall back to client-side deletion
      clientSideDelete(id);
    });
  */

  // For now, use client-side deletion
  clientSideDelete(id)
}

// Client-side delete fallback
function clientSideDelete(id) {
  let users = JSON.parse(localStorage.getItem("users")) || []
  users = users.filter((user) => user.id !== id)
  localStorage.setItem("users", JSON.stringify(users))

  closeModal(document.getElementById("deleteModal"))
  loadUsers()
}

// Save user
function saveUser() {
  const userId = document.getElementById("userId").value
  const firstName = document.getElementById("firstName").value
  const lastName = document.getElementById("lastName").value
  const email = document.getElementById("email").value
  const phone = document.getElementById("phone").value
  const address = document.getElementById("address").value

  const userData = {
    firstName,
    lastName,
    email,
    phone,
    address,
  }

  if (userId) {
    // Update existing user
    userData.id = Number.parseInt(userId)

    // AJAX call to update user (commented out as backend is not ready)
    /*
    fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Update localStorage after successful update
        updateLocalStorageUser(userData);
        
        closeModal(document.getElementById("userModal"));
        loadUsers();
      })
      .catch(error => {
        console.error('Error updating user:', error);
        // Fall back to client-side update
        updateLocalStorageUser(userData);
        closeModal(document.getElementById("userModal"));
        loadUsers();
      });
    */

    // For now, use client-side update
    updateLocalStorageUser(userData)
  }

  closeModal(document.getElementById("userModal"))
  loadUsers()
}

// Update user in localStorage
function updateLocalStorageUser(userData) {
  const users = JSON.parse(localStorage.getItem("users")) || []
  const index = users.findIndex((user) => user.id === userData.id)

  if (index !== -1) {
    users[index] = {
      ...users[index],
      ...userData,
    }
    localStorage.setItem("users", JSON.stringify(users))
  }
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






