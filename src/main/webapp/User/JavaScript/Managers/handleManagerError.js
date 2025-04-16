// Centralized error handling method
import { AjaxRequestError, AjaxRequestErrorType } from "../Ajax/AjaxError.js";
import PopupMessage from "../PopupMessage.js";

const handleManagerError = function(error, callbackOnFailure) {
    console.error(error);

    // Only show popup for non-parsing errors
    if (!(error instanceof AjaxRequestError &&
        error.errorType === AjaxRequestErrorType.PARSING_ERROR)) {
        PopupMessage.show(error.errorMessage || 'An unexpected error occurred', true);
    }

    if (typeof callbackOnFailure === 'function') {
        callbackOnFailure(error);
    }
}

export default handleManagerError;