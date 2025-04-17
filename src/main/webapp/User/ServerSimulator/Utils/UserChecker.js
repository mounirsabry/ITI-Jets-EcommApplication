'use strict';

import UsersDAO from "../DB/UsersDAO.js";

class UserChecker {
    static isUserExists(userID) {
        const user = UsersDAO.getUser(userID);
        return user !== null;
    }
}

export default UserChecker;