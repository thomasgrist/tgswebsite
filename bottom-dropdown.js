/**
 * Bottom Dropdown Menu Controller
 * Shows a fixed dropdown menu at the bottom of the screen after scrolling 500px
 * Updates the current section based on scroll position
 * Opens an interactive menu when clicked
 */

class BottomDropdownMenu {
    constructor() {
        this.isVisible = true;
        this.isMenuOpen = false;
        this.currentSection = 'Overview';
        this.companyName = this.getCompanyName();
        this.sections = this.getSections();
        this.manualSelectionActive = false; // Flag to prevent scroll override after manual selection
        this.manualSelectionTimer = null;
        this.lastScrollY = window.scrollY; // Track scroll position for manual scroll detection
        
        this.init();
    }

    init() {
        this.createDropdownElement();
        this.bindEvents();
        this.updateSectionOnScroll();
        this.showDropdown(); // Show immediately
    }

    getCompanyName() {
        // Special case for backlog page - always show "Backlog" in dropdown
        const isBacklogPage = window.location.pathname.includes('backlog.html') || 
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'thomasgrist.co.uk';
        if (isBacklogPage) {
            return 'Backlog';
        }
        
        // Try to get company name from the page content
        const companyElement = document.querySelector('.project-tile-company');
        if (companyElement) {
            return companyElement.textContent.trim();
        }
        
        // Fallback to extracting from title
        const title = document.title;
        const match = title.match(/- (.*?) -/);
        if (match) {
            return match[1];
        }
        
        return 'Company'; // Default fallback
    }

    getSections() {
        // Get all section elements with IDs
        const sections = document.querySelectorAll('[id]');
        
        // Check if we're on the Whereby page
        const isWherebyPage = window.location.pathname.includes('whereby.html') || 
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'Whereby';
        
        // Check if we're on the Sky & Comcast page
        const isSkyComcastPage = window.location.pathname.includes('sky-comcast.html') || 
                                 document.querySelector('.project-tile-company')?.textContent.trim() === 'Sky & Comcast';
        
        // Check if we're on the Rio ESG page
        const isRioESGPage = window.location.pathname.includes('rio-esg.html') || 
                             document.querySelector('.project-tile-company')?.textContent.trim() === 'Rio ESG';
        
        // Check if we're on the Deltatre page
        const isDeltaTreePage = window.location.pathname.includes('deltatre.html') || 
                                document.querySelector('.project-tile-company')?.textContent.trim() === 'Deltatre';
        
        // Check if we're on the Audi page
        const isAudiPage = window.location.pathname.includes('audi.html') || 
                           document.querySelector('.project-tile-company')?.textContent.trim() === 'Audi @ BBH';
        
        // Check if we're on the Backlog page
        const isBacklogPage = window.location.pathname.includes('backlog.html') || 
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'Backlog' ||
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'thomasgrist.co.uk';
        
        let sectionMap;
        if (isBacklogPage) {
            // Custom sections for Backlog page
            sectionMap = {
                'overview': 'Overview',
                'p1': 'P1',
                'p2': 'P2',
                'p3': 'P3',
                'p4': 'P4'
            };
        } else if (isWherebyPage) {
            // Custom sections for Whereby page
            sectionMap = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isSkyComcastPage) {
            // Custom sections for Sky & Comcast page
            sectionMap = {
                'overview': 'Overview',
                'research': 'Final Designs',
                'success-definition': 'Workings'
            };
        } else if (isRioESGPage) {
            // Custom sections for Rio ESG page
            sectionMap = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isDeltaTreePage) {
            // Custom sections for Deltatre page
            sectionMap = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isAudiPage) {
            // Custom sections for Audi page
            sectionMap = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'pitch': 'Pitch',
                'workings': 'Workings'
            };
        } else {
            // Default sections for other pages
            sectionMap = {
                'overview': 'Overview',
                'process': 'Process',
                'research': 'Research', 
                'design': 'Design',
                'testing': 'Testing',
                'implementation': 'Implementation',
                'results': 'Results'
            };
        }

        const availableSections = [];
        sections.forEach(section => {
            if (section.id && sectionMap[section.id]) {
                availableSections.push({
                    id: section.id,
                    name: sectionMap[section.id],
                    element: section
                });
            }
        });

        return availableSections;
    }

    createDropdownElement() {
        const dropdown = document.createElement('div');
        dropdown.className = 'bottom-dropdown-menu';
        dropdown.innerHTML = `
            <div class="dropdown-container">
                <span class="dropdown-company-name">${this.companyName}</span>
                <div class="dropdown-separator"></div>
                <span class="dropdown-current-section">${this.currentSection}</span>
                <div class="dropdown-arrow">
                    <svg viewBox="0 0 8.49 8.49" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1.5 3L4.25 5.75L7 3" stroke="currentColor" stroke-width="1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </div>
                ${this.createDropdownMenu()}
            </div>
        `;

        document.body.appendChild(dropdown);
        this.dropdownElement = dropdown;
        this.containerElement = dropdown.querySelector('.dropdown-container');
        this.menuElement = dropdown.querySelector('.dropdown-menu');
        this.arrowElement = dropdown.querySelector('.dropdown-arrow');
    }

    createDropdownMenu() {
        const scrollY = window.scrollY;
        let menuItems = '';
        
        // Add back to top option first, but only if scrolled more than 1000px
        if (scrollY >= 1000) {
            menuItems += `
                <li class="dropdown-menu-item">
                    <button class="dropdown-menu-link back-to-top" data-section="top">
                        <img src="img/nav-arrow-grey.svg" alt="" class="dropdown-menu-icon">
                        Back to top
                    </button>
                </li>
            `;
        }
        
        // Add section navigation items
        this.sections.forEach(section => {
            menuItems += `
                <li class="dropdown-menu-item">
                    <button class="dropdown-menu-link" data-section="${section.id}">
                        ${section.name}
                    </button>
                </li>
            `;
        });

        return `
            <div class="dropdown-menu">
                <ul class="dropdown-menu-list">
                    ${menuItems}
                </ul>
            </div>
        `;
    }

    bindEvents() {
        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    // Detect significant manual scrolling and re-enable scroll-based updates
                    const currentScrollY = window.scrollY;
                    const scrollDifference = Math.abs(currentScrollY - this.lastScrollY);
                    
                    // If user scrolls manually by more than 100px while manual selection is active,
                    // re-enable scroll-based updates (they're manually scrolling, not using dropdown)
                    if (this.manualSelectionActive && scrollDifference > 100) {
                        this.manualSelectionActive = false;
                        if (this.manualSelectionTimer) {
                            clearTimeout(this.manualSelectionTimer);
                            this.manualSelectionTimer = null;
                        }
                    }
                    
                    this.lastScrollY = currentScrollY;
                    this.updateSectionOnScroll();
                    this.checkBackToTopVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        // Handle dropdown container clicks
        this.containerElement.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMenu();
        });

        // Handle menu item clicks
        this.bindMenuEvents();

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.dropdownElement.contains(e.target) && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
    }

    showDropdown() {
        this.isVisible = true;
        this.dropdownElement.classList.add('visible');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.containerElement.classList.remove('menu-open');
        this.arrowElement.classList.remove('menu-open');
        this.menuElement.classList.remove('visible');
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.containerElement.classList.add('menu-open');
        this.arrowElement.classList.add('menu-open');
        this.menuElement.classList.add('visible');
        this.updateMenuItems();
    }

    updateMenuItems() {
        // Menu items no longer show active state
        // This method is kept for potential future functionality
    }

    checkBackToTopVisibility() {
        const scrollY = window.scrollY;
        const shouldShowBackToTop = scrollY >= 1000;
        const currentlyHasBackToTop = this.menuElement.querySelector('.back-to-top') !== null;

        // Only regenerate menu if the back to top visibility needs to change
        if (shouldShowBackToTop !== currentlyHasBackToTop) {
            this.updateDropdownMenu();
        }
    }

    updateDropdownMenu() {
        // Regenerate the menu HTML
        const newMenuHTML = this.createDropdownMenu();
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newMenuHTML;
        
        // Replace the existing menu with the new one
        const newMenuElement = tempDiv.querySelector('.dropdown-menu');
        this.menuElement.innerHTML = newMenuElement.innerHTML;
        
        // Re-bind menu item click events
        this.bindMenuEvents();
    }

    bindMenuEvents() {
        // Handle menu item clicks
        this.menuElement.addEventListener('click', (e) => {
            const menuLink = e.target.closest('.dropdown-menu-link');
            if (menuLink) {
                e.preventDefault();
                e.stopPropagation();
                const sectionId = menuLink.getAttribute('data-section');
                this.navigateToSection(sectionId);
                this.closeMenu();
            }
        });
    }

    getCurrentSectionId() {
        const scrollY = window.scrollY;
        // Add 64px threshold offset for desktop - section becomes active when it's within 64px of viewport top
        // Keep 0 offset for mobile to maintain current behavior
        const thresholdOffset = window.innerWidth > 768 ? 64 : 0;

        // Check if we're at the very top
        if (scrollY < 50) {
            return 'top';
        }

        // Find the current section based on scroll position
        // Section becomes active when it reaches the threshold offset from the top of the viewport
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            const sectionTop = section.element.offsetTop;
            
            if (scrollY + thresholdOffset >= sectionTop) {
                return section.id;
            }
        }

        return this.sections[0]?.id || 'overview';
    }

    updateSectionOnScroll() {
        // Don't update if user just made a manual selection from dropdown
        if (this.manualSelectionActive) {
            return;
        }
        
        const currentSectionId = this.getCurrentSectionId();
        
        // Check if we're on the Whereby page
        const isWherebyPage = window.location.pathname.includes('whereby.html') || 
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'Whereby';
        
        // Check if we're on the Sky & Comcast page
        const isSkyComcastPage = window.location.pathname.includes('sky-comcast.html') || 
                                 document.querySelector('.project-tile-company')?.textContent.trim() === 'Sky & Comcast';
        
        // Check if we're on the Rio ESG page
        const isRioESGPage = window.location.pathname.includes('rio-esg.html') || 
                             document.querySelector('.project-tile-company')?.textContent.trim() === 'Rio ESG';
        
        // Check if we're on the Deltatre page
        const isDeltaTreePage = window.location.pathname.includes('deltatre.html') || 
                                document.querySelector('.project-tile-company')?.textContent.trim() === 'Deltatre';
        
        // Check if we're on the Audi page
        const isAudiPage = window.location.pathname.includes('audi.html') || 
                           document.querySelector('.project-tile-company')?.textContent.trim() === 'Audi @ BBH';
        
        // Check if we're on the Backlog page
        const isBacklogPage = window.location.pathname.includes('backlog.html') || 
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'Backlog' ||
                              document.querySelector('.project-tile-company')?.textContent.trim() === 'thomasgrist.co.uk';
        
        let sectionNames;
        if (isBacklogPage) {
            // Custom sections for Backlog page
            sectionNames = {
                'p1': 'P1',
                'p2': 'P2',
                'p3': 'P3',
                'p4': 'P4'
            };
        } else if (isWherebyPage) {
            // Custom sections for Whereby page
            sectionNames = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isSkyComcastPage) {
            // Custom sections for Sky & Comcast page
            sectionNames = {
                'overview': 'Overview',
                'research': 'Final Designs',
                'success-definition': 'Workings'
            };
        } else if (isRioESGPage) {
            // Custom sections for Rio ESG page
            sectionNames = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isDeltaTreePage) {
            // Custom sections for Deltatre page
            sectionNames = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'workings': 'Workings'
            };
        } else if (isAudiPage) {
            // Custom sections for Audi page
            sectionNames = {
                'overview': 'Overview',
                'final-designs': 'Final Designs',
                'pitch': 'Pitch',
                'workings': 'Workings'
            };
        } else {
            // Default sections for other pages
            sectionNames = {
                'overview': 'Overview',
                'process': 'Process',
                'research': 'Research', 
                'design': 'Design',
                'testing': 'Testing',
                'implementation': 'Implementation',
                'results': 'Results'
            };
        }

        const newSectionName = sectionNames[currentSectionId] || 'Overview';
        
        if (newSectionName !== this.currentSection) {
            this.currentSection = newSectionName;
            this.updateDropdownContent();
        }
    }

    updateDropdownContent() {
        const sectionElement = this.dropdownElement.querySelector('.dropdown-current-section');
        if (sectionElement) {
            sectionElement.textContent = this.currentSection;
        }
    }

    navigateToSection(sectionId) {
        // Set flag to prevent scroll-based updates from overriding manual selection
        this.manualSelectionActive = true;
        
        // Clear any existing timer
        if (this.manualSelectionTimer) {
            clearTimeout(this.manualSelectionTimer);
        }
        
        // Update dropdown label immediately when user clicks on a section
        if (sectionId === 'top') {
            // For "back to top", set to Overview (first section)
            this.currentSection = 'Overview';
            this.updateDropdownContent();
            
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Find the section and update the dropdown label immediately
            const section = this.sections.find(s => s.id === sectionId);
            if (section) {
                // Update the dropdown button label immediately
                this.currentSection = section.name;
                this.updateDropdownContent();
                
                // Scroll to exactly the section position so dropdown updates correctly
                // Add 1px to ensure we cross the threshold and trigger the dropdown update
                let offsetTop = section.element.offsetTop + 1;
                
                // Apply offset to prevent content from appearing behind sticky menu
                if (window.innerWidth <= 768) {
                    // Mobile: larger offset for mobile menu
                    offsetTop = Math.max(0, offsetTop - 80);
                } else {
                    // Desktop: 56px offset from viewport top
                    offsetTop = Math.max(0, offsetTop - 56);
                }
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
        
        // Re-enable scroll-based updates after scroll animation completes
        // Wait longer than the scroll animation (typically 500-1000ms)
        this.manualSelectionTimer = setTimeout(() => {
            this.manualSelectionActive = false;
        }, 1500);
    }
}

// Initialize the dropdown menu when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BottomDropdownMenu();
});

// Handle browser resize to prevent animation glitches
let resizeTimer;
window.addEventListener('resize', () => {
    document.body.classList.add('resize-animation-stopper');
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        document.body.classList.remove('resize-animation-stopper');
    }, 300);
}); 