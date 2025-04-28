<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
    import="jakarta.servlet.http.HttpSession, jets.projects.admin_user.AdminURLMapper" %>
    <% String adminUsername=null; HttpSession currentSession=request.getSession(false); if (currentSession!=null) {
        currentSession.invalidate(); } %>
        <!DOCTYPE html>
        <html lang="en">

        <head>

            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>BookStore Admin - Login</title>
            <link rel="stylesheet" href="CSS/styles.css">
            <link rel="stylesheet" href="CSS/login.css">
            <link rel="stylesheet"
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap">
            <style>
                .login-page {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    background-color: #f5f7fb;
                }

                .login-container {
                    width: 100%;
                    max-width: 400px;
                    padding: 1rem;
                }

                .login-card {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }

                .login-header {
                    padding: 2rem;
                    text-align: center;
                    background-color: var(--light-gray);
                }

                .login-header h1 {
                    margin-bottom: 0.5rem;
                    color: var(--primary-color);
                }

                .login-header p {
                    color: var(--gray-color);
                }

                .login-form {
                    padding: 2rem;
                }

                .login-form .form-group {
                    margin-bottom: 1.5rem;
                }

                .login-form .btn {
                    width: 100%;
                    padding: 0.75rem;
                }


                /* Global Styles */
                :root {
                    --primary-color: #4361ee;
                    --primary-hover: #3a56d4;
                    --secondary-color: #2b2d42;
                    --accent-color: #f72585;
                    --success-color: #2ecc71;
                    --warning-color: #f39c12;
                    --danger-color: #e74c3c;
                    --danger-hover: #c0392b;
                    --light-color: #f8f9fa;
                    --dark-color: #343a40;
                    --gray-color: #6c757d;
                    --light-gray: #e9ecef;
                    --border-color: #dee2e6;
                    --sidebar-width: 250px;
                    --sidebar-collapsed-width: 70px;
                    --header-height: 60px;
                    --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                    --hover-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    --transition: all 0.3s ease;
                }

                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }

                body {
                    font-family: "Inter", sans-serif;
                    font-size: 14px;
                    line-height: 1.5;
                    color: var(--dark-color);
                    background-color: #f5f7fb;
                }

                a {
                    text-decoration: none;
                    color: inherit;
                }

                ul {
                    list-style: none;
                }

                /* Button Styles */
                .btn {
                    display: inline-block;
                    padding: 0.5rem 1rem;
                    border-radius: 4px;
                    border: 1px solid var(--border-color);
                    background-color: white;
                    color: var(--dark-color);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn:hover {
                    background-color: var(--light-gray);
                    transform: translateY(-1px);
                    box-shadow: var(--shadow);
                }

                .btn:active {
                    transform: translateY(0);
                }

                .btn-primary {
                    background-color: var(--primary-color);
                    color: white;
                    border-color: var(--primary-color);
                }

                .btn-primary:hover {
                    background-color: var(--primary-hover);
                }

                .btn-danger {
                    background-color: var(--danger-color);
                    color: white;
                    border-color: var(--danger-color);
                }

                .btn-danger:hover {
                    background-color: var(--danger-hover);
                }

                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                    transform: none;
                    box-shadow: none;
                }

                /* Form Styles */
                .form-group {
                    margin-bottom: 1rem;
                }

                .form-row {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .form-row .form-group {
                    flex: 1;
                    margin-bottom: 0;
                }

                label {
                    display: block;
                    margin-bottom: 0.5rem;
                    font-weight: 500;
                }

                input,
                select,
                textarea {
                    width: 100%;
                    padding: 0.5rem;
                    border: 1px solid var(--border-color);
                    border-radius: 4px;
                    font-family: inherit;
                    font-size: inherit;
                    transition: var(--transition);
                }

                input:hover,
                select:hover,
                textarea:hover {
                    border-color: var(--gray-color);
                }

                input:focus,
                select:focus,
                textarea:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px rgba(67, 97, 238, 0.2);
                }

                .form-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 1rem;
                    margin-top: 1rem;
                }

                /* Layout Styles */
                .admin-container {
                    display: flex;
                    min-height: 100vh;
                }

                /* Sidebar Styles */
                .sidebar {
                    width: var(--sidebar-width);
                    background-color: white;
                    border-right: 1px solid var(--border-color);
                    transition: var(--transition);
                    z-index: 100;
                }

                .sidebar-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                    height: var(--header-height);
                }

                .sidebar-toggle {
                    display: none;
                    background: none;
                    border: none;
                    cursor: pointer;
                }

                .sidebar-toggle span {
                    display: block;
                    width: 20px;
                    height: 2px;
                    background-color: var(--dark-color);
                    margin: 4px 0;
                    transition: var(--transition);
                }

                .sidebar-toggle:hover span {
                    background-color: var(--primary-color);
                }

                .sidebar-nav ul {
                    padding: 1rem 0;
                }

                .sidebar-nav li {
                    margin-bottom: 0.5rem;
                }

                .sidebar-nav a {
                    display: flex;
                    align-items: center;
                    padding: 0.75rem 1rem;
                    color: var(--secondary-color);
                    transition: var(--transition);
                    border-left: 3px solid transparent;
                }

                .sidebar-nav a:hover {
                    background-color: var(--light-gray);
                    border-left-color: var(--primary-color);
                    color: var(--primary-color);
                }

                .sidebar-nav li.active a {
                    background-color: var(--light-gray);
                    color: var(--primary-color);
                    font-weight: 500;
                    border-left-color: var(--primary-color);
                }

                .sidebar-nav .icon {
                    margin-right: 0.75rem;
                    font-size: 1.2rem;
                }

                .sidebar-nav .logout {
                    margin-top: 2rem;
                    border-top: 1px solid var(--border-color);
                    padding-top: 1rem;
                }

                .sidebar-nav .logout a:hover {
                    background-color: rgba(231, 76, 60, 0.1);
                    border-left-color: var(--danger-color);
                    color: var(--danger-color);
                }

                /* Main Content Styles */
                .main-content {
                    flex: 1;
                    padding: 1rem;
                    overflow-x: hidden;
                }

                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .user-info {
                    display: flex;
                    align-items: center;
                }

                /* Table Styles */
                .table-container {
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                    overflow-x: auto;
                    transition: var(--transition);
                }

                .table-container:hover {
                    box-shadow: var(--hover-shadow);
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    padding: 0.75rem 1rem;
                    text-align: left;
                    border-bottom: 1px solid var(--border-color);
                }

                th {
                    background-color: var(--light-gray);
                    font-weight: 600;
                }

                tr:last-child td {
                    border-bottom: none;
                }

                tr:hover td {
                    background-color: rgba(67, 97, 238, 0.05);
                }

                /* Action Bar Styles */
                .action-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1rem;
                }

                .search-container {
                    display: flex;
                    gap: 0.5rem;
                }

                .search-container input {
                    width: 250px;
                }

                /* Modal Styles */
                .modal {
                    display: none;
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    z-index: 1000;
                }

                .modal-content {
                    position: relative;
                    background-color: white;
                    margin: 5% auto;
                    padding: 0;
                    width: 80%;
                    max-width: 700px;
                    border-radius: 8px;
                    box-shadow: var(--shadow);
                    animation: modalFadeIn 0.3s;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1rem;
                    border-bottom: 1px solid var(--border-color);
                }

                .modal-body {
                    padding: 1rem;
                    max-height: 70vh;
                    overflow-y: auto;
                }

                .close {
                    font-size: 1.5rem;
                    font-weight: bold;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .close:hover {
                    color: var(--primary-color);
                }

                @keyframes modalFadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px);
                    }

                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                /* Status Badges */
                .status-badge {
                    display: inline-block;
                    padding: 0.25rem 0.5rem;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    transition: var(--transition);
                }

                .status-badge:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                .status-pending {
                    background-color: #fff3cd;
                    color: #856404;
                }

                .status-shipped {
                    background-color: #cce5ff;
                    color: #004085;
                }

                .status-delivered {
                    background-color: #d4edda;
                    color: #155724;
                }

                .status-canceled {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                .status-available {
                    background-color: #d4edda;
                    color: #155724;
                }

                .status-unavailable {
                    background-color: #f8d7da;
                    color: #721c24;
                }

                /* Utility Classes */
                .hidden {
                    display: none !important;
                }

                .error-message {
                    color: var(--danger-color);
                    margin-top: 0.5rem;
                }

                /* Responsive Styles */
                @media (max-width: 992px) {
                    .sidebar {
                        position: fixed;
                        left: -100%;
                        height: 100%;
                    }

                    .sidebar.active {
                        left: 0;
                    }

                    .sidebar-toggle {
                        display: block;
                    }

                    .main-content {
                        margin-left: 0;
                    }

                    .form-row {
                        flex-direction: column;
                        gap: 0;
                    }

                    .modal-content {
                        width: 95%;
                    }
                }

                @media (max-width: 768px) {
                    .action-bar {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 1rem;
                    }

                    .search-container {
                        width: 100%;
                    }

                    .search-container input {
                        width: 100%;
                    }
                }
            </style>

        </head>

        <body class="login-page">


            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <h1>BookStore Admin</h1>
                        <p>Enter your credentials to access the admin panel</p>
                    </div>
                    <form id="loginForm" class="login-form" action="../Admin/Login" method="POST">
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" name="username" required>
                        </div>
                        <div class="form-group">
                            <label for="password">Password</label>
                            <input type="password" id="password" name="password" required>
                        </div>
                        <div class="form-group">
                            <button type="submit" class="btn btn-primary">Login</button>
                        </div>
                        <div id="loginError" class="error-message"></div>
                    </form>
                </div>
            </div>



        </body>

        </html>