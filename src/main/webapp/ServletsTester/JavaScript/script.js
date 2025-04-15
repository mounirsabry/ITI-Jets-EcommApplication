'use strict';

import BooksManager from './Managers/BooksManager.js';
import CartManager from './Managers/CartManager.js';
import OrdersManager from './Managers/OrdersManager.js';
import ProfileManager from './Managers/ProfileManager.js';
import WishListManager from './Managers/WishListManager.js';
import PurchaseHistoryManager from "./Managers/PurchaseHistoryManager.js";

function displayOutput(outputElement, data) {
    try {
        //data = JSON.parse(data);
        data = (typeof data === 'string')
            ? JSON.parse(data)
            : data;
    } catch (_) {
        data = { error: "Invalid JSON response!" };
    }
    outputElement.textContent = JSON.stringify(data, null, 2);
}

function handleError(errorElement, error) {
    errorElement.textContent = `Error: ${error}`;
}

function getValidInteger(inputElement, errorElement) {
    const value = inputElement.value;
    const parsedValue = parseInt(value);
    if (isNaN(parsedValue)) {
        handleError(errorElement, 'Client: Invalid number!');
        return null;
    }
    return parsedValue;
}

function getValidInput(inputElement, errorElement) {
    const value = inputElement.value.trim();
    if (!value) {
        handleError(errorElement, 'Client: Input cannot be empty!');
        return null;
    }
    return value;
}

// Books Manager
const getTopSellingBtn = document.getElementById('getTopSellingBtn');
const booksTopSellingOutput = document.getElementById('booksTopSellingOutput');

const getTopSellingGenresBtn = document.getElementById('getTopSellingGenresBtn');
const booksTopSellingGenresOutput = document.getElementById('booksTopSellingGenresOutput');

const getAllBooksBtn = document.getElementById('getAllBooksBtn');
const booksAllOutput = document.getElementById('booksAllOutput');

const searchBooksBtn = document.getElementById('searchBooksBtn');
const booksSearchInput = document.getElementById('booksSearchInput');
const booksSearchOutput = document.getElementById('booksSearchOutput');

const getBookDetailsBtn = document.getElementById('getBookDetailsBtn');
const booksDetailsInput = document.getElementById('booksDetailsInput');
const booksDetailsOutput = document.getElementById('booksDetailsOutput');

getTopSellingBtn.addEventListener('click', () => {
    BooksManager.getTopSelling((response) => displayOutput(booksTopSellingOutput, response));
});

getTopSellingGenresBtn.addEventListener('click', () => {
    BooksManager.getTopSellingInGenres((response) => displayOutput(booksTopSellingGenresOutput, response));
});

getAllBooksBtn.addEventListener('click', () => {
    BooksManager.getAllBooks((response) => displayOutput(booksAllOutput, response));
});

searchBooksBtn.addEventListener('click', () => {
    const keywords = getValidInput(booksSearchInput, booksSearchOutput);
    if (keywords !== null) {
        BooksManager.search(keywords, (response) => displayOutput(booksSearchOutput, response));
    }
});

getBookDetailsBtn.addEventListener('click', () => {
    const bookId = getValidInteger(booksDetailsInput, booksDetailsOutput);
    if (bookId !== null) {
        BooksManager.getBookDetails(bookId, (response) => displayOutput(booksDetailsOutput, response));
    }
});

// Cart Manager
const getCartBtn = document.getElementById('getCartBtn');
const cartUserId = document.getElementById('cartUserId');
const cartOutput = document.getElementById('cartOutput');

const validateCartBtn = document.getElementById('validateCartBtn');
const cartValidateOutput = document.getElementById('cartValidateOutput');

const getShippingFeeBtn = document.getElementById('getShippingFeeBtn');
const cartShippingFeeOutput = document.getElementById('cartShippingFeeOutput');

const addToCartBtn = document.getElementById('addToCartBtn');
const cartAddBookId = document.getElementById('cartAddBookId');
const cartAddQuantity = document.getElementById('cartAddQuantity');
const cartAddOutput = document.getElementById('cartAddOutput');

const updateCartBtn = document.getElementById('updateCartBtn');
const cartUpdateBookId = document.getElementById('cartUpdateBookId');
const cartUpdateQuantity = document.getElementById('cartUpdateQuantity');
const cartUpdateOutput = document.getElementById('cartUpdateOutput');

const removeFromCartBtn = document.getElementById('removeFromCartBtn');
const cartRemoveBookId = document.getElementById('cartRemoveBookId');
const cartRemoveOutput = document.getElementById('cartRemoveOutput');

const truncateCartBtn = document.getElementById('truncateCartBtn');
const cartTruncateOutput = document.getElementById('cartTruncateOutput');

getCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartOutput);
    if (userId !== null) {
        CartManager.getCart(userId, (response) => displayOutput(cartOutput, response));
    }
});

validateCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartValidateOutput);
    if (userId !== null) {
        CartManager.validateCart(userId, (response) => displayOutput(cartValidateOutput, response));
    }
});

getShippingFeeBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartShippingFeeOutput);
    if (userId !== null) {
        CartManager.getShippingFee(userId, (response) => displayOutput(cartShippingFeeOutput, response));
    }
});

addToCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartAddOutput);
    const bookId = getValidInteger(cartAddBookId, cartAddOutput);
    const quantity = getValidInteger(cartAddQuantity, cartAddOutput);
    if (userId !== null && bookId !== null && quantity !== null) {
        CartManager.addItem(userId, bookId, quantity, (response) => displayOutput(cartAddOutput, response));
    }
});

updateCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartUpdateOutput);
    const bookId = getValidInteger(cartUpdateBookId, cartUpdateOutput);
    const newQuantity = getValidInteger(cartUpdateQuantity, cartUpdateOutput);
    if (userId !== null && bookId !== null && newQuantity !== null) {
        CartManager.updateCartItem(userId, bookId, newQuantity, (response) => displayOutput(cartUpdateOutput, response));
    }
});

removeFromCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartRemoveOutput);
    const bookId = getValidInteger(cartRemoveBookId, cartRemoveOutput);
    if (userId !== null && bookId !== null) {
        CartManager.removeCartItem(userId, bookId, (response) => displayOutput(cartRemoveOutput, response));
    }
});

truncateCartBtn.addEventListener('click', () => {
    const userId = getValidInteger(cartUserId, cartTruncateOutput);
    if (userId !== null) {
        CartManager.truncate(userId, (response) => displayOutput(cartTruncateOutput, response));
    }
});

// Orders Manager
const getOrdersBtn = document.getElementById('getOrdersBtn');
const ordersUserId = document.getElementById('ordersUserId');
const ordersOutput = document.getElementById('ordersOutput');

const getOrderDetailsBtn = document.getElementById('getOrderDetailsBtn');
const ordersOrderId = document.getElementById('ordersOrderId');
const orderDetailsOutput = document.getElementById('orderDetailsOutput');

const checkoutAccountBalanceBtn = document.getElementById('checkoutAccountBalanceBtn');
const ordersAddress = document.getElementById('ordersAddress');
const ordersCheckoutAccountBalanceOutput = document.getElementById('ordersCheckoutAccountBalanceOutput');

const checkoutCreditCardBtn = document.getElementById('checkoutCreditCardBtn');
const ordersCreditCardName = document.getElementById('ordersCreditCardName');
const ordersCreditCardNumber = document.getElementById('ordersCreditCardNumber');
const ordersCreditCardExpiryYear = document.getElementById('ordersCreditCardExpiryYear');
const ordersCreditCardExpiryMonth = document.getElementById('ordersCreditCardExpiryMonth');
const ordersCreditCardCvc = document.getElementById('ordersCreditCardCvc');
const ordersCheckoutCreditCardOutput = document.getElementById('ordersCheckoutCreditCardOutput');

getOrdersBtn.addEventListener('click', () => {
    const userId = getValidInteger(ordersUserId, ordersOutput);
    if (userId !== null) {
        OrdersManager.getOrdersList(userId, (response) => displayOutput(ordersOutput, response));
    }
});

getOrderDetailsBtn.addEventListener('click', () => {
    const userId = getValidInteger(ordersUserId, orderDetailsOutput);
    const orderId = getValidInteger(ordersOrderId, orderDetailsOutput);
    if (userId !== null && orderId !== null) {
        OrdersManager.getOrderDetails(userId, orderId, (response) => displayOutput(orderDetailsOutput, response));
    }
});

checkoutAccountBalanceBtn.addEventListener('click', () => {
    const userId = getValidInteger(ordersUserId, ordersCheckoutAccountBalanceOutput);
    const address = getValidInput(ordersAddress, ordersCheckoutAccountBalanceOutput);
    if (userId !== null && address !== null) {
        OrdersManager.checkoutUsingAccountBalance(userId, address, (response) => displayOutput(ordersCheckoutAccountBalanceOutput, response));
    }
});

checkoutCreditCardBtn.addEventListener('click', () => {
    const userId = getValidInteger(ordersUserId, ordersCheckoutCreditCardOutput);
    const address = getValidInput(ordersAddress, ordersCheckoutCreditCardOutput);
    const nameOnCard = getValidInput(ordersCreditCardName, ordersCheckoutCreditCardOutput);
    const cardNumber = getValidInput(ordersCreditCardNumber, ordersCheckoutCreditCardOutput);
    const expiryYear = getValidInteger(ordersCreditCardExpiryYear, ordersCheckoutCreditCardOutput);
    const expiryMonth = getValidInteger(ordersCreditCardExpiryMonth, ordersCheckoutCreditCardOutput);
    const cvc = getValidInteger(ordersCreditCardCvc, ordersCheckoutCreditCardOutput);
    if (userId !== null && address !== null && nameOnCard !== null
        && cardNumber !== null && expiryYear !== null && expiryMonth !== null && cvc !== null) {
        const creditCardDetails = { nameOnCard, cardNumber, expiryYear, expiryMonth, cvc };
        OrdersManager.checkoutUsingCreditCard(userId, address, creditCardDetails, (response) => displayOutput(ordersCheckoutCreditCardOutput, response));
    }
});

// Profile Manager
const loginBtn = document.getElementById('loginBtn');
const profileEmail = document.getElementById('profileEmail');
const profilePassword = document.getElementById('profilePassword');
const profileLoginOutput = document.getElementById('profileLoginOutput');

const registerBtn = document.getElementById('registerBtn');
const profileRegisterUsername = document.getElementById('profileRegisterUsername');
const profileRegisterEmail = document.getElementById('profileRegisterEmail');
const profileRegisterPassword = document.getElementById('profileRegisterPassword');
const profileRegisterPhoneNumber = document.getElementById('profileRegisterPhoneNumber');
const profileRegisterAddress = document.getElementById('profileRegisterAddress');
const profileRegisterBirthdate = document.getElementById('profileRegisterBirthdate');
const profileRegisterOutput = document.getElementById('profileRegisterOutput');

const getProfileBtn = document.getElementById('getProfileBtn');
const profileUserId = document.getElementById('profileUserId');
const profileOutput = document.getElementById('profileOutput');

const updateEmailBtn = document.getElementById('updateEmailBtn');
const profileNewEmail = document.getElementById('profileNewEmail');
const profileUpdateEmailOutput = document.getElementById('profileUpdateEmailOutput');

const updatePasswordBtn = document.getElementById('updatePasswordBtn');
const profileCurrentPassword = document.getElementById('profileCurrentPassword');
const profileNewPassword = document.getElementById('profileNewPassword');
const profileUpdatePasswordOutput = document.getElementById('profileUpdatePasswordOutput');

const updateDetailsBtn = document.getElementById('updateDetailsBtn');
const profileUsername = document.getElementById('profileUsername');
const profilePhoneNumber = document.getElementById('profilePhoneNumber');
const profileAddress = document.getElementById('profileAddress');
const profileBirthdate = document.getElementById('profileBirthdate');
const profileUpdateDetailsOutput = document.getElementById('profileUpdateDetailsOutput');

const rechargeBalanceUsingCreditCardBtn
    = document.getElementById('rechargeBalanceUsingCreditCardBtn');

const rechargeBalanceCreditCardName
    = document.getElementById('rechargeBalanceCreditCardName');

const rechargeBalanceCreditCardNumber
    = document.getElementById('rechargeBalanceCreditCardNumber');

const rechargeBalanceCreditCardExpiryYear
    = document.getElementById('rechargeBalanceCreditCardExpiryYear');

const rechargeBalanceCreditCardExpiryMonth
    = document.getElementById('rechargeBalanceCreditCardExpiryMonth');

const rechargeBalanceCreditCardCvc
    = document.getElementById('rechargeBalanceCreditCardCvc');

const rechargeBalance = document.getElementById('rechargeBalance');

const profileRechargeBalanceUsingCreditCardOutput
    = document.getElementById('profileRechargeBalanceUsingCreditCardOutput');

loginBtn.addEventListener('click', () => {
    const email = getValidInput(profileEmail, profileLoginOutput);
    const password = getValidInput(profilePassword, profileLoginOutput);
    if (email !== null && password !== null) {
        ProfileManager.login(email, password, (response) => displayOutput(profileLoginOutput, response));
    }
});

registerBtn.addEventListener('click', () => {
    const userName = getValidInput(profileRegisterUsername, profileRegisterOutput);
    const email = getValidInput(profileRegisterEmail, profileRegisterOutput);
    const password = getValidInput(profileRegisterPassword, profileRegisterOutput);
    const phoneNumber = getValidInput(profileRegisterPhoneNumber, profileRegisterOutput);
    const address = getValidInput(profileRegisterAddress, profileRegisterOutput);
    let birthDate = getValidInput(profileRegisterBirthdate, profileRegisterOutput);
    birthDate = new Date(birthDate).toISOString();
    if (userName !== null && email !== null && password !== null
        && phoneNumber !== null && address !== null && birthDate !== null) {
        const userData = {
            userName,
            email,
            password,
            phoneNumber,
            address,
            birthDate
        };
        ProfileManager.register(userData, (response) => displayOutput(profileRegisterOutput, response));
    }
});

getProfileBtn.addEventListener('click', () => {
    const userId = getValidInteger(profileUserId, profileOutput);
    if (userId !== null) {
        ProfileManager.getProfile(userId, (response) => displayOutput(profileOutput, response));
    }
});

updateEmailBtn.addEventListener('click', () => {
    const userId = getValidInteger(profileUserId, profileUpdateEmailOutput);
    const newEmail = getValidInput(profileNewEmail, profileUpdateEmailOutput);
    if (userId !== null && newEmail !== null) {
        ProfileManager.updateEmail(userId, newEmail, (response) => displayOutput(profileUpdateEmailOutput, response));
    }
});

updatePasswordBtn.addEventListener('click', () => {
    const userId = getValidInteger(profileUserId, profileUpdatePasswordOutput);
    const currentPassword = getValidInput(profileCurrentPassword, profileUpdatePasswordOutput);
    const newPassword = getValidInput(profileNewPassword, profileUpdatePasswordOutput);
    if (userId !== null && currentPassword !== null && newPassword !== null) {
        ProfileManager.updatePassword(userId, currentPassword, newPassword, (response) => displayOutput(profileUpdatePasswordOutput, response));
    }
});

updateDetailsBtn.addEventListener('click', () => {
    const userId = getValidInteger(profileUserId, profileUpdateDetailsOutput);
    const userName = getValidInput(profileUsername, profileUpdateDetailsOutput);
    const phoneNumber = getValidInput(profilePhoneNumber, profileUpdateDetailsOutput);
    const address = getValidInput(profileAddress, profileUpdateDetailsOutput);
    let birthDate = getValidInput(profileBirthdate, profileUpdateDetailsOutput);
    birthDate = new Date(birthDate).toISOString();
    if (userId !== null && userName !== null && phoneNumber !== null && address !== null && birthDate !== null) {
        const updatedDetails = {
            userName,
            phoneNumber,
            address,
            birthDate
        };
        ProfileManager.updateDetails(userId, updatedDetails, (response) => displayOutput(profileUpdateDetailsOutput, response));
    }
});

rechargeBalanceUsingCreditCardBtn.addEventListener('click', () => {
    const userId = getValidInteger(profileUserId, profileRechargeBalanceUsingCreditCardOutput);

    const creditCardName = getValidInput(rechargeBalanceCreditCardName, profileRechargeBalanceUsingCreditCardOutput);
    const creditCardNumber = getValidInput(rechargeBalanceCreditCardNumber, profileRechargeBalanceUsingCreditCardOutput);
    const creditCardExpiryYear = getValidInteger(rechargeBalanceCreditCardExpiryYear, profileRechargeBalanceUsingCreditCardOutput);
    const creditCardExpiryMonth = getValidInteger(rechargeBalanceCreditCardExpiryMonth, profileRechargeBalanceUsingCreditCardOutput);
    const creditCardCvc = getValidInteger(rechargeBalanceCreditCardCvc, profileRechargeBalanceUsingCreditCardOutput);
    const amount = getValidInteger(rechargeBalance, profileRechargeBalanceUsingCreditCardOutput);

    if (userId !== null
    &&  creditCardName !== null
    &&  creditCardNumber !== null
    &&  creditCardExpiryYear !== null
    &&  creditCardExpiryMonth !== null
    &&  creditCardCvc !== null
    &&  amount !== null) {
        const creditCardDetails = {
            nameOnCard: creditCardName,
            cardNumber: creditCardNumber,
            expiryYear: creditCardExpiryYear,
            expiryMonth: creditCardExpiryMonth,
            cvc: creditCardCvc
        };

        ProfileManager.rechargeAccountBalanceUsingCreditCard(
            userId, creditCardDetails, amount, (response) =>
            displayOutput(profileRechargeBalanceUsingCreditCardOutput, response)
        );
    }
});

// Wish List Manager.
const wishlistUserId = document.getElementById('wishlistUserId');
const getAllWishlistItemsBtn = document.getElementById('getAllWishlistItemsBtn');
const wishlistAllItemsOutput = document.getElementById('wishlistAllItemsOutput');

const getAllWishListBooksBtn = document.getElementById('getAllWishListBooksBtn');
const wishlistAllBooksOutput = document.getElementById('wishlistAllBooksOutput');

const wishlistAddBookId = document.getElementById('wishlistAddBookId');
const addToWishlistBtn = document.getElementById('addToWishlistBtn');
const wishlistAddOutput = document.getElementById('wishlistAddOutput');

const wishlistRemoveBookId = document.getElementById('wishlistRemoveBookId');
const removeFromWishlistBtn = document.getElementById('removeFromWishlistBtn');
const wishlistRemoveOutput = document.getElementById('wishlistRemoveOutput');

getAllWishlistItemsBtn.addEventListener('click', () => {
    const userID = getValidInteger(wishlistUserId, wishlistAllItemsOutput);
    if (userID !== null) {
        WishListManager.getAllWishList(userID, (response) => displayOutput(wishlistAllItemsOutput, response));
    }
})

getAllWishListBooksBtn.addEventListener('click', () => {
    const userID = getValidInteger(wishlistUserId, wishlistAllBooksOutput);
    if (userID !== null) {
        WishListManager.getAllWishListBooks(userID, (response) => displayOutput(wishlistAllBooksOutput, response));
    }
})

addToWishlistBtn.addEventListener('click', () => {
    const userID = getValidInteger(wishlistUserId, wishlistAddOutput);
    const bookID = getValidInteger(wishlistAddBookId, wishlistAddOutput);
    if (userID !== null && bookID !== null) {
        WishListManager.addWishListItem(userID, bookID, (response) => displayOutput(wishlistAddOutput, response));
    }
})

removeFromWishlistBtn.addEventListener('click', () => {
    const userID = getValidInteger(wishlistUserId, wishlistRemoveOutput);
    const bookID = getValidInteger(wishlistRemoveBookId, wishlistRemoveOutput);
    if (userID !== null && bookID !== null) {
        WishListManager.removeFromWishList(userID, bookID, (response) => displayOutput(wishlistRemoveOutput, response))
    }
})

// Purchase History Manager.
const purchaseHistoryUserId = document.getElementById('purchaseHistoryUserId');
const getAllPurchaseHistoryBtn = document.getElementById('getAllPurchaseHistoryBtn');
const purchaseHistoryAllOutput = document.getElementById('purchaseHistoryAllOutput');

const purchaseHistoryId = document.getElementById('purchaseHistoryId');
const getPurchaseHistoryItemBtn = document.getElementById('getPurchaseHistoryItemBtn');
const purchaseHistoryItemOutput = document.getElementById('purchaseHistoryItemOutput');

getAllPurchaseHistoryBtn.addEventListener('click', () => {
    const userID = getValidInteger(purchaseHistoryUserId, purchaseHistoryAllOutput);
    if (userID !== null) {
        PurchaseHistoryManager.getAllPurchaseHistory(userID, (response) => displayOutput(purchaseHistoryAllOutput, response));
    }
});

function purchaseHistoryItemCallback(outputElement, response) {
    displayOutput(outputElement, response);

    let parsedResponse;
    try {
        parsedResponse = JSON.parse(response);
    } catch (e) {
        console.log('Failed at parsing response in function purchaseHistoryItemCallback', `Error: ${e}`);
        return;
    }

    if (parsedResponse.success) {
        const url = parsedResponse.data.receiptFileURL;
        if (!url) {
            return;
        }
        console.log('Receipt file URL: ', url);
        window.open(url, '_blank');
    }
}

getPurchaseHistoryItemBtn.addEventListener('click', () => {
    const userID = getValidInteger(purchaseHistoryUserId, purchaseHistoryItemOutput);
    const itemID = getValidInteger(purchaseHistoryId, purchaseHistoryItemOutput);
    if (userID !== null && itemID !== null) {
        PurchaseHistoryManager.getPurchaseHistoryItem(userID, itemID, (response) => purchaseHistoryItemCallback(purchaseHistoryItemOutput, response));
    }
});