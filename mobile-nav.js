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
        this.scrollThreshold = 5; // Same threshold as header scroll
        
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
    
    handleMobileMenuScroll() {
        // Only handle scroll when menu is open and on mobile
        if (!this.isMenuOpen || window.innerWidth > 768) {
            return;
        }
        
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > this.scrollThreshold) {
            this.navigation.classList.add('scrolled');
        } else {
            this.navigation.classList.remove('scrolled');
        }
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
        
        // Fade out the mobile call button
        const mobileCallButton = document.querySelector('.mobile-controls-group .call-button');
        if (mobileCallButton) {
            mobileCallButton.classList.add('faded-out');
        }
        
        // Feedback widget removed - no longer needed
        
        // Fade out the header border
        const fixedHeader = document.querySelector('.fixed-header');
        if (fixedHeader) {
            console.log('Mobile menu opening: Adding border-faded-out class to header');
            fixedHeader.classList.add('border-faded-out');
        } else {
            console.log('Mobile menu opening: Fixed header not found');
        }
        
        // Reset scroll position to top when menu opens
        this.navigation.scrollTop = 0;
        
        // Allow page scrolling - the navigation handles its own scrolling
        // document.body.style.overflow = 'hidden'; // Removed to allow page scrolling
        
        // Focus management for accessibility
        this.navigation.setAttribute('aria-hidden', 'false');
        this.menuToggle.setAttribute('aria-expanded', 'true');
        
        // Add scroll listener for mobile menu padding adjustment
        if (window.innerWidth <= 768) {
            this.scrollListener = () => this.handleMobileMenuScroll();
            window.addEventListener('scroll', this.scrollListener);
            // Check initial scroll position
            this.handleMobileMenuScroll();
        }
    }
    
    closeMenu() {
        this.isMenuOpen = false;
        this.menuToggle.classList.remove('menu-open');
        this.navigation.classList.remove('menu-open');
        this.overlay.classList.remove('active');
        
        // Fade in the mobile call button
        const mobileCallButton = document.querySelector('.mobile-controls-group .call-button');
        if (mobileCallButton) {
            mobileCallButton.classList.remove('faded-out');
        }
        
        // Feedback widget removed - no longer needed
        
        // Fade in the header border
        const fixedHeader = document.querySelector('.fixed-header');
        if (fixedHeader) {
            console.log('Mobile menu closing: Removing border-faded-out class from header');
            fixedHeader.classList.remove('border-faded-out');
        } else {
            console.log('Mobile menu closing: Fixed header not found');
        }
        
        // Body scroll was never disabled, so no need to restore
        // document.body.style.overflow = ''; // Removed since we don't disable scrolling
        
        // Focus management for accessibility
        this.navigation.setAttribute('aria-hidden', 'true');
        this.menuToggle.setAttribute('aria-expanded', 'false');
        
        // Remove scroll listener for mobile menu padding adjustment
        if (this.scrollListener) {
            window.removeEventListener('scroll', this.scrollListener);
            this.scrollListener = null;
        }
        
        // Remove scrolled class when menu closes
        this.navigation.classList.remove('scrolled');
        
        // Force remove any persistent hover states on touch devices
        if ('ontouchstart' in window) {
            this.menuToggle.blur();
        }
    }
}

/**
 * Sticky Action Buttons Controller
 * Handles CV download, LinkedIn redirect, email, and call functionality
 */
class StickyButtons {
    constructor() {
        this.activeTooltip = null;
        this.activeButton = null;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupButtons());
        } else {
            this.setupButtons();
        }
        
        // Add resize event listener to reposition tooltip
        let resizeTimeout;
        window.addEventListener('resize', () => {
            if (this.activeTooltip && this.activeButton) {
                // Clear previous timeout
                clearTimeout(resizeTimeout);
                // Add small delay to ensure layout has settled, especially on mobile
                resizeTimeout = setTimeout(() => {
                    this.repositionTooltip();
                }, 50);
            }
        });
    }
    
    setupButtons() {
        // Header buttons
        const headerCvButton = document.querySelector('.header-buttons .cv-button');
        const headerLinkedinButton = document.querySelector('.header-buttons .linkedin-button');
        const headerEmailButton = document.querySelector('.header-buttons .email-button');
        const headerCallButton = document.querySelector('.header-buttons .call-button');
        
        // Mobile navigation buttons (Contact section)
        const mobileCvButton = document.querySelector('.nav-section .nav-link.cv-button');
        const mobileLinkedinButton = document.querySelector('.nav-section .nav-link.linkedin-button');
        const mobileEmailButton = document.querySelector('.nav-section .nav-link.email-button');
        const mobileCallButton = document.querySelector('.nav-section .nav-link.call-button');
        
        // Mobile controls group button (sticky header)
        const mobileControlsCallButton = document.querySelector('.mobile-controls-group .call-button');
        
        // Career timeline CV link
        const careerCvButton = document.querySelector('.career-cv-link.cv-button');
        
        // Bind all CV buttons (header, mobile nav, and career timeline)
        const allCvButtons = [headerCvButton, mobileCvButton, careerCvButton].filter(Boolean);
        allCvButtons.forEach(button => {
            button.addEventListener('click', this.handleCVDownload.bind(this));
        });
        
        // Bind header buttons
        if (headerLinkedinButton) {
            headerLinkedinButton.addEventListener('click', this.handleLinkedInClick.bind(this));
        }
        
        if (headerEmailButton) {
            headerEmailButton.addEventListener('click', this.handleEmailClick.bind(this));
        }
        
        if (headerCallButton) {
            headerCallButton.addEventListener('click', this.handleCallClick.bind(this));
        }
        
        // Bind mobile navigation buttons
        if (mobileLinkedinButton) {
            mobileLinkedinButton.addEventListener('click', this.handleLinkedInClick.bind(this));
        }
        
        if (mobileEmailButton) {
            mobileEmailButton.addEventListener('click', this.handleEmailClick.bind(this));
        }
        
        if (mobileCallButton) {
            mobileCallButton.addEventListener('click', this.handleCallClick.bind(this));
        }
        
        // Bind mobile controls group call button
        if (mobileControlsCallButton) {
            mobileControlsCallButton.addEventListener('click', this.handleCallClick.bind(this));
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
    
    handleCallClick(event) {
        const button = event.currentTarget;
        const isMobile = this.isMobileDevice();
        
        // On mobile devices, directly initiate phone call
        if (isMobile) {
            const phoneNumber = '07931-042702';
            const telURL = `tel:${phoneNumber}`;
            window.location.href = telURL;
            return;
        }
        
        // On desktop, show SVG tooltip (existing behavior)
        // Check if tooltip already exists for this button
        const existingTooltip = document.querySelector('.call-tooltip');
        if (existingTooltip) {
            // If clicking the same button, close the tooltip
            this.removeExistingTooltips();
            return;
        }
        
        // Remove any other existing tooltips
        this.removeExistingTooltips();
        
        // Add active state to button
        button.classList.add('tooltip-active');
        
        // Create tooltip element with SVG
        const tooltip = document.createElement('div');
        tooltip.className = 'call-tooltip';
        
        // Create and load the SVG image
        const svgImg = document.createElement('img');
        svgImg.src = 'img/call-tooltip.svg';
        svgImg.alt = 'Contact information';
        svgImg.style.display = 'block';
        svgImg.style.width = '133px';
        svgImg.style.height = '56px';
        
        tooltip.appendChild(svgImg);
        
        // Store references for resize handling
        this.activeTooltip = tooltip;
        this.activeButton = button;
        
        // Position tooltip underneath the button
        this.positionTooltip(tooltip, button);
        
        // Add tooltip to body
        document.body.appendChild(tooltip);
        
        // Set up event listeners for closing the tooltip
        const removeTooltip = () => {
            if (tooltip && tooltip.parentNode) {
                tooltip.classList.add('fade-out');
                setTimeout(() => {
                    if (tooltip.parentNode) {
                        tooltip.parentNode.removeChild(tooltip);
                    }
                }, 150);
            }
            // Clear references
            this.activeTooltip = null;
            this.activeButton = null;
            // Remove active state from button
            button.classList.remove('tooltip-active');
            // Clean up event listeners
            document.removeEventListener('click', handleDocumentClick);
            tooltip.removeEventListener('click', handleTooltipClick);
            window.removeEventListener('scroll', handleScroll);
        };

        // Handle scroll events to fade out tooltip
        const handleScroll = () => {
            removeTooltip();
        };
        
        // Handle clicks on the tooltip itself (close on click)
        const handleTooltipClick = (e) => {
            e.stopPropagation();
            removeTooltip();
        };
        
        // Handle clicks anywhere else on the document
        const handleDocumentClick = (e) => {
            // Don't close if clicking on any call button (handled by handleCallClick)
            if (e.target.closest('.call-button')) {
                return;
            }
            removeTooltip();
        };
        
        // Add event listeners with a small delay to prevent immediate closure
        setTimeout(() => {
            tooltip.addEventListener('click', handleTooltipClick);
            document.addEventListener('click', handleDocumentClick);
            window.addEventListener('scroll', handleScroll);
        }, 100);
    }
    
    /**
     * Detect if the user is on a mobile device
     * Uses multiple detection methods for better accuracy
     */
    isMobileDevice() {
        // Method 1: Check if touch events are supported
        const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        // Method 2: Check screen width (mobile-first approach)
        const isMobileWidth = window.innerWidth <= 768;
        
        // Method 3: User agent check for mobile devices
        const mobileUserAgents = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        const isMobileUserAgent = mobileUserAgents.test(navigator.userAgent);
        
        // Return true if any of the mobile indicators are present
        return hasTouch && (isMobileWidth || isMobileUserAgent);
    }
    
    removeExistingTooltips() {
        const existingTooltips = document.querySelectorAll('.call-tooltip');
        existingTooltips.forEach(tooltip => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        });
        // Clear references
        this.activeTooltip = null;
        this.activeButton = null;
        // Remove active state from all call buttons
        const allCallButtons = document.querySelectorAll('.call-button');
        allCallButtons.forEach(button => {
            button.classList.remove('tooltip-active');
        });
    }
    
    positionTooltip(tooltip, button) {
        const buttonRect = button.getBoundingClientRect();
        const isMobile = window.innerWidth <= 768;
        
        // Ensure the button is visible before positioning
        if (buttonRect.width === 0 || buttonRect.height === 0) {
            return;
        }
        
        tooltip.style.position = 'fixed';
        
        // Calculate horizontal position
        let leftPosition = buttonRect.left + (buttonRect.width / 2);
        
        // On mobile, ensure tooltip doesn't go off-screen
        if (isMobile) {
            const tooltipWidth = 133; // SVG width
            const viewportWidth = window.innerWidth;
            const padding = 16; // Minimum padding from edges
            
            // Adjust position if tooltip would go off the left edge
            if (leftPosition - (tooltipWidth / 2) < padding) {
                leftPosition = padding + (tooltipWidth / 2);
            }
            // Adjust position if tooltip would go off the right edge
            else if (leftPosition + (tooltipWidth / 2) > viewportWidth - padding) {
                leftPosition = viewportWidth - padding - (tooltipWidth / 2);
            }
        }
        
        tooltip.style.left = leftPosition + 'px';
        tooltip.style.top = buttonRect.bottom + 8 + 'px';
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '10000';
        tooltip.style.background = 'transparent';
        tooltip.style.border = 'none';
        tooltip.style.padding = '0';
    }
    
    repositionTooltip() {
        if (!this.activeTooltip || !this.activeButton) {
            return;
        }
        
        // Check if the button is still visible and in the DOM
        if (!document.body.contains(this.activeButton)) {
            this.removeExistingTooltips();
            return;
        }
        
        // Check if button is visible (not hidden or display: none)
        const buttonStyle = window.getComputedStyle(this.activeButton);
        if (buttonStyle.display === 'none' || buttonStyle.visibility === 'hidden') {
            this.removeExistingTooltips();
            return;
        }
        
        this.positionTooltip(this.activeTooltip, this.activeButton);
    }
}

/**
 * Career Timeline Navigation Controller
 * Handles scrolling through timeline project cards
 */
class CareerTimelineNavigation {
    constructor() {
        this.currentPosition = 0;
        this.cardWidth = 312; // 288px card + 24px margin
        this.cardsPerView = 3;
        this.totalCards = 12;
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupNavigation());
        } else {
            this.setupNavigation();
        }
    }
    
    setupNavigation() {
        this.timelineRow = document.querySelector('.timeline-projects-row');
        this.prevButton = document.querySelector('.career-nav-previous');
        this.nextButton = document.querySelector('.career-nav-next');
        
        if (this.timelineRow && this.prevButton && this.nextButton) {
            this.bindEvents();
            this.updateButtonStates();
        }
    }
    
    bindEvents() {
        this.prevButton.addEventListener('click', () => this.scrollPrevious());
        this.nextButton.addEventListener('click', () => this.scrollNext());
    }
    
    scrollNext() {
        const maxPosition = this.totalCards - this.cardsPerView;
        if (this.currentPosition < maxPosition) {
            this.currentPosition += this.cardsPerView;
            if (this.currentPosition > maxPosition) {
                this.currentPosition = maxPosition;
            }
            this.updateTransform();
            this.updateButtonStates();
        }
    }
    
    scrollPrevious() {
        if (this.currentPosition > 0) {
            this.currentPosition -= this.cardsPerView;
            if (this.currentPosition < 0) {
                this.currentPosition = 0;
            }
            this.updateTransform();
            this.updateButtonStates();
        }
    }
    
    updateTransform() {
        const translateX = -(this.currentPosition * this.cardWidth);
        this.timelineRow.style.transform = `translateX(${translateX}px)`;
    }
    
    updateButtonStates() {
        // Disable/enable buttons based on position
        const maxPosition = this.totalCards - this.cardsPerView;
        
        this.prevButton.disabled = this.currentPosition === 0;
        this.nextButton.disabled = this.currentPosition >= maxPosition;
        
        // Add visual disabled state
        if (this.currentPosition === 0) {
            this.prevButton.style.opacity = '0.3';
        } else {
            this.prevButton.style.opacity = '1';
        }
        
        if (this.currentPosition >= maxPosition) {
            this.nextButton.style.opacity = '0.3';
        } else {
            this.nextButton.style.opacity = '1';
        }
    }
}

/**
 * Mobile Timeline Swiper
 * Handles touch swiping for career timeline on mobile devices
 */
class MobileTimelineSwiper {
    constructor() {
        this.currentIndex = 0;
        this.totalCards = 12;
        this.startX = 0;
        this.startY = 0;
        this.currentX = 0;
        this.currentY = 0;
        this.isDragging = false;
        this.hasStartedDrag = false;
        this.threshold = 50; // Minimum distance to trigger swipe
        this.maxDrag = 100; // Maximum drag distance for visual feedback
        
        this.init();
    }
    
    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setupSwiper());
        } else {
            this.setupSwiper();
        }
    }
    
    setupSwiper() {
        // Only initialize on mobile devices
        if (window.innerWidth > 768) {
            return;
        }
        
        this.timelineRow = document.querySelector('.timeline-projects-row');
        
        if (!this.timelineRow) {
            return;
        }
        
        this.bindEvents();
    }
    
    bindEvents() {
        // Touch events
        this.timelineRow.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
        this.timelineRow.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
        this.timelineRow.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
        
        // Mouse events for desktop testing
        this.timelineRow.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        this.timelineRow.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.timelineRow.addEventListener('mouseup', (e) => this.handleMouseUp(e));
        this.timelineRow.addEventListener('mouseleave', (e) => this.handleMouseUp(e));
        
        // Prevent context menu on long press
        this.timelineRow.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());
    }
    

    
    handleTouchStart(e) {
        this.startX = e.touches[0].clientX;
        this.startY = e.touches[0].clientY;
        this.currentX = this.startX;
        this.isDragging = true;
        this.hasStartedDrag = false;
        
        // Add grabbing cursor
        this.timelineRow.style.cursor = 'grabbing';
        
        // Don't prevent default on touchstart - let the browser decide initially
    }
    
    handleTouchMove(e) {
        if (!this.isDragging) return;
        
        this.currentX = e.touches[0].clientX;
        this.currentY = e.touches[0].clientY;
        const diffX = this.currentX - this.startX;
        const diffY = this.currentY - this.startY;
        
        // Determine if this is a horizontal or vertical swipe
        const absX = Math.abs(diffX);
        const absY = Math.abs(diffY);
        
        if (!this.hasStartedDrag && (absX > 10 || absY > 10)) {
            // Only start horizontal drag if horizontal movement is greater than vertical
            if (absX > absY && absX > 10) {
                this.hasStartedDrag = true;
            } else if (absY > absX) {
                // This is a vertical scroll, stop tracking this gesture
                this.isDragging = false;
                this.timelineRow.style.cursor = 'grab';
                return;
            }
        }
        
        if (this.hasStartedDrag) {
            // Limit drag distance for visual feedback
            const limitedDiffX = Math.max(-this.maxDrag, Math.min(this.maxDrag, diffX));
            this.updateTransformWithDrag(limitedDiffX);
            
            // Only prevent page scrolling for horizontal swipes
            e.preventDefault();
        }
    }
    
    handleTouchEnd(e) {
        if (!this.isDragging) return;
        
        const diffX = this.currentX - this.startX;
        
        // Reset cursor
        this.timelineRow.style.cursor = 'grab';
        
        // Determine if swipe threshold was met
        if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0 && this.currentIndex > 0) {
                // Swipe right - go to previous slide
                this.goToSlide(this.currentIndex - 1);
            } else if (diffX < 0 && this.currentIndex < this.totalCards - 1) {
                // Swipe left - go to next slide
                this.goToSlide(this.currentIndex + 1);
            } else {
                // Snap back to current position
                this.goToSlide(this.currentIndex);
            }
        } else {
            // Snap back to current position
            this.goToSlide(this.currentIndex);
        }
        
        this.isDragging = false;
        this.hasStartedDrag = false;
    }
    
    // Mouse events for desktop testing
    handleMouseDown(e) {
        if (window.innerWidth > 768) return; // Only on mobile
        this.startX = e.clientX;
        this.currentX = this.startX;
        this.isDragging = true;
        this.hasStartedDrag = false;
        this.timelineRow.style.cursor = 'grabbing';
        e.preventDefault();
    }
    
    handleMouseMove(e) {
        if (!this.isDragging || window.innerWidth > 768) return;
        
        this.currentX = e.clientX;
        const diffX = this.currentX - this.startX;
        
        if (!this.hasStartedDrag && Math.abs(diffX) > 10) {
            this.hasStartedDrag = true;
        }
        
        if (this.hasStartedDrag) {
            const limitedDiffX = Math.max(-this.maxDrag, Math.min(this.maxDrag, diffX));
            this.updateTransformWithDrag(limitedDiffX);
        }
    }
    
    handleMouseUp(e) {
        if (!this.isDragging || window.innerWidth > 768) return;
        
        const diffX = this.currentX - this.startX;
        this.timelineRow.style.cursor = 'grab';
        
        if (Math.abs(diffX) > this.threshold) {
            if (diffX > 0 && this.currentIndex > 0) {
                this.goToSlide(this.currentIndex - 1);
            } else if (diffX < 0 && this.currentIndex < this.totalCards - 1) {
                this.goToSlide(this.currentIndex + 1);
            } else {
                this.goToSlide(this.currentIndex);
            }
        } else {
            this.goToSlide(this.currentIndex);
        }
        
        this.isDragging = false;
        this.hasStartedDrag = false;
    }
    
    updateTransformWithDrag(dragOffset) {
        const slideDistance = this.getCardWidth();
        const baseTranslateX = 60 - (this.currentIndex * slideDistance); // Account for initial 60px offset
        const translateX = baseTranslateX + dragOffset;
        
        this.timelineRow.style.transition = 'none';
        this.timelineRow.style.transform = `translateX(${translateX}px)`;
    }
    
    goToSlide(index) {
        // Constrain index to valid range
        this.currentIndex = Math.max(0, Math.min(index, this.totalCards - 1));
        
        const slideDistance = this.getCardWidth();
        const translateX = 60 - (this.currentIndex * slideDistance); // Account for initial 60px offset
        
        // Re-enable smooth transition
        this.timelineRow.style.transition = 'transform 0.12s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.timelineRow.style.transform = `translateX(${translateX}px)`;
        
        // Debug log to verify positioning
        const firstCard = document.querySelector('.timeline-project');
        const cardRect = firstCard ? firstCard.getBoundingClientRect() : null;
        const cardStyle = firstCard ? window.getComputedStyle(firstCard) : null;
        console.log(`Slide ${this.currentIndex}: translateX = ${translateX}px, slideDistance = ${slideDistance}px, actualCardWidth = ${cardRect?.width}px, marginRight = ${cardStyle?.marginRight}`);
    }
    
    getCardWidth() {
        // Get the actual rendered width of the first card including its margin
        // This ensures perfect alignment by using the browser's actual calculations
        const firstCard = document.querySelector('.timeline-project');
        if (firstCard) {
            const cardRect = firstCard.getBoundingClientRect();
            const cardStyle = window.getComputedStyle(firstCard);
            const marginRight = parseFloat(cardStyle.marginRight) || 0;
            return cardRect.width + marginRight;
        }
        
        // Fallback calculation if card not found (card width + margin)
        // Card width = 100vw - 60px, margin = 20px, total = 100vw - 40px
        return window.innerWidth - 40;
    }
    

    
    handleResize() {
        // Recalculate position on resize
        if (window.innerWidth <= 768) {
            this.goToSlide(this.currentIndex);
        }
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
new CareerTimelineNavigation();
new MobileTimelineSwiper();
new ResizeAnimationStopper(); 