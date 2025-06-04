/**
 * Mobile Navigation Controller
 * Handles hamburger menu toggle and mobile navigation behavior
 */
class MobileNavigation {
    constructor() {
        this.menuToggle = null;
        this.navigation = null;
        this.overlay = null;
        this.isMenuOpen = false;
        
        this.init();
    }
    
    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupElements());
        } else {
            this.setupElements();
        }
    }
    
    setupElements() {
        this.menuToggle = document.querySelector('.mobile-menu-toggle');
        this.navigation = document.querySelector('.left-navigation');
        this.overlay = document.querySelector('.mobile-nav-overlay');
        
        if (this.menuToggle && this.navigation && this.overlay) {
            this.bindEvents();
        }
    }
    
    bindEvents() {
        // Hamburger button click
        this.menuToggle.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleMenu();
        });
        
        // Overlay click to close menu
        this.overlay.addEventListener('click', () => {
            this.closeMenu();
        });
        
        // Close menu when clicking navigation links
        const navLinks = this.navigation.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => {
            // Close menu if window is resized to desktop size
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });
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
        this.menuToggle.classList.add('menu-open');
        this.navigation.classList.add('menu-open');
        this.overlay.classList.add('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
        
        // Focus management for accessibility
        this.navigation.setAttribute('aria-hidden', 'false');
        this.menuToggle.setAttribute('aria-expanded', 'true');
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggle.classList.remove('menu-open');
        this.navigation.classList.remove('menu-open');
        this.overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Focus management for accessibility
        this.navigation.setAttribute('aria-hidden', 'true');
        this.menuToggle.setAttribute('aria-expanded', 'false');
    }
}

// Initialize mobile navigation when script loads
new MobileNavigation(); 