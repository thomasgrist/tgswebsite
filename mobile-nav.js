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

/**
 * Sticky Action Buttons Controller
 * Handles CV download, LinkedIn redirect, email, and call functionality
 */
class StickyButtons {
    constructor() {
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupButtons());
        } else {
            this.setupButtons();
        }
    }
    
    setupButtons() {
        // Desktop sticky buttons
        const cvButton = document.querySelector('.sticky-buttons .cv-button');
        const linkedinButton = document.querySelector('.sticky-buttons .linkedin-button');
        const emailButton = document.querySelector('.sticky-buttons .email-button');
        const callButton = document.querySelector('.sticky-buttons .call-button');
        
        // Mobile navigation buttons (Contact section)
        const mobileCvButton = document.querySelector('.nav-section .nav-link.cv-button');
        const mobileLinkedinButton = document.querySelector('.nav-section .nav-link.linkedin-button');
        const mobileEmailButton = document.querySelector('.nav-section .nav-link.email-button');
        const mobileCallButton = document.querySelector('.nav-section .nav-link.call-button');
        
        // Bind desktop sticky buttons
        if (cvButton) {
            cvButton.addEventListener('click', this.handleCVDownload.bind(this));
        }
        
        if (linkedinButton) {
            linkedinButton.addEventListener('click', this.handleLinkedInClick.bind(this));
        }
        
        if (emailButton) {
            emailButton.addEventListener('click', this.handleEmailClick.bind(this));
        }
        
        if (callButton) {
            callButton.addEventListener('click', this.handleCallClick.bind(this));
        }
        
        // Bind mobile navigation buttons (only on mobile when Contact section is visible)
        if (mobileCvButton) {
            mobileCvButton.addEventListener('click', this.handleCVDownload.bind(this));
        }
        
        if (mobileLinkedinButton) {
            mobileLinkedinButton.addEventListener('click', this.handleLinkedInClick.bind(this));
        }
        
        if (mobileEmailButton) {
            mobileEmailButton.addEventListener('click', this.handleEmailClick.bind(this));
        }
        
        if (mobileCallButton) {
            mobileCallButton.addEventListener('click', this.handleCallClick.bind(this));
        }
    }
    
    handleCVDownload() {
        // Open CV PDF from downloads folder in new browser window
        window.open('downloads/Thomas-Grist_Lead-Product-Designer_CV.pdf', '_blank', 'noopener,noreferrer');
    }
    
    handleLinkedInClick() {
        // Open LinkedIn profile in new window
        const linkedInURL = 'https://www.linkedin.com/in/thomas-grist-abb95a50/';
        window.open(linkedInURL, '_blank', 'noopener,noreferrer');
    }
    
    handleEmailClick() {
        // Open new email with specific subject line in new window
        const email = 'thomasgrist@gmail.com';
        const subject = 'Email from thomasgrist.co.uk';
        const mailtoURL = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
        window.open(mailtoURL, '_blank');
    }
    
    handleCallClick() {
        // Open phone dialer for UK phone number
        const phoneNumber = '+447931042702';
        const telURL = `tel:${phoneNumber}`;
        window.location.href = telURL;
    }
}

/**
 * Resize Animation Stopper
 * Prevents unwanted animations during window resize
 */
class ResizeAnimationStopper {
    constructor() {
        this.resizeTimer = null;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupResizeHandler());
        } else {
            this.setupResizeHandler();
        }
    }
    
    setupResizeHandler() {
        window.addEventListener('resize', () => {
            // Add class to disable animations
            document.body.classList.add('resize-animation-stopper');
            
            // Clear existing timer
            clearTimeout(this.resizeTimer);
            
            // Remove class after resize is finished (100ms delay)
            this.resizeTimer = setTimeout(() => {
                document.body.classList.remove('resize-animation-stopper');
            }, 100);
        });
    }
}

// Initialize all controllers when script loads
new MobileNavigation();
new StickyButtons();
new ResizeAnimationStopper(); 