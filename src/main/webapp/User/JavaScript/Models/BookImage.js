'use strict';

export default class BookImage {
    #url;
    #isMain;

    constructor(url, isMain = false) {
        this.url = url;
        this.isMain = isMain;
    }

    get url() {
        return this.#url;
    }

    set url(value) {
        if (typeof value !== 'string' || value.trim() === '') {
            throw new Error('Invalid or missing URL!');
        }
        this.#url = value;
    }

    get isMain() {
        return this.#isMain;
    }

    set isMain(value) {
        if (typeof value !== 'boolean') {
            throw new Error('IsMain must be a boolean value!');
        }
        this.#isMain = value;
    }

    toJSON() {
        return {
            url: encodeURI(this.#url),
            isMain: this.#isMain
        };
    }

    static fromJSON(json) {
        console.log("hello");
        if (typeof json !== 'object' || json === null) {
            throw new Error('Invalid JSON object!');
        }
        if (typeof json.url !== 'string' || json.url.trim() === '') {
            throw new Error('Invalid or missing URL!');
        }
        if (typeof json.isMain !== 'boolean') {
            throw new Error('Invalid or missing isMain value!');
        }
        const url = json.url;
        //'http://localhost:8080/ITI-Jets-EcommApplication/Admin/Images/' + json.url;


        let decodedURL;
        try {
            decodedURL = decodeURI(url);
        } catch (error) {
            throw new Error('Could not decode URL!');
        }

        return new BookImage(decodedURL, json.isMain);
    }
}