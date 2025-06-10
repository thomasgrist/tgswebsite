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
        
        this.init();
    }

    init() {
        this.createDropdownElement();
        this.bindEvents();
        this.updateSectionOnScroll();
        this.showDropdown(); // Show immediately
    }

    getCompanyName() {
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
        const sectionMap = {
            'overview': 'Overview',
            'process': 'Process',
            'research': 'Research', 
            'design': 'Design',
            'testing': 'Testing',
            'implementation': 'Implementation',
            'results': 'Results'
        };

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
        const offset = 100;

        // Check if we're at the very top
        if (scrollY < 50) {
            return 'top';
        }

        // Find the current section based on scroll position
        for (let i = this.sections.length - 1; i >= 0; i--) {
            const section = this.sections[i];
            const sectionTop = section.element.offsetTop;
            
            if (scrollY + offset >= sectionTop) {
                return section.id;
            }
        }

        return this.sections[0]?.id || 'overview';
    }

    updateSectionOnScroll() {
        const currentSectionId = this.getCurrentSectionId();
        const sectionNames = {
            'overview': 'Overview',
            'process': 'Process',
            'research': 'Research', 
            'design': 'Design',
            'testing': 'Testing',
            'implementation': 'Implementation',
            'results': 'Results'
        };

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
        if (sectionId === 'top') {
            // Smooth scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Find the section and scroll to it
            const section = this.sections.find(s => s.id === sectionId);
            if (section) {
                const offsetTop = section.element.offsetTop - 100; // Account for header
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }
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