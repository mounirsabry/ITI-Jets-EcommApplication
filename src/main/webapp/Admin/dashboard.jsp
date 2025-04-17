<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<% String adminUsername;
   HttpSession sessionObj = request.getSession(false);
   adminUsername = (String) sessionObj.getAttribute("adminUsername"); %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookStore Admin - Dashboard</title>
    <link rel="stylesheet" href="CSS/styles.css">
    <link rel="stylesheet" href="CSS/dashboard.css">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
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
                    <li class="active"><a href="dashboard.jsp"><span class="icon">📊</span> Dashboard</a></li>
                    <li><a href="books.jsp"><span class="icon">📚</span> Books</a></li>
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
                <h1>Dashboard</h1>
                <div class="user-info">
                    <span id="currentUser"><%= adminUsername %></span>
                </div>
            </header>
            <!-- Dashboard Content -->
            <div class="dashboard-content">
                <!-- Stats Cards -->
                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-icon">📚</div>
                        <div class="stat-info">
                            <h3>Total Books</h3>
                            <p id="totalBooks">0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">💰</div>
                        <div class="stat-info">
                            <h3>Total Sales</h3>
                            <p id="totalSales">$0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">👥</div>
                        <div class="stat-info">
                            <h3>Registered Users</h3>
                            <p id="totalUsers">0</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">📦</div>
                        <div class="stat-info">
                            <h3>Pending Orders</h3>
                            <p id="pendingOrders">0</p>
                        </div>
                    </div>
                </div>
                <!-- Charts Section -->
                <div class="charts-container">
                    <div class="chart-card">
                        <h3>Sales Overview</h3>
                        <canvas id="salesChart"></canvas>
                    </div>
                    <div class="chart-card">
                        <h3>Top Selling Books</h3>
                        <canvas id="booksChart"></canvas>
                    </div>
                </div>
            </div>
        </main>
    </div>
        <script>
            const contextPath = "${pageContext.request.contextPath}";
        </script>
    <script src="JavaScript/common.js"></script>
    <script src="JavaScript/dashboards.js"></script>
</body>
</html>