'use strict';
import { Mapper } from './Modules/Mapper.js';

window.addEventListener('load', () => {
    const timer = document.getElementById('timer');
    
    if (!timer) {
        console.log('Could not locate the timer element.');
        return;
    }
    
    setInterval(() => {
        let currentLeftTime = parseInt(timer.textContent);
        currentLeftTime--;
        if (currentLeftTime === 0) {
            window.location.href = contextPath + Mapper.USER_HOME_JSPX;
        }
        timer.textContent = currentLeftTime;
    }, 1000);
});


