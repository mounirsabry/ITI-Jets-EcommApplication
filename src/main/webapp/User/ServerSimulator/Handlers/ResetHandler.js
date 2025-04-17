'use strict';

import { Serializer } from '../Utils/Serializer.js';
import InitController from "../Controllers/InitController.js";
import SERVER_DELAY from "../Utils/ServerDelay.js";

// For testing, will not make it to production.
export const ResetHandler = {
    resetTestingData(_, callback) {
        setTimeout(() => {
            try {
                const result = InitController.resetData();
                callback(Serializer.serialize(result));
            } catch (error) {
                callback(Serializer.serialize({
                    success: false,
                    data: `Server Error: ${error}`
                }));
            }
        }, SERVER_DELAY);
    }
};