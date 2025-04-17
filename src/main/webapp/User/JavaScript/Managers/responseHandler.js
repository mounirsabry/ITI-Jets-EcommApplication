'use strict';

import MessagePopup from "../Common/MessagePopup.js";

const createResponseHandler = function(callbackOnSuccess, callbackOnFailure) {
   return function(response) {
       let parsedResponse;
       try {
           parsedResponse = JSON.parse(response);
       } catch (e) {
           console.error(`Parsing Error: ${e}`);
           return;
       }

       if (parsedResponse?.success) {
           if (typeof callbackOnSuccess === 'function') {
               callbackOnSuccess(parsedResponse.data);
           }
       } else {
           MessagePopup.show(parsedResponse.data, true);
           if (typeof callbackOnFailure === 'function') {
               callbackOnFailure(parsedResponse.data);
           }
       }
   }
};

export default createResponseHandler;