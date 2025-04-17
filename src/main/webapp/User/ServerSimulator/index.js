'use strict';

import { ResetHandler } from "./Handlers/ResetHandler.js";
import { BooksHandler } from './Handlers/BooksHandler.js';
import { CartHandler } from './Handlers/CartHandler.js';
import { OrderHandler } from './Handlers/OrdersHandler.js';
import { LoginHandler } from './Handlers/LoginHandler.js';
import { RegisterHandler } from './Handlers/RegisterHandler.js';
import { ProfileHandler } from './Handlers/ProfileHandler.js';
import { WishListHandler } from './Handlers/WishListHandler.js';
import { PurchaseHistoryHandler } from "./Handlers/PurchaseHistoryHandler.js";
import InitController from "./Controllers/InitController.js";

const isDataExists = InitController.dataExists();
console.log(`Is Data Init: ${isDataExists}`);

export const Server = {
    ResetHandler,
    BooksHandler,
    CartHandler,
    OrderHandler,
    LoginHandler,
    RegisterHandler,
    ProfileHandler,
    WishListHandler,
    PurchaseHistoryHandler
};