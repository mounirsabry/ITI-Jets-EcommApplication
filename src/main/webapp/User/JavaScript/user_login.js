'use strict';
import { RedirectButtons } from './Modules/RedirectButtons.js';
import { ErrorHandler } from './Modules/ErrorHandler.js';

window.addEventListener('load', () => {
    const errorDiv = document.querySelector('.error-div');
    let errorHandler = null;
    if (errorDiv) {
        errorHandler = new ErrorHandler(errorDiv);
    }
    
    RedirectButtons.monitorRegisterButton();
    
    const form = document.getElementById('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    
    
    const urlParams = new URLSearchParams(window.location.search);
    const errorMessage = urlParams.get("errorMessage");
    if (errorMessage && errorDiv && errorHandler) {
        errorHandler.putError(errorMessage);
    }

    
    let isElementsRead = true;
    if (!form || !errorDiv
    || !emailInput || !passwordInput) {
        console.log('Could not load some of the form inputs.');
        isElementsRead = false;
    }
    
    if (form) {
        form.addEventListener('submit', handleSubmit);
    }
    
    function handleSubmit(event) {
        if (!isElementsRead || !errorHandler) {
            console.log('Form will not submit.');
            event.preventDefault();
        }
        errorHandler.clearError();
        
        const email = emailInput.value;
        const password = passwordInput.value;
        
        if (email === '') {
            putError('Email Required!');
            event.preventDefault();
            return;
        }
        
        if (password === '') {
            errorHandler.putError('Password Required!');
            event.preventDefault();
            return;
        }
    }
});