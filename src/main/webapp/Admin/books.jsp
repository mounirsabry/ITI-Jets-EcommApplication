<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
    <% String adminUsername; HttpSession sessionObj=request.getSession(false); adminUsername=(String)
        sessionObj.getAttribute("adminUsername") ; %>
        <!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BookStore Admin - Books Management</title>
            <link rel="stylesheet" href="CSS/styles.css">
            <link rel="stylesheet" href="CSS/books.css">
            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
        </head>

        <body onload="connect()">
            <div class="admin-container">
                <!-- Sidebar Navigation -->
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>BookStore</h2>
                        <button id="sidebarToggle" class="sidebar-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                    <nav class="sidebar-nav">
                        <ul>
                            <li><a href="dashboard.jsp"><span class="icon">📊</span> Dashboard</a></li>
                            <li class="active"><a href="books.jsp"><span class="icon">📚</span> Books</a></li>
                            <li><a href="orders.jsp"><span class="icon">📦</span> Orders</a></li>
                            <li><a href="users.jsp"><span class="icon">👥</span> Users</a></li>
                            <li><a href="discounts.jsp"><span class="icon">🏷️</span> Discounts</a></li>
                            <li><a href="purchase-history.jsp"><span class="icon">📝</span> Purchase History</a></li>
                            <li class="logout"><a href="#" id="logoutBtn"><span class="icon">🚪</span> Logout</a></li>
                        </ul>
                    </nav>
                </aside>

                <!-- Main Content -->
                <main class="main-content">
                    <header class="content-header">
                        <h1>Books Management</h1>
                        <div class="user-info">
                            <span id="currentUser">
                                <%=adminUsername%>
                            </span>
                        </div>
                    </header>

                    <!-- Books Content -->
                    <div class="books-content">
                        <!-- Action Bar -->
                        <div class="action-bar">
                            <button id="addBookBtn" class="btn btn-primary">Add New Book</button>
                            <div class="search-container">
                                <input type="text" id="bookSearch" placeholder="Search books...">
                                <button id="searchBtn" class="btn">Search</button>
                            </div>
                        </div>

                        <!-- Books Table -->
                        <div class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cover</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Genre</th>
                                        <th>Price</th>
                                        <th>Discount</th>
                                        <th>Quantity</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody id="booksTable">
                                    <!-- Books will be loaded here -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>

            <!-- Add/Edit Book Modal -->
            <div id="bookModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="modalTitle">Add New Book</h2>
                        <span class="close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <form id="bookForm">
                            <input type="hidden" id="bookId">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="title">Title*</label>
                                    <input type="text" id="title" name="title" required>
                                </div>
                                <div class="form-group">
                                    <label for="author">Author*</label>
                                    <input type="text" id="author" name="author" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="publisher">Publisher*</label>
                                    <input type="text" id="publisher" name="publisher" required>
                                </div>
                                <div class="form-group">
                                    <label for="isbn">ISBN*</label>
                                    <input type="text" id="isbn" name="isbn" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="publicationDate">Publication Date*</label>
                                    <input type="date" id="publicationDate" name="publicationDate" required>
                                </div>
                                <div class="form-group">
                                    <label for="language">Language*</label>
                                    <select id="language" name="language" required>
                                        <option value="">Select Language</option>
                                        <option value="English">English</option>
                                        <option value="Spanish">Spanish</option>
                                        <option value="French">French</option>
                                        <option value="German">German</option>
                                        <option value="Chinese">Chinese</option>
                                        <option value="Japanese">Japanese</option>
                                        <option value="Arabic">Arabic</option>
                                        <option value="Russian">Russian</option>
                                        <option value="Portuguese">Portuguese</option>
                                        <option value="Italian">Italian</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="genre">Genre*</label>
                                    <select id="genre" name="genre" required>
                                        <option value="">Select Genre</option>
                                        <option value="Fiction">Fiction</option>
                                        <option value="Non-Fiction">Non-Fiction</option>
                                        <option value="Science Fiction">Science Fiction</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="Biography">Biography</option>
                                        <option value="History">History</option>
                                        <option value="Self-Help">Self-Help</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="pages">Number of Pages*</label>
                                    <input type="number" id="pages" name="pages" min="1" required>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="price">Price ($)*</label>
                                    <input type="number" id="price" name="price" step="0.01" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label for="discount">Discount (%)</label>
                                    <input type="number" id="discount" name="discount" min="0" max="100" value="0">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="quantity">Quantity*</label>
                                    <input type="number" id="quantity" name="quantity" min="0" required>
                                </div>
                                <div class="form-group">
                                    <label for="status">Status*</label>
                                    <select id="status" name="status" required>
                                        <option value="Available">Available</option>
                                        <option value="Not Available">Not Available</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="mainImage">Main Image*</label>
                                <input type="file" id="mainImage" name="mainImage" accept="image/*">
                                <div id="mainImagePreview" class="image-preview"></div>
                            </div>
                            <div class="form-group">
                                <label for="image1">Image 1</label>
                                <input type="file" id="image1" name="image1" accept="image/*">
                                <div id="image1Preview" class="image-preview"></div>
                            </div>
                            <div class="form-group">
                                <label for="image2">Image 2</label>
                                <input type="file" id="image2" name="image2" accept="image/*">
                                <div id="image2Preview" class="image-preview"></div>
                            </div>
                            <div class="form-group">
                                <label for="image3">Image 3</label>
                                <input type="file" id="image3" name="image3" accept="image/*">
                                <div id="image3Preview" class="image-preview"></div>
                            </div>
                            <div class="form-group">
                                <label for="image4">Image 4</label>
                                <input type="file" id="image4" name="image4" accept="image/*">
                                <div id="image4Preview" class="image-preview"></div>
                            </div>
                            <div class="form-group">
                                <label for="overview">Overview</label>
                                <textarea id="overview" name="overview" rows="4"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="description">Description</label>
                                <textarea id="description" name="description" rows="4"></textarea>
                            </div>
                            <div class="form-actions">
                                <button type="button" id="cancelBtn" class="btn">Cancel</button>
                                <button type="submit" class="btn btn-primary">Save Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div id="deleteModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h2>Confirm Deletion</h2>
                        <span class="close">&times;</span>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure you want to delete this book? This action cannot be undone.</p>
                        <div class="form-actions">
                            <button type="button" id="cancelDeleteBtn" class="btn">Cancel</button>
                            <button type="button" id="confirmDeleteBtn" class="btn btn-danger">Delete</button>
                        </div>
                    </div>
                </div>
            </div>

            <script src="JavaScript/common.js"></script>
            <script src="JavaScript/books_.js"></script>
        </body>

        </html>