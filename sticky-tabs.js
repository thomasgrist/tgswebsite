// Sticky Tabs and Active State Functionality
document.addEventListener('DOMContentLoaded', function() {
    const tabsComponent = document.querySelector('.case-study-tabs-component');
    const tabsContainer = document.querySelector('.case-study-tabs-container');
    const tabs = document.querySelectorAll('.case-study-tab');
    
    if (!tabsComponent || !tabsContainer || !tabs.length) return;
    
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
    
    // Note: Using getBoundingClientRect() for more reliable sticky detection
    
    function updateActiveIndicator(activeTab) {
        const tabRect = activeTab.getBoundingClientRect();
        const containerRect = tabsContainer.getBoundingClientRect();
        
        const left = tabRect.left - containerRect.left;
        const width = tabRect.width;
        
        tabsContainer.style.setProperty('--indicator-left', `${left}px`);
        tabsContainer.style.setProperty('--indicator-width', `${width}px`);
        
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
    tabsContainer.style.setProperty('--indicator-left', '0px');
    tabsContainer.style.setProperty('--indicator-width', '0px');
    
    // Temporarily disable transition for initial positioning
    const indicatorElement = window.getComputedStyle(tabsContainer, '::after');
    tabsContainer.style.setProperty('--disable-transition', '1');
    
    // Check initial state without animation
    handleScroll();
    
    // Re-enable transitions after a brief delay
    setTimeout(() => {
        tabsContainer.style.removeProperty('--disable-transition');
    }, 50);
    
    // Listen for scroll events
    window.addEventListener('scroll', handleScroll);
    
    // Recalculate on window resize
    window.addEventListener('resize', function() {
        handleScroll();
    });
}); 