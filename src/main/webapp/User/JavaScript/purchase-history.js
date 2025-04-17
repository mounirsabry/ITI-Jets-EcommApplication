'use strict';

import checkForErrorMessageParameter from "./Common/checkForError.js";
import URL_Mapper from './Utils/URL_Mapper.js';
import UserAuthTracker from "./Common/UserAuthTracker.js";

import {PurchaseHistoryManager} from "./Managers/PurchaseHistoryManager.js";
import HistoryItem from "./Models/HistoryItem.js";

document.addEventListener('DOMContentLoaded', function () {
    checkForErrorMessageParameter();


    const historyList = document.getElementById('historyList');
    if (!historyList) {
        console.error('Could not locate the history list component!');
        return;
    }
    historyList.innerHTML = '<div class="loading-data">Loading your purchase history...</div>';

    const backToProfileButton = document.getElementById('backToProfile');
    if (!backToProfileButton) {
        console.error('Could not locate the backToProfile button.');
    } else {
        backToProfileButton.addEventListener('click', () => {
            window.location.href = URL_Mapper.PROFILE;
        });
    }

    const userObject = UserAuthTracker.userObject;
    if (!userObject) {
        UserAuthTracker.handleUserInvalidState();
    }

    PurchaseHistoryManager.getAllPurchaseHistory(userObject.userID, renderHistoryList, null);

    function renderHistoryList(historyItemList) {
        const parsedList = historyItemList.map((item) => {
            try {
                return HistoryItem.fromJSON(item);
            } catch (_) {
                console.error('Could not parse a history item.');
                return null;
            }
        }).filter(item => item != null);

        historyList.innerHTML = '';

        parsedList.forEach((item) => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('history-item');

            const date = new Date(item.date);
            const formattedDate = date.toISOString().split('T')[0];
            const formattedTime = date.toTimeString().split(' ')[0];

            itemDiv.innerHTML = `
            <div class='history-details'>
                <h3>Receipt #${item.itemID}</h3>
                <p>Date: ${formattedDate}</p>
                <p>Time: ${formattedTime}</p>
                <p>Total: ${item.totalPaid}</p>
            </div>
            <button class='download-button'>Download Receipt</button>
            `;

            itemDiv.querySelector('.download-button').addEventListener('click', () => {
                window.open(item.receiptFileURL, '_blank');
            });

            historyList.appendChild(itemDiv);
        });
    }
});
