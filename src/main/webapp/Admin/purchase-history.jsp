<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<% 
    HttpSession sessionObj = request.getSession(false);
    String adminUsername = (String) sessionObj.getAttribute("adminUsername");
%>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookStore Admin - Purchase History</title>
    <link rel="stylesheet" href="CSS/styles.css">
    <link rel="stylesheet" href="CSS/purchase-history.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
</head>
<body>
<div class="admin-container">
    <aside class="sidebar" style="position: sticky; top: 0;">
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
                <li><a href="books.jsp"><span class="icon">📚</span> Books</a></li>
                <li><a href="orders.jsp"><span class="icon">📦</span> Orders</a></li>
                <li><a href="users.jsp"><span class="icon">👥</span> Users</a></li>
                <li><a href="discounts.jsp"><span class="icon">🏷️</span> Discounts</a></li>
                <li class="active"><a href="purchase-history.jsp"><span class="icon">📝</span> Purchase History</a></li>
                <li class="logout"><a href="#" id="logoutBtn"><span class="icon">🚪</span> Logout</a></li>
            </ul>
        </nav>
    </aside>

    <main class="main-content">
        <header class="content-header">
            <h1>Purchase History</h1>
            <div class="user-info">
                <span id="currentUser"><%= adminUsername %></span>
            </div>
        </header>

        <div class="purchase-history-content">
            <div class="action-bar">
                <div class="date-filter-container">
                    <label for="dateFrom">From:</label>
                    <input type="date" id="dateFrom">
                    <label for="dateTo">To:</label>
                    <input type="date" id="dateTo">
                    <button id="applyDateFilter" class="btn">Apply Filter</button>
                    <button id="resetFilters" class="btn">Reset Filters</button>
                </div>
                <div class="search-container">
                    <input type="text" id="purchaseSearch" placeholder="Search by user or receipt ID...">
                    <button id="searchBtn" class="btn">Search</button>
                </div>
            </div>

            <div class="stats-container">
                <div class="stat-card">
                    <div class="stat-icon">📊</div>
                    <div class="stat-info">
                        <h3>Total Purchases</h3>
                        <p id="totalPurchases">0</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">💰</div>
                    <div class="stat-info">
                        <h3>Total Revenue</h3>
                        <p id="totalRevenue">$0</p>
                    </div>
                </div>
                <div class="stat-card">
                    <div class="stat-icon">👤</div>
                    <div class="stat-info">
                        <h3>Unique Customers</h3>
                        <p id="uniqueCustomers">0</p>
                    </div>
                </div>
            </div>

            <div class="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Total Paid</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody id="purchaseHistoryTable">
                    </tbody>
                </table>
            </div>

            <div class="pagination">
                <button id="prevPage" class="btn">Previous</button>
                <span id="currentPage">Page 1 of 1</span>
                <button id="nextPage" class="btn">Next</button>
            </div>
        </div>
    </main>
</div>

<script>
    const contextPath = "${pageContext.request.contextPath}";
</script>
<script src="JavaScript/common.js"></script>
<script src="JavaScript/purchaseHistory_.js"></script>
</body>
</html>