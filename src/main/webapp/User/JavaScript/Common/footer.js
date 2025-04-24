'use strict';

import URL_Mapper from '../Utils/URL_Mapper.js';

document.addEventListener("DOMContentLoaded", function() {
    const footerContainer = document.getElementById("siteFooter");
    if (!footerContainer) {
        console.log('Could not load the footer component.');
        return;
    }

    footerContainer.innerHTML = `
        <p>
            <span>&copy; 2025 Book Alley</span>
            <span class="pipe">|</span>
            <span>Contact: support@bookalley.com</span>
            <span class="pipe">|</span>
            <span>Phone: +20 123 456 789</span>
        </p>
        <a target="_blank" id="aboutUSLink">About US</a>
    `;

    document.getElementById('aboutUSLink').href = URL_Mapper.ABOUT;
});
