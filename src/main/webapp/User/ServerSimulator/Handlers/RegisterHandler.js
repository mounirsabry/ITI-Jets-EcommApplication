'use strict';

import { UserController } from '../Controllers/UserController.js';
import { Serializer } from '../Utils/Serializer.js';
import DataValidator from '../Utils/DataValidator.js';
import SERVER_DELAY from "../Utils/ServerDelay.js";

function checkForError(data) {
    const { email, password, userName, phoneNumber, address, birthDate } = data;
    
    if (!DataValidator.isEmailValid(email)) {
        return 'Invalid email, email must be a valid email address!';
    }
    if (!userName || typeof userName !== 'string' || !userName.trim().length > 0) {
        return 'Invalid username!';
    }
    if (!DataValidator.isPasswordValid(password)) {
        return 'Weak or invalid password, password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number and one special character!';
    }
    if (!DataValidator.isPhoneValid(phoneNumber)) {
        return 'Invalid phone number, phone number must be a valid egyptian mobile number!';
    }
    if (!address || typeof address !== 'string') {
        return 'Invalid address, address must be provided and be a string!';
    }
    if (!birthDate || !DataValidator.isDateValid(birthDate)) {
        return 'Invalid birth date format!';
    }
    if (!DataValidator.isBirthDateValid(birthDate)) {
        return 'Invalid birth date, age must be at least 10 years old!';
    }
    return null;
}

export const RegisterHandler = {
    userRegister(jsonData, callback) {
        setTimeout(() => {
            try {
                const data = Serializer.safeParse(jsonData);
                if (!data) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: 'Invalid registration data format!'
                    }));
                }

                const errorMessage = checkForError(data);
                if (errorMessage) {
                    return callback(Serializer.serialize({
                        success: false,
                        data: errorMessage
                    }));
                }
                
                const { email, password, userName, phoneNumber, address, birthDate } = data;

                const result = UserController.register({
                    email: email,
                    password: password,
                    userName: userName,
                    phoneNumber: phoneNumber,
                    address: address,
                    birthDate: birthDate,
                });
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