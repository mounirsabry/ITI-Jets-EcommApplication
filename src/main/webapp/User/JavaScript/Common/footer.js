import URL_Mapper from "../Utils/URL_Mapper.js"

document.addEventListener("DOMContentLoaded", () => {
  const footerContainer = document.getElementById("siteFooter")
  if (!footerContainer) {
    console.log("Could not load the footer component.")
    return
  }

  footerContainer.innerHTML = `
        <div>
            <p>
                <span>&copy; 2025 Book Alley</span>
                <span class="pipe">|</span>
                <span>Contact: support@bookalley.com</span>
                <span class="pipe">|</span>
                <span>Phone: +20 123 456 789</span>
            </p>
            <div class="social-links">
                <a href="#" aria-label="Facebook">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                </a>
                <a href="#" aria-label="Twitter">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                </a>
                <a href="#" aria-label="Instagram">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                </a>
            </div>
            <a target="_blank" id="aboutUSLink">About Us</a>
        </div>
    `

  document.getElementById("aboutUSLink").href = URL_Mapper.ABOUT
})
