'use strict'

import PurchaseHistoryDAO from "../DB/PurchaseHistoryDAO.js";

export default class PurchaseHistoryController {
    static getPurchaseHistory(userID) {
        const purchaseHistory = PurchaseHistoryDAO.getPurchaseHistoryListForUser(userID);
        return { success: true, data: purchaseHistory }
    }

    static getPurchaseHistoryItem(userID, bookID) {
        const historyItem = PurchaseHistoryDAO.getPurchaseHistoryItem(userID, bookID);
        if (historyItem === null) {
            return { success: false, data: 'No such purchase history item!' }
        }
        return { success: true, data: historyItem }
    }
}