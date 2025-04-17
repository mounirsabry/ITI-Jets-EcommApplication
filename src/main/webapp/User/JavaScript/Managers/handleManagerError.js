// Centralized error handling method
import MessagePopup from "../Common/MessagePopup.js";

const handleManagerError = function(error, callbackOnFailure) {
    console.error(error);

    MessagePopup.show(error, true);
    if (typeof callbackOnFailure === 'function') {
        callbackOnFailure(error);
    }
}

export default handleManagerError;