'use strict';

import UsersDAO from '../DB/UsersDAO.js';
import CartDAO from '../DB/CartDAO.js';
import User from "../Models/User.js";

export class UserController {
    static login(email, password) {
        const user = UsersDAO.getUserByEmail(email);
        if (!user || user.hashPassword !== password) {
            return { success: false, data: "Invalid credentials!" };
        }
        return { success: true, data: user };
    }

    static register(userData) {
        if (UsersDAO.getUserByEmail(userData.email)) {
            return { success: false, data: "Email already registered!" };
        }

        const rawUsers = UsersDAO.getAllRawUsers();
        const users = rawUsers.map(user => User.fromJSON(user));

        const { email, password, userName, phoneNumber, address, birthDate } = userData;

        // Create new user
        const newUser = new User();
        newUser.userID = users.length > 0 ? Math.max(...users.map(u => u.userID)) + 1 : 1;
        newUser.email = email;
        newUser.hashPassword = password;
        newUser.userName = userName;
        newUser.phoneNumber = phoneNumber;
        newUser.address = address;
        newUser.birthDate = birthDate;

        UsersDAO.saveUser(newUser);
        CartDAO.createCart(newUser.userID);
        
        return { success: true, data: newUser };
    }
}