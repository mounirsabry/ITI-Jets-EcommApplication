'use strict';
import { Mapper } from './Modules/Mapper.js';
import { RedirectButtons } from './Modules/RedirectButtons.js';

window.addEventListener('load', () => {
    RedirectButtons.monitorLogoutButton();
    RedirectButtons.monitorViewOrdersButton();
    RedirectButtons.monitorViewHistoryButton();
});


