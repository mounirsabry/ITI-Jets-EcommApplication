<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
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

        <script src="JavaScript/login.js"></script>

    </body>

    </html>