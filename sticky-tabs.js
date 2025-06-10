// Sticky Tabs and Active State Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabsComponent = document.querySelector('.case-study-tabs-component');
    const tabsContainer = document.querySelector('.case-study-tabs-container');
    const tabsNavWrapper = document.querySelector('.case-study-tabs-nav-wrapper');
    const tabsNav = document.querySelector('.case-study-tabs-nav');
    const tabs = document.querySelectorAll('.case-study-tab');
    const prevBtn = document.querySelector('.tabs-nav-prev');
    const nextBtn = document.querySelector('.tabs-nav-next');
    
    if (!tabsComponent || !tabsContainer || !tabsNavWrapper || !tabsNav || !tabs.length) return;
    
    // Section mapping
    const sections = [
        { id: 'overview', tab: tabs[0] },
        { id: 'process', tab: tabs[1] },
        { id: 'research', tab: tabs[2] },
        { id: 'design', tab: tabs[3] },
        { id: 'testing', tab: tabs[4] },
        { id: 'implementation', tab: tabs[5] },
        { id: 'results', tab: tabs[6] }
    ];
    
    // Tab Navigation Functionality
    function checkTabOverflow() {
        if (window.innerWidth >= 481) { // On larger mobile, tablet and desktop
            const navWidth = tabsNav.scrollWidth;
            const containerWidth = tabsNavWrapper.clientWidth;
            const hasOverflow = navWidth > containerWidth;
            
            if (hasOverflow) {
                tabsNavWrapper.classList.add('has-overflow');
            } else {
                tabsNavWrapper.classList.remove('has-overflow');
            }
            
            updateNavButtonStates();
        } else {
            tabsNavWrapper.classList.remove('has-overflow');
        }
    }
    
    function updateNavButtonStates() {
        if (!prevBtn || !nextBtn) return;
        
        const scrollLeft = tabsNav.scrollLeft;
        const maxScroll = tabsNav.scrollWidth - tabsNav.clientWidth;
        
        // Update button disabled states
        prevBtn.disabled = scrollLeft <= 0;
        nextBtn.disabled = scrollLeft >= maxScroll - 1; // -1 for rounding tolerance
    }
    
    function scrollTabs(direction) {
        const scrollAmount = 240; // Pixels to scroll - enough to reveal 1-2 more tabs
        const currentScroll = tabsNav.scrollLeft;
        
        if (direction === 'prev') {
            tabsNav.scrollTo({
                left: Math.max(0, currentScroll - scrollAmount),
                behavior: 'smooth'
            });
        } else {
            const maxScroll = tabsNav.scrollWidth - tabsNav.clientWidth;
            tabsNav.scrollTo({
                left: Math.min(maxScroll, currentScroll + scrollAmount),
                behavior: 'smooth'
            });
        }
        
        // Update button states after scroll completes
        setTimeout(updateNavButtonStates, 300);
    }
    
    // Add event listeners for navigation buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => scrollTabs('prev'));
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => scrollTabs('next'));
    }
    
    // Listen for manual scroll to update button states
    tabsNav.addEventListener('scroll', updateNavButtonStates);
    
    // Note: Using getBoundingClientRect() for more reliable sticky detection
    
    function updateActiveIndicator(activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const navRect = tabsNav.getBoundingClientRect();
        
        const left = tabRect.left - navRect.left;
        const width = tabRect.width;
        
        tabsNav.style.setProperty('--indicator-left', `${left}px`);
        tabsNav.style.setProperty('--indicator-width', `${width}px`);
        
        // Update active class
        tabs.forEach(tab => tab.classList.remove('active'));
        activeTab.classList.add('active');
    }
    
    function getActiveSection() {
        const scrollPos = window.scrollY + 250; // Offset for better detection
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i].id);
            if (section && section.offsetTop <= scrollPos) {
                return sections[i];
            }
        }
        
        return sections[0]; // Default to overview
    }
    
    function checkStickyState() {
        const tabsRect = tabsComponent.getBoundingClientRect();
        const isSticky = tabsRect.top <= 72; // Check if tabs are at or above the sticky threshold
        
        if (isSticky) {
            // Tabs are sticky
            tabsComponent.classList.add('is-stuck');
        } else {
            // Tabs are in normal position
            tabsComponent.classList.remove('is-stuck');
        }
    }
    
    function handleScroll() {
        checkStickyState();
        
        const activeSection = getActiveSection();
        updateActiveIndicator(activeSection.tab);
    }
    
    // Initialize CSS custom properties and disable transition for initial load
    tabsNav.style.setProperty('--indicator-left', '0px');
    tabsNav.style.setProperty('--indicator-width', '0px');
    tabsNav.style.setProperty('--hover-indicator-left', '-100px');
    tabsNav.style.setProperty('--hover-indicator-width', '0px');
    tabsNav.style.setProperty('--hover-indicator-opacity', '0');
    
    // Temporarily disable transition for initial positioning
    const indicatorElement = window.getComputedStyle(tabsNav, '::after');
    tabsNav.style.setProperty('--disable-transition', '1');
    
    // Check initial state without animation
    handleScroll();
    checkTabOverflow();
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
        tabsNav.style.removeProperty('--disable-transition');
    }, 50);
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Recalculate on window resize
    window.addEventListener('resize', function() {
        handleScroll();
        checkTabOverflow();
    });
    
    // Add hover effects for tabs
    tabs.forEach(tab => {
        tab.addEventListener('mouseenter', function() {
            const tabRect = tab.getBoundingClientRect();
            const navRect = tabsNav.getBoundingClientRect();
            const left = tabRect.left - navRect.left;
            const width = tabRect.width;
            
            tabsNav.style.setProperty('--hover-indicator-left', left + 'px');
            tabsNav.style.setProperty('--hover-indicator-width', width + 'px');
            tabsNav.style.setProperty('--hover-indicator-opacity', '1');
        });
        
        tab.addEventListener('mouseleave', function() {
            tabsNav.style.setProperty('--hover-indicator-opacity', '0');
        });
    });
    
    // Hide hover indicator when leaving the container
    tabsNav.addEventListener('mouseleave', function() {
        tabsNav.style.setProperty('--hover-indicator-opacity', '0');
    });
    
    // Add back to top functionality
    const backToTopBtn = document.querySelector('.back-to-top-btn');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            // Very fast custom scroll animation
            const startPosition = window.pageYOffset;
            const duration = 200; // Much faster - 200ms
            const startTime = performance.now();
            
            function scrollAnimation(currentTime) {
                const elapsed = currentTime - startTime;
                const progress = elapsed / duration;
                
                if (progress >= 1) {
                    // Ensure we reach exactly 0
                    window.scrollTo(0, 0);
                    return;
                }
                
                // Pure linear interpolation - no easing at all
                const position = Math.round(startPosition * (1 - progress));
                window.scrollTo(0, position);
                requestAnimationFrame(scrollAnimation);
            }
            
            scrollAnimation(performance.now());
        });
    }
}); 