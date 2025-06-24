/**
 * Navigation Active State Handler
 * Adds active class to navigation items that match the current page
 * Waits for DOM to be fully loaded to prevent race conditions
 */

function setNavigationActiveState() {
    console.log('Setting navigation active state...');
    
    // Get the current page filename
    let currentPage = window.location.pathname.split('/').pop() || 'index.html';
    console.log('Current page (raw):', currentPage);
    console.log('Full pathname:', window.location.pathname);
    
    // Handle URLs without .html extension (common in live environments)
    if (currentPage && !currentPage.includes('.') && currentPage !== '') {
        currentPage = currentPage + '.html';
        console.log('Added .html extension, current page now:', currentPage);
    }
    
    // Fallback for root/homepage
    if (!currentPage || currentPage === '.html') {
        currentPage = 'index.html';
    }
    
    console.log('Final current page:', currentPage);
    
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
    console.log('Expected nav text:', currentNavText);
    
    if (currentNavText) {
        // Find all navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        console.log('Found nav links:', navLinks.length);
        
        let activeFound = false;
        
        navLinks.forEach((link, index) => {
            // Check if this link contains the current page text
            const navText = link.querySelector('.nav-text');
            if (navText) {
                const linkText = navText.textContent.trim();
                console.log(`Nav link ${index}: "${linkText}"`);
                
                if (linkText === currentNavText) {
                    // Add active class to the parent nav-item
                    const navItem = link.closest('.nav-item');
                    if (navItem) {
                        navItem.classList.add('active');
                        console.log('✅ Added active class to:', currentNavText);
                        activeFound = true;
                    } else {
                        console.warn('⚠️ Could not find nav-item parent for:', linkText);
                    }
                }
            } else {
                console.log(`Nav link ${index}: No .nav-text found`);
            }
        });
        
        if (!activeFound) {
            console.warn('⚠️ No matching navigation item found for:', currentNavText);
        }
    } else {
        console.log('No nav text mapping found for current page (this is normal for homepage)');
    }
}

// Execute when DOM is fully loaded
if (document.readyState === 'loading') {
    console.log('DOM is loading, waiting for DOMContentLoaded...');
    document.addEventListener('DOMContentLoaded', setNavigationActiveState);
} else {
    // DOM is already loaded
    console.log('DOM already loaded, executing immediately...');
    setNavigationActiveState();
} 