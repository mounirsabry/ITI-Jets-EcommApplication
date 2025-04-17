'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import DataValidator from './Utils/DataValidator.js';

import { ProfileManager } from "./Managers/ProfileManager.js";
import UserAuthTracker from "./Common/UserAuthTracker.js";
import User from "./Models/User.js";
import MessagePopup from "./Common/MessagePopup.js";

document.addEventListener('DOMContentLoaded', function () {
    checkForErrorMessageParameter();

    const viewOrdersButton = document.getElementById('viewOrders');
    const viewPurchaseHistoryButton = document.getElementById('viewPurchaseHistory');
    const viewWishList = document.getElementById('viewWishList');

    const popupOverlay = document.querySelector('.popup-overlay');

    const passwordPopup = document.getElementById('passwordPopup');
    const openChangePasswordPopupButton = document.getElementById('openChangePasswordPopupButton');
    const passwordChangeError = document.getElementById('passwordChangeError');
    const currentPasswordInput = document.getElementById('currentPassword');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const confirmPasswordChange = document.getElementById('confirmPasswordChangeButton');
    const cancelPasswordChangeButton = document.getElementById('cancelPasswordChangeButton');

    const displayEmail = document.getElementById('displayEmail');
    const emailPopup = document.getElementById('emailPopup');
    const openChangeEmailPopupButton = document.getElementById('openChangeEmailPopupButton');
    const emailChangeError = document.getElementById('emailChangeError');
    const emailInput = document.getElementById('newEmail');
    const confirmEmailUpdate = document.getElementById('confirmEmailUpdate');
    const cancelEmailUpdate = document.getElementById('cancelEmailUpdate');

    const editProfileForm = document.getElementById('editProfileForm');
    const editUserName = document.getElementById('editUserName');
    const editPhone = document.getElementById('editPhone');
    const editAddress = document.getElementById('editAddress');
    const editBirthDate = document.getElementById('editBirthDate');
    const profileChangesError = document.getElementById('profileChangesError');

    viewOrdersButton.addEventListener('click', function () {
        window.location.href = URL_Mapper.ORDERS;
    });
    
    viewPurchaseHistoryButton.addEventListener('click', function () {
        window.location.href = URL_Mapper.PURCHASE_HISTORY;
    });

    viewWishList.addEventListener('click', function () {
        window.location.href = URL_Mapper.WISH_LIST;
    })

    function updateProfile(userObject) {
        displayEmail.textContent = userObject.email;
        editUserName.value = userObject.userName;
        editPhone.value = userObject.phoneNumber;
        editAddress.value = userObject.address;

        let birthDate = new Date(userObject.birthDate);
        birthDate = birthDate.toISOString().split('T')[0];
        editBirthDate.value = birthDate;
    }

    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }
    updateProfile(userObject);

    function refreshUserProfileOnSuccess(user) {
        let parsedUser;
        try {
            parsedUser = User.fromJSON(user);
        } catch (_) {
            console.error('Could not parse user object in refresh profile function.');
        }

        UserAuthTracker.userObject = parsedUser;
        updateProfile(parsedUser);
    }

    ProfileManager.getProfile(userObject.userID, refreshUserProfileOnSuccess, null);

    popupOverlay.classList.add('hidden');
    popupOverlay.addEventListener('click', () => {
        if (!passwordPopup.classList.contains('hidden')) { // The change password popup is visible.
            closePasswordPopup();
        }
        else if (!emailPopup.classList.contains('hidden')) { // The change email popup is visible.
            closeEmailPopup();
        }
    });

    function closePasswordPopup() {
        currentPasswordInput.value = '';
        newPasswordInput.value = '';
        confirmPasswordInput.value = '';
        passwordChangeError.textContent = '';
        
        passwordPopup.classList.add('hidden');
        popupOverlay.classList.add('hidden');
    }

    function closeEmailPopup() {
        emailChangeError.textContent = '';        
        emailInput.value = '';
        
        emailPopup.classList.add('hidden');
        popupOverlay.classList.add('hidden');
    }

    // Open Change Password Popup
    openChangePasswordPopupButton.addEventListener('click', function () {
        passwordPopup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');
    });

    // Confirm Password Change
    confirmPasswordChange.addEventListener('click', function () {
        const currentPassword = currentPasswordInput.value.trim();
        const newPassword = newPasswordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();
    
        passwordChangeError.textContent = '';
        let errorMessage = '';
    
        // Validate current password
        if (currentPassword === '') {
            errorMessage = 'Current password cannot be empty.';
        } else if (!DataValidator.isPasswordValid(currentPassword)) {
            errorMessage = 'Invalid current password format. Must be at least 8 characters,' +
                ' includes one uppercase & one lowercase letter.';
        } 
    
        // Validate new password
        else if (newPassword === '') {
            errorMessage = 'New password cannot be empty.';
        } else if (!DataValidator.isPasswordValid(newPassword)) {
            errorMessage = 'Invalid new password format. Must be at least 8 characters,' +
                ' includes one uppercase & one lowercase letter.';
        } 
    
        // Check password match
        else if (newPassword !== confirmPassword) {
            errorMessage = 'New password and confirm password do not match.';
        }
    
        // Show error if any
        if (errorMessage) {
            passwordChangeError.textContent = errorMessage;
            passwordChangeError.style.marginTop = '10px'; // Adjust spacing
            return;
        }

        ProfileManager.updatePassword(userObject.userID, currentPassword, newPassword,
            (data) => {
                MessagePopup.show(data);
                closePasswordPopup();
            }
        );
    });
    

    // Cancel Password Change
    cancelPasswordChangeButton.addEventListener('click', function () {
        closePasswordPopup();
    });

    // Open Email Update Popup
    openChangeEmailPopupButton.addEventListener('click', function () {
        emailPopup.classList.remove('hidden');
        popupOverlay.classList.remove('hidden');
    });

    // Confirm Email Update
    confirmEmailUpdate.addEventListener('click', function () {
        const newEmail = emailInput.value.trim();

        emailChangeError.textContent = '';
        let errorMessage = '';

        if (newEmail === '') {
            errorMessage = 'New email cannot be empty.';
        }
        else if (!DataValidator.isEmailValid(newEmail)) {
            errorMessage = 'Invalid email format.';
        }

        if (errorMessage) {
            emailChangeError.textContent = errorMessage;
            return;
        }

        ProfileManager.updateEmail(userObject.userID, newEmail,
            (data) => {
            MessagePopup.show(data);
            displayEmail.textContent = newEmail;
            closeEmailPopup();
        });
    });

    // Cancel Email Update
    cancelEmailUpdate.addEventListener('click', function () {
        closeEmailPopup();
    });

    editProfileForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const userNameValue = editUserName.value.trim();
        const phoneValue = editPhone.value.trim();
        const addressValue = editAddress.value.trim();
        const birthDateValue = editBirthDate.value;

        profileChangesError.textContent = '';
        let errorMessage = '';

        if (userNameValue === '') {
            errorMessage = 'User name cannot be empty.';
        }
        else if (!DataValidator.isUserNameValid(userNameValue)) {
            errorMessage = 'Invalid user name.';
        }

        else if (phoneValue === '') {
            errorMessage = 'Phone number cannot be empty.';
        }
        else if (!DataValidator.isPhoneValid(phoneValue)) {
            errorMessage = 'Invalid phone number.';
        }

        else if (addressValue === '') {
            errorMessage = 'Address cannot be empty.';
        }
        else if (!DataValidator.isAddressValid(addressValue)) {
            errorMessage = 'Invalid address.';
        }

        else if (!birthDateValue) {
            errorMessage = 'Birth date cannot be empty.';
        } else if (!DataValidator.isDateValid(birthDateValue)) {
            errorMessage = 'Birth date is not a valid date.';
        } else if (!DataValidator.isBirthDateValid(birthDateValue)) {
            errorMessage = 'Age must be at least 10 years old.';
        }

        if (errorMessage) {
            profileChangesError.textContent = errorMessage;
            return;
        }

        const updatedDetails = {
            userName: userNameValue,
            phoneNumber: phoneValue,
            address: addressValue,
            birthDate: birthDateValue,
        }

        ProfileManager.updateDetails(userObject.userID, updatedDetails,
            (user) => {
                MessagePopup.show('Profile info updated successfully!');
                refreshUserProfileOnSuccess(user);
            }
        );

        profileChangesError.textContent = '';
    });
});
