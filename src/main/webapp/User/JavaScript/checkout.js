'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import CartManager from "./Managers/CartManager.js";
import OrdersManager from "./Managers/OrdersManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import MessagePopup from "./Common/MessagePopup.js";
import DataValidator from "./Utils/DataValidator.js";

document.addEventListener("DOMContentLoaded", function() {
    checkForErrorMessageParameter();

    // Initialize DOM elements
    const backToCartButton = document.getElementById('backToCart');
    const placeOrderButton = document.getElementById('placeOrderButton');
    const subtotalComponent = document.getElementById('subtotal');
    const shippingFeeComponent = document.getElementById('shippingFee');
    const totalAmountComponent = document.getElementById('totalAmount');
    const addressComponent = document.getElementById('address');
    const accountBalanceElement = document.getElementById('accountBalance');
    const currentBalanceDisplay = document.getElementById('currentBalanceDisplay');
    const deductionAmountDisplay = document.getElementById('deductionAmount');
    const creditCardForm = document.getElementById('creditCardForm');
    const balanceNotice = document.getElementById('balanceNotice');
    const expiryYearSelect = document.getElementById('expiryYear');

    // Initialize variables
    let subtotalAmount = 0;
    let shippingFeeAmount = 0;
    let totalAmount = 0;

    // Check authentication
    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }

    // Setup event listeners
    if (backToCartButton) {
        backToCartButton.addEventListener('click', () => {
            window.location.href = URL_Mapper.CART;
        });
    }

    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', handlePlaceOrder);
    }

    // Populate expiry years (current year + next 10 years)
    if (expiryYearSelect) {
        const currentYear = new Date().getFullYear() - 2000;
        for (let i = 0; i <= 10; i++) {
            const option = document.createElement('option');
            option.value = (currentYear + i).toString().padStart(2, '0');
            option.textContent = option.value;
            expiryYearSelect.appendChild(option);
        }
    }

    // Payment method toggle
    document.querySelectorAll('input[name="paymentMethod"]').forEach(radio => {
        radio.addEventListener('change', updatePaymentUI);
    });

    // Initialize UI
    updatePaymentUI();
    loadUserData();
    loadOrderSummary();

    function updatePaymentUI() {
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;
        if (method === 'creditCard') {
            creditCardForm.style.display = 'block';
            balanceNotice.style.display = 'none';
        } else {
            creditCardForm.style.display = 'none';
            balanceNotice.style.display = 'block';
            updateBalanceDisplay();
        }
    }

    function loadUserData() {
        // Display user address
        if (addressComponent) {
            addressComponent.textContent = userObject.address || 'Unspecified Address';
        }

        // Display account balance
        if (accountBalanceElement && currentBalanceDisplay) {
            const balance = userObject.accountBalance?.toFixed(2) || '0.00';
            accountBalanceElement.textContent = balance;
            currentBalanceDisplay.textContent = balance;
        }
    }

    function loadOrderSummary() {
        // Load subtotal.
        CartManager.getSubtotal(userObject.userID, (data) => {
            const subtotal = data || 0;
            if (subtotalComponent) {
                subtotalComponent.textContent = subtotal.toFixed(2);
            }
            subtotalAmount = subtotal;
            updateTotalAmount();
        }, null);

        // Load shipping fee
        CartManager.getShippingFee(userObject.userID, (data) => {
            const shippingFee = data || 0;
            if (shippingFeeComponent) {
                shippingFeeComponent.textContent = shippingFee.toFixed(2);
            }
            shippingFeeAmount = shippingFee;
            updateTotalAmount();
        }, null);
    }

    function updateTotalAmount() {
        totalAmount = subtotalAmount + shippingFeeAmount;
        if (totalAmountComponent) {
            totalAmountComponent.textContent = totalAmount.toFixed(2);
        }
        if (deductionAmountDisplay) {
            deductionAmountDisplay.textContent = totalAmount.toFixed(2);
        }
    }

    function handlePlaceOrder(event) {
        event.preventDefault();
        const method = document.querySelector('input[name="paymentMethod"]:checked').value;
        const total = subtotalAmount + shippingFeeAmount;

        if (method === 'accountBalance') {
            handleBalancePayment(total);
        } else {
            handleCreditCardPayment();
        }
    }

    function handleBalancePayment(total) {
        if (userObject.accountBalance < total) {
            MessagePopup.show(`Insufficient balance. Your balance is ${userObject.accountBalance.toFixed(2)} EGP`, true);
            return;
        }
        placeOrderWithBalance(userObject.userID, userObject.address, total);
    }

    function handleCreditCardPayment() {
        const formData = new FormData(document.getElementById('paymentForm'));
        const nameOnCard = formData.get('nameOnCard');
        const cardNumber = formData.get('cardNumber');
        const expiryMonth = formData.get('expiryMonth');
        const expiryYear = formData.get('expiryYear');
        const cvc = formData.get('cvc');

        // Validate required fields
        if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
            MessagePopup.show('Please fill in all payment information.', true);
            return;
        }

        // Validate credit card details
        const creditCardDetails = {
            nameOnCard,
            cardNumber,
            expiryMonth,
            expiryYear: expiryYear + 2000,
            cvc
        };

        const validationError = DataValidator.isCreditCardValid(creditCardDetails);
        if (validationError) {
            MessagePopup.show(validationError, true);
            return;
        }

        placeOrderWithCreditCard(userObject.userID, userObject.address, creditCardDetails);
    }

    function handleSuccessfulOrder(message) {
        MessagePopup.show(message);
        setTimeout(() => {
            window.location.href = URL_Mapper.ORDERS;
        }, 5000); // 5 seconds delay
    }

    function placeOrderWithCreditCard(userID, address, creditCardDetails) {
        OrdersManager.checkoutUsingCreditCard(userID, address, creditCardDetails,
            handleSuccessfulOrder, null);
    }

    function placeOrderWithBalance(userID, address) {
        OrdersManager.checkoutUsingAccountBalance(userID, address,
            handleSuccessfulOrder, null);
    }
});