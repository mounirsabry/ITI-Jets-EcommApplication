'use strict';

import HistoryItem from "../Models/HistoryItem.js";

class PurchaseHistoryDAO {
    #STORAGE_KEY = 'purchaseHistory';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]')
        }
    }

    getRawPurchaseHistoryList() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY));
    }

    getPurchaseHistoryListForUser(userID) {
        const foundList = this.getRawPurchaseHistoryList()
            .map(historyItem => HistoryItem.fromJSON(historyItem))
            .filter(historyItem => historyItem.userID === userID);
        return foundList || [];
    }

    getPurchaseHistoryItem(userID, itemID) {
        const foundItem = this.getRawPurchaseHistoryList()
            .map(historyItem => HistoryItem.fromJSON(historyItem))
            .find(historyItem => {
            return historyItem.userID === userID
                && historyItem.itemID === itemID;
        });
        return foundItem || null;
    }

    saveAllHistoryItems(historyItems) {
        const jsonHistoryItems = historyItems.map(historyItem => historyItem.toJSON());
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(jsonHistoryItems));
    }
}

export default new PurchaseHistoryDAO();