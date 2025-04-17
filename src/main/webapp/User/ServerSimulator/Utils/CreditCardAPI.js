'use static';

export default class CreditCardAPI {
    static pay(creditCardDetails, amount) {
        // This is a placeholder to act as a stub for credit card API.
        // This will be a stub to the end of the project.
        console.log(creditCardDetails, amount);
        return Math.random() <= 0.8; // 80 % success chance.
    }
}