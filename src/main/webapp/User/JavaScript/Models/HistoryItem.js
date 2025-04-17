'use strict';

import DataValidator from "../Utils/DataValidator.js";

export default class HistoryItem {
    #itemID = -1;
    #userID = -1;
    #date = null;
    #totalPaid = 0.0;
    #receiptFileURL = null;

    constructor() {
    }

    get itemID() {
        return this.#itemID;
    }

    set itemID(itemID) {
        if (!DataValidator.isIDValid(itemID)) {
            throw new Error('Invalid item ID!');
        }
        this.#itemID = itemID;
    }

    get userID() {
        return this.#userID;
    }

    set userID(userID) {
        if (!DataValidator.isIDValid(userID)) {
            throw new Error('Invalid user ID!');
        }
        this.#userID = userID;
    }

    get date() {
        return this.#date;
    }

    set date(date) {
        if (!DataValidator.isDateValid(date)) {
            throw new Error('Invalid date!');
        }
        this.#date = date;
    }

    get totalPaid() {
        return this.#totalPaid;
    }

    set totalPaid(totalPaid) {
        if (!DataValidator.isNonNegativeInteger(totalPaid)) {
            throw new Error('Invalid total paid!');
        }
        this.#totalPaid = totalPaid;
    }
    
    get receiptFileURL() {
        return this.#receiptFileURL;
    }
    
    set receiptFileURL(receiptFileURL) {
        this.#receiptFileURL = receiptFileURL;
    }
    
    toJSON() {
        return {
            itemID: this.#itemID,
            userID: this.#userID,
            date: this.#date,
            totalPaid: this.#totalPaid,
            receiptFileURL: encodeURI(this.#receiptFileURL)
        };
    }
    
    static fromJSON(json) {
        const {itemID, userID, date, totalPaid, receiptFileURL} = json;

        if (!DataValidator.isIDValid(itemID)) {
            throw new Error('Invalid item ID in JSON!');
        }
        const parsedItemID = parseInt(itemID);

        if (!DataValidator.isIDValid(userID)) {
            throw new Error('Invalid user ID in JSON!');
        }
        const parsedUserID = parseInt(userID);

        if (!DataValidator.isDateValid(date)) {
            throw new Error('Invalid date in JSON!');
        }
        const parsedDate = new Date(date).toISOString();

        if (!DataValidator.isNonNegativeInteger(totalPaid)) {
            throw new Error('Invalid total paid in JSON!');
        }
        const parsedTotalPaid = parseFloat(totalPaid);

        if (receiptFileURL === null || typeof receiptFileURL !== 'string') {
            throw new Error('Invalid receipt file URL in JSON!');
        }
        if (receiptFileURL.trim().length === 0) {
            throw new Error('Receipt file URL cannot be empty!');
        }
        
        const item = new HistoryItem();
        item.itemID = parsedItemID;
        item.userID = parsedUserID;
        item.date = parsedDate;
        item.totalPaid = parsedTotalPaid;
        item.receiptFileURL = decodeURI(receiptFileURL);
        return item;
    }
}