'use strict';
import { Mapper } from './Mapper.js';

export class RedirectButtons {
    static monitorLoginButton() {
        const loginButton = document.getElementById('loginButton');
        if (!loginButton) {
            console.log('Could not locate the login button');
        } else {
            loginButton.addEventListener('click', () => {
                window.location.href = contextPath 
                        + Mapper.USER_LOGIN_PAGE;
            });
        }
    }
    
    static monitorRegisterButton() {
        const registerButton = document.getElementById('registerButton');
        if (!registerButton) {
            console.log('Could not locate the register button');
        } else {
            registerButton.addEventListener('click', () => {
                window.location.href = contextPath 
                        + Mapper.USER_REGISTER_PAGE;
            });
        }
    }
    
    static monitorLogoutButton() {
        const logoutButton = document.getElementById('logoutButton');
        if (!logoutButton) {
            console.log('Could not locate the logout button');
        } else {
            logoutButton.addEventListener('click', () => {
                window.location.href = contextPath + Mapper.LOGOUT_SERVICE;
            });
        }
    }
    
    static monitorProfileButton() {
        const profileButton = document.getElementById('profileButton');
        if (!profileButton) {
            console.log('Could not locate the profile button');
        } else {
            profileButton.addEventListener('click', () => {
                window.location.href = contextPath 
                        + Mapper.VIEW_PROFILE_JSPX;
            });
        }
    }
    
    static monitorCartButton() {
        const cartButton = document.getElementById('cartButton');
        if (!cartButton) {
            console.log('Could not locate the cart button');
        } else {
            cartButton.addEventListener('click', () => {
                window.location.href = contextPath 
                        + Mapper.VIEW_CART_JSPX;
            });
        }
    }
    
    static monitorCheckoutButton() {
        const checkoutButton = document.getElementById('checkoutButton');
        if (!checkoutButton) {
            console.log('Could not locate the checkout button');
        } else {
            checkoutButton.addEventListener('click', () => {
                window.location.href = contextPath 
                        + Mapper.CHECKOUT_PAGE_JSPX;
            });
        }
    }
    
    static monitorViewOrdersButton() {
        const viewOrdersButton = document.getElementById('viewOrdersButton');
        if (!viewOrdersButton) {
            console.log('Could not locate the view orders button');
        } else {
            viewOrdersButton.addEventListener('click', function() {
                window.location.href = contextPath 
                        + Mapper.USER_ORDERS_JSPX;
            });
        }
    }
    
    static monitorViewUserOrderButton() {
        const viewUserOrderButton = document.getElementById('viewUserOrderButton');
        if (!viewUserOrderButton) {
            console.log('Could not locate the view User order button');
        } else {
            viewUserOrderButton.addEventListener('click', function() {
                window.location.href = contextPath 
                        + Mapper.VIEW_ORDER_JSPX;
            });
        }
    }
    
    static monitorViewHistoryButton() {
        const viewHistoryButton = document.getElementById('viewHistoryButton');
        if (!viewHistoryButton) {
            console.log('Could not locate the view history button');
        } else {
            viewHistoryButton.addEventListener('click', function() {
                window.location.href = contextPath 
                        + Mapper.PURCHASE_HISTORY_JSPX;
            });
        }
    }
}

