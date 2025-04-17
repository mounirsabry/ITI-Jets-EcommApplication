'use strict';

import User from "../Models/User.js";

class UsersDAO {
    #STORAGE_KEY = 'users';

    constructor() {
        if (localStorage.getItem(this.#STORAGE_KEY) === null) {
            localStorage.setItem(this.#STORAGE_KEY, '[]')
        }
    }

    getAllRawUsers() {
        return JSON.parse(localStorage.getItem(this.#STORAGE_KEY));
    }

    getUser(userID) {
        const foundUser = this.getAllRawUsers()
            .map(user => User.fromJSON(user))
            .find(user => user.userID === userID);
        return foundUser || null;
    }

    getUserByEmail(email) {
        const foundUser = this.getAllRawUsers()
            .map(user => User.fromJSON(user))
            .find(user => user.email === email);
        return foundUser || null;
    }

    validateUserPassword(userID, password) {
        const user = this.getUser(userID);
        if (user) {
            return user.hashPassword === password;
        }
        return false;
    }

    changeUserPassword(userID, newPassword) {
        const user = this.getUser(userID);
        if (user) {
            user.hashPassword = newPassword;
            this.saveUser(user);
            return true;
        }
        return false;
    }

    saveUser(updatedUser) {
        const rawUsers = this.getAllRawUsers();
        const users = rawUsers.map(user => User.fromJSON(user));

        const index = users.findIndex(u => u.userID === updatedUser.userID);
        if (index >= 0) {
            users[index] = updatedUser;
        } else {
            users.push(updatedUser);
        }
        this.saveAllUsers(users);
    }

    saveAllUsers(users) {
        const jsonUsers = users.map(user => user.toJSON());
        localStorage.setItem(this.#STORAGE_KEY, JSON.stringify(jsonUsers));
    }
}

export default new UsersDAO();