'use strict';

import PromotionsManager from '../Managers/PromotionsManager.js';
import MessagePopup from "../Common/MessagePopup.js";

export default async function loadBanners() {
    const bannerContainer = document.getElementById('bannerMessages');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    let currentIndex = 0;
    let autoScroll;
    let bannerElements = []; // Store DOM elements instead of messages

    // Try to load banners from server.
    const response = await PromotionsManager.getBannersList();
    let messages;

    if (!response) {
        messages = getFallbackMessages();
    } else if (!response.success) {
        MessagePopup.show(response.data, true);
        messages = getFallbackMessages();
    } else {
        messages = response.data;
    }

    renderBanners(messages);

    function getFallbackMessages() {
        return [
            'Fallback Banner 1.',
            'Fallback Banner 2.',
        ];
    }

    function renderBanners(messages) {
        // Clear existing content
        bannerContainer.innerHTML = '';
        bannerElements = []; // Reset stored elements

        // Create banner elements
        messages.forEach((message, index) => {
            const bannerElement = document.createElement('h2');
            bannerElement.className = 'banner-text';
            bannerElement.textContent = message;
            if (index === 0) bannerElement.classList.add('active');
            bannerContainer.appendChild(bannerElement);
            bannerElements.push(bannerElement); // Store the DOM element
        });

        // Initialize UI controls
        initializeControls();
    }

    function initializeControls() {
        // Clear any existing interval
        if (autoScroll) {
            clearInterval(autoScroll);
        }

        // Only proceed if we have banners
        if (bannerElements.length === 0) return;

        // Set up auto-scroll if multiple banners
        if (bannerElements.length > 1) {
            startAutoScroll();
        }

        // Set up navigation buttons if they exist
        setupNavigation();

        // Show first banner
        updateBanner(currentIndex);
    }

    function updateBanner(index) {
        bannerElements.forEach((element, i) => {
            element.classList.remove("active");
            if (i === index) {
                element.classList.add("active");
            }
        });
    }

    function nextMessage() {
        currentIndex = (currentIndex + 1) % bannerElements.length;
        updateBanner(currentIndex);
    }

    function prevMessage() {
        currentIndex = (currentIndex - 1 + bannerElements.length) % bannerElements.length;
        updateBanner(currentIndex);
    }

    function startAutoScroll() {
        autoScroll = setInterval(nextMessage, 3000);
    }

    function resetAutoScroll() {
        clearInterval(autoScroll);
        startAutoScroll();
    }

    function setupNavigation() {
        if (prevBtn) {
            prevBtn.addEventListener("click", () => {
                prevMessage();
                resetAutoScroll();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", () => {
                nextMessage();
                resetAutoScroll();
            });
        }
    }
}