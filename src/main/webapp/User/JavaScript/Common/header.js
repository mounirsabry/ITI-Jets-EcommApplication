'use strict';

import URL_Mapper from '../Utils/URL_Mapper.js';
import UserAuthTracker from './UserAuthTracker.js';
import MessagePopup from '../Common/MessagePopup.js';
import ProfileManager from '../Managers/ProfileManager.js';
import DataValidator from '../Utils/DataValidator.js';
import User from "../Models/User.js";

document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.getElementById('siteHeader');
    if (!headerContainer) {
        console.log('Could not load the header component.');
        return;
    }

    // Function to check if the user should be redirected
    function checkRedirect() {
        const isAuthenticated = UserAuthTracker.isAuthenticated;
        if (isAuthenticated) {
            return;
        }

        const pathName = window.location.pathname;
        if (pathName !== welcomePagePathName
        &&  pathName !== productsPagePathName) {
            window.location.href = URL_Mapper.WELCOME + `?errorMessage=Not Logged In`;
        }
    }
    checkRedirect();

    // Render header based on auth status.
    function renderHeader() {
        const isAuthenticated = UserAuthTracker.isAuthenticated;

        const headerContainer = document.getElementById('siteHeader');
        if (!headerContainer) {
            console.log('Could not load the header component.');
            return;
        }

        headerContainer.innerHTML = `
            <div class='logo-container'>
                <a href='${URL_Mapper.WELCOME}'>
                    <img src='${URL_Mapper.ASSETS.LOGO}' alt='Book Alley Logo'>
                </a>
            </div>
            <div class='site-title'>Book Alley</div>
            <nav class='navbar'>
                ${isAuthenticated ? `
                    <a href='${URL_Mapper.PROFILE}'>
                        <img src='${URL_Mapper.ICONS.USER}' class='user-icon' alt='Person Icon' />
                        Profile
                    </a>
                    <button class='cart-button'>
                        <img src='${URL_Mapper.ICONS.CART}' alt='Cart' />
                    </button>
                    <button class='auth-button logout-button'>Logout</button>
                ` : `
                    <button class='auth-button login-button'>Login</button>
                    <button class='auth-button register-button'>Register</button>
                `}
            </nav>

            <!-- Login Popup -->
            <div class='header-popup-overlay hidden' id='loginOverlay'></div>
            <div class='header-popup hidden' id='loginPopup'>
                <button class='header-close-popup'>×</button>
                <div class='header-popup-content'>
                    <h3>Login</h3>
                    <form id='loginForm'>
                        <input type='email' placeholder='Email' required>
                        <input type='password' placeholder='Password' required>
                        <div class='header-popup-buttons'>
                            <button type='submit'>Login</button>
                            <button type='button' class='header-close-popup'>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Register Popup -->
            <div class='header-popup-overlay hidden' id='registerOverlay'></div>
            <div class='header-popup hidden' id='registerPopup'>
                <button class='header-close-popup'>×</button>
                <div class='header-popup-content'>
                    <h3>Register</h3>
                    <form id='registerForm'>
                        <input type='email' placeholder='Email' required>
                        <input type='password' placeholder='Password' required>
                        <input type='password' placeholder='Confirm Password' required>
                        <input type='text' placeholder='User Name' required>
                        <input type='text' placeholder='Phone Number' required>
                        <input type='text' placeholder='Address' required>
                        <input type='date' placeholder='Birth Date' required>
                        <div class='header-popup-buttons'>
                            <button type='submit'>Register</button>
                            <button type='button' class='header-close-popup'>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;

        const siteTitle = document.querySelector('.site-title');
        if (siteTitle) {
            siteTitle.addEventListener('click', () => {
                window.location.href = URL_Mapper.PRODUCTS;
            });
        }

        // Add event listeners
        if (isAuthenticated) {
            const cartButton = headerContainer.querySelector('.cart-button');
            if (cartButton) {
                cartButton.addEventListener('click', () => {
                    window.location.href = URL_Mapper.CART;
                });
            }

            const logoutButton = headerContainer.querySelector('.logout-button');
            if (logoutButton) {
                logoutButton.addEventListener('click', handleLogout);
            }
        } else {
            // Login button
            headerContainer.querySelector('.login-button')?.addEventListener('click', () => {
                document.getElementById('loginOverlay').classList.remove('hidden');
                document.getElementById('loginPopup').classList.remove('hidden');
            });

            // Register button
            headerContainer.querySelector('.register-button')?.addEventListener('click', () => {
                document.getElementById('registerOverlay').classList.remove('hidden');
                document.getElementById('registerPopup').classList.remove('hidden');
            });
        }

        // Close popup handlers
        document.querySelectorAll('.header-close-popup').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.header-popup, .header-popup-overlay').forEach(el => {
                    el.classList.add('hidden');
                });
            });
        });

        // Form submissions
        document.getElementById('loginForm')?.addEventListener('submit', handleLogin);
        document.getElementById('registerForm')?.addEventListener('submit', handleRegister);
    }

    async function handleLogin(e) {
        e.preventDefault();
        const [email, password] = Array.from(e.target.elements).map(el => el.value);

        if (!DataValidator.isEmailValid(email)) {
            MessagePopup.show('Invalid email!', true);
            return;
        }

        if (!DataValidator.isPasswordValid(password)) {
            MessagePopup.show('Invalid password!', true);
            return;
        }

        try {
            const response = await ProfileManager.login(email, password);
            if (!response || !response.success) {
                MessagePopup.show(response?.data || 'Login failed', true);
                return;
            }

            let parsedUser;
            try {
                parsedUser = User.fromJSON(response.data);
            } catch (e) {
                console.error('Could not parse user object:', e);
                MessagePopup.show('Invalid user data', true);
                return;
            }

            UserAuthTracker.userObject = parsedUser;
            renderHeader();
            MessagePopup.show('Login successful!', false);
        } catch (error) {
            console.error('Login error:', error);
            MessagePopup.show('Login failed', true);
        }
    }

    async function handleRegister(e) {
        e.preventDefault();
        const [email, password, confirmPassword, userName, phoneNumber, address, birthDate] =
            Array.from(e.target.elements).map(el => el.value);

        if (!DataValidator.isEmailValid(email)) {
            MessagePopup.show('Invalid email!', true);
            return;
        }

        if (!DataValidator.isPasswordValid(password)) {
            MessagePopup.show('Invalid password!', true);
            return;
        }

        if (password !== confirmPassword) {
            MessagePopup.show(`Passwords don't match!`, true);
            return;
        }

        if (!DataValidator.isUserNameValid(userName)) {
            MessagePopup.show('Invalid user name!', true);
            return;
        }

        if (!DataValidator.isPhoneValid(phoneNumber)) {
            MessagePopup.show('Invalid phone number!', true);
            return;
        }

        if (!DataValidator.isAddressValid(address)) {
            MessagePopup.show('Invalid address!', true);
            return;
        }

        if (!DataValidator.isBirthDateValid(birthDate)) {
            MessagePopup.show('Invalid birth date!', true);
            return;
        }

        const userData = {
            email,
            password,
            userName,
            phoneNumber,
            address,
            birthDate
        };

        try {
            const response = await ProfileManager.register(userData);
            if (!response || !response.success) {
                MessagePopup.show(response?.data || 'Registration failed', true);
                return;
            }

            let parsedUser;
            try {
                parsedUser = User.fromJSON(response.data);
            } catch (e) {
                console.error('Could not parse user object:', e);
                MessagePopup.show('Invalid user data', true);
                return;
            }

            UserAuthTracker.userObject = parsedUser;
            renderHeader();
            MessagePopup.show('Registration successful!', false);
        } catch (error) {
            console.error('Registration error:', error);
            MessagePopup.show('Registration failed', true);
        }
    }

    function handleLogout() {
        UserAuthTracker.userObject = null;
        window.location.href = URL_Mapper.WELCOME;
        // renderHeader();
        // MessagePopup.show('Logout successful!', false);
    }

    // Initial render
    renderHeader();

    // Listen for auth changes.
    UserAuthTracker.onAuthChange = renderHeader;
});
