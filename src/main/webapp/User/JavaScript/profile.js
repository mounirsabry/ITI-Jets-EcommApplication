'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import DataValidator from './Utils/DataValidator.js';
import ProfileManager from "./Managers/ProfileManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import User from "./Models/User.js";
import MessagePopup from "./Common/MessagePopup.js";
import { populateYearSelect } from "./Utils/UICommonFunctions.js";

// Helper methods.
function validatePasswordChange(currentPassword, newPassword, confirmPassword) {
    if (!currentPassword) return { isValid: false, message: 'Current password cannot be empty.' };
    if (!DataValidator.isPasswordValid(currentPassword)) {
        return {
            isValid: false,
            message: 'Invalid current password format. Must be at least 8 characters,' +
                ' includes one uppercase & one lowercase letter.'
        };
    }
    if (!newPassword) return { isValid: false, message: 'New password cannot be empty.' };
    if (!DataValidator.isPasswordValid(newPassword)) {
        return {
            isValid: false,
            message: 'Invalid new password format. Must be at least 8 characters, includes one uppercase & one lowercase letter.'
        };
    }
    if (newPassword !== confirmPassword) {
        return { isValid: false, message: 'New password and confirm password do not match.' };
    }
    if (currentPassword === newPassword) {
        return { isValid: false, message: 'Current password cannot be the same as new password.' };
    }
    return { isValid: true };
}

function validateEmailChange(email) {
    if (!email) return { isValid: false, message: 'New email cannot be empty.' };
    if (!DataValidator.isEmailValid(email)) {
        return { isValid: false, message: 'Invalid email format.' };
    }
    return { isValid: true };
}

function validateProfileUpdate({ userName, phoneNumber, address, birthDate }) {
    if (!userName) return { isValid: false, message: 'User name cannot be empty.' };
    if (!DataValidator.isUserNameValid(userName)) {
        return { isValid: false, message: 'Invalid user name!' };
    }
    if (!phoneNumber) return { isValid: false, message: 'Phone number cannot be empty!' };
    if (!DataValidator.isPhoneValid(phoneNumber)) {
        return { isValid: false, message: 'Invalid phone number format,' +
                ' phone number must be a valid egyptian mobile number!' };
    }
    if (!address) return { isValid: false, message: 'Address cannot be empty!' };
    if (!DataValidator.isAddressValid(address)) {
        return { isValid: false, message: 'Invalid address!' };
    }
    if (!birthDate) return { isValid: false, message: 'Birth date cannot be empty!' };
    if (!DataValidator.isDateValid(birthDate)) {
        return { isValid: false, message: 'Birth date is not a valid date!' };
    }
    if (!DataValidator.isBirthDateValid(birthDate)) {
        return { isValid: false, message: 'Age must be between 10 and 120!' };
    }
    return { isValid: true };
}

document.addEventListener('DOMContentLoaded', async function () {
    checkForErrorMessageParameter();

    // DOM Elements
    const elements = {
        // Navigation buttons
        viewOrdersButton: document.getElementById('viewOrders'),
        viewPurchaseHistoryButton: document.getElementById('viewPurchaseHistory'),
        viewWishList: document.getElementById('viewWishList'),

        // Popup elements
        popupOverlay: document.querySelector('.popup-overlay'),
        passwordPopup: document.getElementById('passwordPopup'),
        emailPopup: document.getElementById('emailPopup'),

        // Password change elements
        openChangePasswordPopupButton: document.getElementById('openChangePasswordPopupButton'),
        passwordChangeError: document.getElementById('passwordChangeError'),
        currentPasswordInput: document.getElementById('currentPassword'),
        newPasswordInput: document.getElementById('newPassword'),
        confirmPasswordInput: document.getElementById('confirmPassword'),
        confirmPasswordChange: document.getElementById('confirmPasswordChangeButton'),
        cancelPasswordChangeButton: document.getElementById('cancelPasswordChangeButton'),

        // Email change elements
        displayEmail: document.getElementById('displayEmail'),
        openChangeEmailPopupButton: document.getElementById('openChangeEmailPopupButton'),
        emailChangeError: document.getElementById('emailChangeError'),
        emailInput: document.getElementById('newEmail'),
        confirmEmailUpdate: document.getElementById('confirmEmailUpdate'),
        cancelEmailUpdate: document.getElementById('cancelEmailUpdate'),

        // Profile edit elements
        editProfileForm: document.getElementById('editProfileForm'),
        editUserName: document.getElementById('editUserName'),
        editPhone: document.getElementById('editPhone'),
        editAddress: document.getElementById('editAddress'),
        editBirthDate: document.getElementById('editBirthDate'),
        profileChangesError: document.getElementById('profileChangesError'),

        // Balance section.
        balanceInput: document.getElementById('userBalance'),
        rechargeBalanceButton: document.getElementById('rechargeBalanceButton'),

        // Balance recharge popup.
        rechargePopup: document.getElementById('rechargePopup'),
        rechargeAmountInput: document.getElementById('rechargeAmount'),
        confirmRechargeButton: document.getElementById('confirmRecharge'),
        cancelRechargeButton: document.getElementById('cancelRecharge'),

        // Balance recharge form.
        nameOnCardInput: document.getElementById('rechargeNameOnCard'),
        cardNumberInput: document.getElementById('rechargeCardNumber'),
        expiryMonthSelect: document.getElementById('rechargeExpiryMonth'),
        expiryYearSelect: document.getElementById('rechargeExpiryYear'),
        cvcInput: document.getElementById('rechargeCvc')
    };

    // Check if user is authenticated
    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }
    updateUserProfile(userObject);

    // Initialize
    if (elements.expiryYearSelect) {
        populateYearSelect(elements.expiryYearSelect);
    }
    setupEventListeners();
    await loadUserProfile();

    async function loadUserProfile() {
        const response = await ProfileManager.getProfile(userObject.userID);
        if (!response) {
            MessagePopup.show('Unknown error, could not refresh the profile from the server', true);
            return;
        }

        if (!response.success) {
            MessagePopup.show(response.data, true);
            return;
        }

        updateUserProfile(response.data);
    }

    function updateUserProfile(userData) {
        try {
            const parsedUser = User.fromJSON(userData);
            UserAuthTracker.userObject = parsedUser;

            // Update UI
            elements.displayEmail.textContent = parsedUser.email;
            elements.editUserName.value = parsedUser.userName;
            elements.editPhone.value = parsedUser.phoneNumber;
            elements.editAddress.value = parsedUser.address;

            elements.editBirthDate.value
                = new Date(parsedUser.birthDate).toISOString().split('T')[0];

            elements.balanceInput.value = `${parsedUser.accountBalance} EGP`;
        } catch (error) {
            console.error('Could not parse user object:', error);
        }
    }

    function setupEventListeners() {
        // Navigation.
        elements.viewOrdersButton.addEventListener('click',
            () => navigateTo(URL_Mapper.ORDERS));
        elements.viewPurchaseHistoryButton.addEventListener('click',
            () => navigateTo(URL_Mapper.PURCHASE_HISTORY));
        elements.viewWishList.addEventListener('click',
            () => navigateTo(URL_Mapper.WISH_LIST));

        // Popups.
        elements.popupOverlay.addEventListener('click', handleOverlayClick);
        elements.openChangePasswordPopupButton.addEventListener('click',
            () => openPopup('password'));
        elements.openChangeEmailPopupButton.addEventListener('click',
            () => openPopup('email'));

        // Password change.
        elements.confirmPasswordChange.addEventListener('click', handlePasswordChange);
        elements.cancelPasswordChangeButton.addEventListener('click',
            () => closePopup('password'));

        // Email change.
        elements.confirmEmailUpdate.addEventListener('click', handleEmailChange);
        elements.cancelEmailUpdate.addEventListener('click',
            () => closePopup('email'));

        // Profile edit.
        elements.editProfileForm.addEventListener('submit', handleProfileUpdate);

        // Balance recharge.
        elements.rechargeBalanceButton.addEventListener('click',
            () => openPopup('recharge'));
        elements.confirmRechargeButton.addEventListener('click',
            handleRechargeBalance);
        elements.cancelRechargeButton.addEventListener('click',
            () => closePopup('recharge'));
    }

    function navigateTo(url) {
        window.location.href = url;
    }

    function handleOverlayClick() {
        if (!elements.passwordPopup.classList.contains('hidden')) {
            closePopup('password');
        } else if (!elements.emailPopup.classList.contains('hidden')) {
            closePopup('email');
        } else if (!elements.rechargePopup.classList.contains('hidden')) {
            closePopup('recharge');
        }
    }

    function openPopup(type) {
        elements[`${type}Popup`].classList.remove('hidden');
        elements.popupOverlay.classList.remove('hidden');
    }

    function closePopup(type) {
        const popup = elements[`${type}Popup`];
        const errorElement = elements[`${type}Error`] || elements[`${type}ChangeError`];

        if (type === 'password') {
            elements.currentPasswordInput.value = '';
            elements.newPasswordInput.value = '';
            elements.confirmPasswordInput.value = '';
        } else if (type === 'email') {
            elements.emailInput.value = '';
        } else if (type === 'recharge') {
            elements.rechargeAmountInput.value = '';
        }

        if (errorElement) {
            errorElement.textContent = '';
        }

        popup.classList.add('hidden');
        elements.popupOverlay.classList.add('hidden');
    }

    async function handlePasswordChange() {
        const currentPassword = elements.currentPasswordInput.value.trim();
        const newPassword = elements.newPasswordInput.value.trim();
        const confirmPassword = elements.confirmPasswordInput.value.trim();

        const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
        if (!validation.isValid) {
            elements.passwordChangeError.textContent = validation.message;
            return;
        }

        const response = await ProfileManager.updatePassword(
            userObject.userID,
            currentPassword,
            newPassword
        );
        elements.passwordChangeError.textContent = '';

        if (!response) {
            return;
        }

        MessagePopup.show(response.data);
        if (!response.success) {
            return;
        }

        closePopup('password');
    }

    async function handleEmailChange() {
        const newEmail = elements.emailInput.value.trim();

        const validation = validateEmailChange(newEmail);
        if (!validation.isValid) {
            elements.emailChangeError.textContent = validation.message;
            return;
        }

        const response = await ProfileManager.updateEmail(userObject.userID, newEmail);
        elements.emailChangeError.textContent = '';

        if (!response) {
            return;
        }

        MessagePopup.show(response.data);
        if (!response.success) {
            return;
        }

        // Update UI and user object
        elements.displayEmail.textContent = newEmail;
        userObject.email = newEmail;

        closePopup('email');
    }

    async function handleProfileUpdate(event) {
        event.preventDefault();

        const formData = {
            userName: elements.editUserName.value.trim(),
            phoneNumber: elements.editPhone.value.trim(),
            address: elements.editAddress.value.trim(),
            birthDate: elements.editBirthDate.value
        };

        const validation = validateProfileUpdate(formData);
        if (!validation.isValid) {
            elements.profileChangesError.textContent = validation.message;
            return;
        }

        const response = await ProfileManager.updateDetails(userObject.userID, formData);
        if (!response) {
            return;
        }

        if (!response.success) {
            MessagePopup.show(response.data);
            return;
        }

        MessagePopup.show('Profile details updated successfully.');
        updateUserProfile(response.data);
    }

    async function handleRechargeBalance() {
        const amount = parseFloat(elements.rechargeAmountInput.value);

        if (!amount || amount <= 0) {
            MessagePopup.show('Please enter a valid amount!', true);
            return;
        }

        const nameOnCard = elements.nameOnCardInput.value;
        const cardNumber = elements.cardNumberInput.value;
        const expiryMonth = elements.expiryMonthSelect.value;
        const expiryYear = elements.expiryYearSelect.value;
        const cvc = elements.cvcInput.value;

        // Validate required fields
        if (!nameOnCard || !cardNumber || !expiryMonth || !expiryYear || !cvc) {
            MessagePopup.show('Please fill in all payment information!', true);
            return;
        }

        // Validate credit card details
        const creditCardDetails = {
            nameOnCard,
            cardNumber,
            expiryMonth,
            expiryYear: parseInt(expiryYear) + 2000,
            cvc
        };

        const validationError = DataValidator.isCreditCardValid(creditCardDetails);
        if (validationError) {
            MessagePopup.show(validationError);
            return;
        }

        const response = await ProfileManager.rechargeAccountBalanceUsingCreditCard(
            userObject.userID,
            creditCardDetails,
            amount
        );

        if (!response) {
            MessagePopup.show('Unknown error, could not recharge the balance!', true);
            return;
        }

        if (!response.success) {
            MessagePopup.show(response.data, true);
            return;
        }

        MessagePopup.show(response.data);
        closePopup('recharge');

        userObject.accountBalance += amount;
        elements.balanceInput.value = `${userObject.accountBalance} EGP`;
        UserAuthTracker.userObject = userObject;
    }
});