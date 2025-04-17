'use strict';

export default class ShippingFeeCalculator {
    static #baseShippingFee = 40;
    static #itemShippingCostMultiplier = 2;

    static calculateShippingFee(orderItems) {
        let shippingFee = ShippingFeeCalculator.#baseShippingFee;
        orderItems.forEach(item => {
            shippingFee += item.quantity * ShippingFeeCalculator.#itemShippingCostMultiplier;
        });
        return shippingFee;
    }
}