'use strict';

import { UserController } from '../Controllers/UserController.js';
import { Serializer } from '../Utils/Serializer.js';
import DataValidator from '../Utils/DataValidator.js';
import SERVER_DELAY from "../Utils/ServerDelay.js";

export const LoginHandler = {
    userLogin(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid login data format!'
                    }));
                }

                if (!data.email || typeof data.email !== 'string'
                ||  !data.password || typeof data.password !== 'string') {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid credentials format!'
                    }));
                }

                if (!DataValidator.isEmailValid(data.email)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid email format!'
                    }))
                }

                if (!DataValidator.isPasswordValid(data.password)) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid password format!'
                    }));
                }

                const email = data.email;
                const password = data.password;
                
                const result = UserController.login(email, password);
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