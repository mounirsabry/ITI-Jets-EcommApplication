'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import UserAuthTracker from "./Common/UserAuthTracker.js";
import PurchaseHistoryManager from "./Managers/PurchaseHistoryManager.js";
import HistoryItem from "./Models/HistoryItem.js";
import MessagePopup from "./Common/MessagePopup.js";
import LoadingOverlay from "./Common/LoadingOverlay.js";

document.addEventListener('DOMContentLoaded', async function () {
    checkForErrorMessageParameter();

    // DOM Elements
    const elements = {
        historyList: document.getElementById('historyList'),
        backToProfileButton: document.getElementById('backToProfile')
    };

    // Validate DOM elements
    if (!elements.historyList) {
        console.error('Could not locate the history list component!');
        return;
    }

    if (!elements.backToProfileButton) {
        console.error('Could not locate the backToProfile button.');
    }

    // Check user authentication
    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
        return;
    }

    // Initialize
    showLoadingState();
    setupEventListeners();
    await loadPurchaseHistory();

    function showLoadingState() {
        elements.historyList.innerHTML = '<div class="loading-data">Loading your purchase history...</div>';
    }

    function setupEventListeners() {
        if (elements.backToProfileButton) {
            elements.backToProfileButton.addEventListener('click', () => {
                window.location.href = URL_Mapper.PROFILE;
            });
        }
    }

    async function loadPurchaseHistory() {
        const loadingOverlay = new LoadingOverlay();
        loadingOverlay.createAndDisplay('Loading Purchase History...');

        const response = await PurchaseHistoryManager.getAllPurchaseHistory(userObject.userID);
        loadingOverlay.remove();

        if (!response) {
            showNoHistoryMessage()
            MessagePopup.show('Failed to load history items pages!', true);
        }
        else if (!response.success) {
            showNoHistoryMessage();
            MessagePopup.show(response.data, true);
        } else {
            renderHistoryList(response.data);
        }
    }

    function renderHistoryList(historyItemList) {
        // Clear existing content
        elements.historyList.innerHTML = '';

        // Parse and filter valid items
        const parsedList = historyItemList
            .map(item => {
                try {
                    return HistoryItem.fromJSON(item);
                } catch (error) {
                    console.error('Could not parse a history item:', error);
                    return null;
                }
            })
            .filter(item => item !== null);

        if (parsedList.length === 0) {
            showNoHistoryMessage();
            return;
        }

        // Create and append history items
        parsedList.forEach(item => {
            elements.historyList.appendChild(createHistoryItemElement(item));
        });
    }

    function createHistoryItemElement(item) {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('history-item');

        const date = new Date(item.date);
        const formattedDate = date.toISOString().split('T')[0];
        const formattedTime = date.toTimeString().split(' ')[0];
        const totalPaid = item.totalPaid.toFixed(2) + ' EGP';

        itemDiv.innerHTML = `
            <div class='history-details'>
                <h3>Receipt #${item.itemID}</h3>
                <p><strong>Date:</strong> ${formattedDate}</p>
                <p><strong>Time:</strong> ${formattedTime}</p>
                <p><strong>Total:</strong> ${totalPaid} </p>
            </div>
            <button class='download-button'>Download Receipt</button>
        `;

        itemDiv.querySelector('.download-button').addEventListener('click', () => {
            window.open(item.receiptFileURL, '_blank');
        });

        return itemDiv;
    }

    function showNoHistoryMessage() {
        elements.historyList.innerHTML = '<div class="no-data-found">No purchase history found</div>';
    }
});