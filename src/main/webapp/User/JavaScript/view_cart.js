'use strict';
import { RedirectButtons } from './Modules/RedirectButtons.js';

window.addEventListener('load', () => {
    RedirectButtons.monitorLogoutButton();
    RedirectButtons.monitorCheckoutButton();
});
