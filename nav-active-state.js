/**
 * Navigation Active State Handler
 * Adds active class to navigation items that match the current page
 * Executes immediately to prevent visual flicker
 */

(function() {
    // Get the current page filename
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Define the mapping between pages and their navigation text
    const pageNavMapping = {
        'index.html': null, // Homepage doesn't have a specific nav item
        'whereby.html': 'Whereby',
        'sky-comcast.html': 'Sky & Comcast', 
        'rio-esg.html': 'Rio ESG',
        'deltatre.html': 'Deltatre',
        'audi.html': 'Audi',
        'backlog.html': 'Backlog',
        'release-notes.html': 'Release notes'
    };
    
    // Get the navigation text for the current page
    const currentNavText = pageNavMapping[currentPage];
    
    if (currentNavText) {
        // Find all navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        
        navLinks.forEach(link => {
            // Check if this link contains the current page text
            const navText = link.querySelector('.nav-text');
            if (navText && navText.textContent.trim() === currentNavText) {
                // Add active class to the parent nav-item
                const navItem = link.closest('.nav-item');
                if (navItem) {
                    navItem.classList.add('active');
                }
            }
        });
    }
})(); 