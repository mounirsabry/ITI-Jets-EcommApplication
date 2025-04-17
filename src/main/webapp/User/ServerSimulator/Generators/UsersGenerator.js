'use strict';

import User from '../Models/User.js';

// Function to generate an array of testing users
function generateTestingUsers() {
    // Create user instances with explicit attributes
    const user1 = new User();
    user1.userID = 1;
    user1.userName = 'user1';
    user1.hashPassword = 'User1234'; // Stored in plaintext for this demo
    user1.email = 'user@email.com';
    user1.address = '123 User Street, City';
    user1.birthDate = '1990-01-15';
    user1.phoneNumber = '+201012345678';
    user1.accountBalance = 1000;

    const user2 = new User();
    user2.userID = 2;
    user2.userName = 'admin';
    user2.hashPassword = 'Admin1234'; // Stored in plaintext for this demo
    user2.email = 'admin@email.com';
    user2.address = '456 Admin Avenue, City';
    user2.birthDate = '1985-06-20';
    user2.phoneNumber = '+201112345678';
    user2.accountBalance = 5000;

    return [user1, user2];
}

// Generate the testing users array
const testingUsers = generateTestingUsers();

// Export the testing users array
export default testingUsers;