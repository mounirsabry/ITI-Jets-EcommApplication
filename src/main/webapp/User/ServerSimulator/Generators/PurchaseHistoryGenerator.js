'use strict';

import HistoryItem from "../Models/HistoryItem.js";
import URL_Mapper from "../Utils/URL_Mapper.js";

function generateTestingPurchaseHistory() {
    const now = new Date().toISOString();
    const receiptURL = URL_Mapper.ASSETS.RECEIPT;

    const item1 = new HistoryItem();
    item1.itemID = 1;
    item1.userID = 1;
    item1.date = now;
    item1.totalPaid = 1000;
    item1.receiptFileURL = receiptURL

    const item2 = new HistoryItem();
    item2.itemID = 2;
    item2.userID = 1;
    item2.date = now;
    item2.totalPaid = 1299;
    item2.receiptFileURL = receiptURL;

    const item3 = new HistoryItem();
    item3.itemID = 3;
    item3.userID = 2;
    item3.date = now;
    item3.totalPaid = 1500;
    item3.receiptFileURL = receiptURL;

    return [item1, item2, item3];
}

const testingPurchaseHistory = generateTestingPurchaseHistory();

export default testingPurchaseHistory;