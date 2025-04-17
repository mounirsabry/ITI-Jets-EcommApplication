'use strict';

import { Server } from "../../ServerSimulator";
import createResponseHandler from "./responseHandler.js";

export const ResetManager = {
    reset(callbackOnSuccess, callbackOnFailure) {
        Server.ResetHandler.resetTestingData('{}',
            createResponseHandler(callbackOnSuccess, callbackOnFailure));
    }
}