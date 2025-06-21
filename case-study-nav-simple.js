// Case Study Navigation - Simple Version with Enhanced Mobile Support
(function() {
    'use strict';
    
    console.log('Case Study Navigation: Script starting to load');
    
    // Define case studies in order (excluding Speechmatics AI as it's not live)
    const caseStudies = [
        {
            filename: 'whereby.html',
            title: 'Customer pain point analysis & remedies',
            company: 'Whereby',
            tag: 'SaaS'
        },
        {
            filename: 'sky-comcast.html',
            title: '~62% increase in ops speed',
            company: 'Sky & Comcast',
            tag: 'SaaS'
        },
        {
            filename: 'rio-esg.html',
            title: 'Preparing the product for self-service',
            company: 'Rio ESG',
            tag: 'SaaS'
        },
        {
            filename: 'deltatre.html',
            title: 'Fan engagement features, from strategy to sales',
            company: 'Deltatre',
            tag: 'SaaS'
        },
        {
            filename: 'audi.html',
            title: '59% increase in lead generation programme',
            company: 'Audi @ BBH',
            tag: 'eCommerce'
        }
    ];
    
    function getCurrentPageFilename() {
        const path = window.location.pathname;
        const filename = path.split('/').pop() || 'index.html';
        console.log('Case Study Navigation: Current page filename:', filename);
        return filename;
    }
    
    function getCurrentCaseStudyIndex() {
        const currentPage = getCurrentPageFilename();
        const index = caseStudies.findIndex(study => study.filename === currentPage);
        console.log('Case Study Navigation: Current case study index:', index);
        return index;
    }
    
    function navigateToPage(url) {
        console.log('Case Study Navigation: Attempting to navigate to:', url);
        try {
            // Try immediate navigation first
            window.location.href = url;
        } catch (error) {
            console.error('Case Study Navigation: Error navigating:', error);
            // Fallback with timeout
            setTimeout(() => {
                window.location.href = url;
            }, 100);
        }
    }
    
    // Simple, direct approach for adding navigation to a card
    function addDirectNavigation(card, url) {
        if (!card || !url) return;
        
        console.log('Case Study Navigation: Adding direct navigation to card for:', url);
        
        // Add all necessary styles
        card.style.cursor = 'pointer';
        card.style.touchAction = 'manipulation';
        card.style.webkitTouchCallout = 'none';
        card.style.webkitUserSelect = 'none';
        card.style.userSelect = 'none';
        
        // Direct navigation function
        const navigate = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Case Study Navigation: Direct navigation triggered for:', url);
            navigateToPage(url);
        };
        
        // Add event listeners with error handling
        try {
            // Click event (works on most devices)
            card.addEventListener('click', navigate);
            
            // Touch events for mobile
            let touchStarted = false;
            
            card.addEventListener('touchstart', function(e) {
                touchStarted = true;
                console.log('Case Study Navigation: Touch started on card');
            }, { passive: true });
            
            card.addEventListener('touchend', function(e) {
                if (touchStarted) {
                    console.log('Case Study Navigation: Touch ended, navigating');
                    e.preventDefault();
                    navigate(e);
                }
                touchStarted = false;
            }, { passive: false });
            
            // Mouse events for desktop
            card.addEventListener('mousedown', function(e) {
                if (!('ontouchstart' in window)) {
                    console.log('Case Study Navigation: Mouse down, navigating');
                    navigate(e);
                }
            });
            
        } catch (error) {
            console.error('Case Study Navigation: Error adding event listeners:', error);
        }
    }
    
    function updateNavigationCard(card, caseStudy, direction) {
        if (!card || !caseStudy) {
            console.warn('Case study navigation: Missing card or case study data', { card, caseStudy });
            return;
        }
        
        console.log('Case Study Navigation: Updating card for', direction, caseStudy);
        
        try {
            const tagElement = card.querySelector('.tag-text');
            const companyElement = card.querySelector('.project-tile-company');
            const titleElement = card.querySelector('.case-study-nav-title');
            
            console.log('Case Study Navigation: Found elements:', { tagElement, companyElement, titleElement });
            
            // Update content
            if (tagElement) tagElement.textContent = caseStudy.tag;
            if (companyElement) companyElement.textContent = caseStudy.company;
            if (titleElement) titleElement.textContent = caseStudy.title;
            
            // Add direct navigation
            addDirectNavigation(card, caseStudy.filename);
            
            console.log('Case Study Navigation: Card updated successfully for', direction);
            return card;
            
        } catch (error) {
            console.error('Case Study Navigation: Error updating card:', error);
        }
    }
    
    function setupNavigation() {
        console.log('Case Study Navigation: Setting up navigation');
        
        try {
            const currentIndex = getCurrentCaseStudyIndex();
            
            // Exit if not on a case study page
            if (currentIndex === -1) {
                console.log('Case Study Navigation: Not on a case study page, exiting');
                return;
            }
            
            const navigationContainer = document.querySelector('.case-study-navigation-container');
            
            if (!navigationContainer) {
                console.warn('Case study navigation: Navigation container not found');
                return;
            }
            
            console.log('Case Study Navigation: Navigation container found', navigationContainer);
            
            const previousCard = navigationContainer.querySelector('.case-study-nav-card.previous');
            const nextCard = navigationContainer.querySelector('.case-study-nav-card.next');
            
            console.log('Case Study Navigation: Found cards:', { previousCard, nextCard });
            
            // Handle previous case study (circular navigation)
            if (previousCard) {
                const previousIndex = currentIndex > 0 ? currentIndex - 1 : caseStudies.length - 1;
                const previousStudy = caseStudies[previousIndex];
                console.log('Case Study Navigation: Setting up previous card for:', previousStudy);
                updateNavigationCard(previousCard, previousStudy, 'previous');
                previousCard.style.display = 'flex';
            }
            
            // Handle next case study (circular navigation)
            if (nextCard) {
                const nextIndex = currentIndex < caseStudies.length - 1 ? currentIndex + 1 : 0;
                const nextStudy = caseStudies[nextIndex];
                console.log('Case Study Navigation: Setting up next card for:', nextStudy);
                updateNavigationCard(nextCard, nextStudy, 'next');
                nextCard.style.display = 'flex';
            }
            
            // Set layout for both cards visible (circular navigation always shows both)
            if (navigationContainer) {
                navigationContainer.style.justifyContent = 'space-between';
            }
            
            console.log('Case Study Navigation: Setup complete');
            
        } catch (error) {
            console.error('Case Study Navigation: Error in setupNavigation:', error);
        }
    }
    
    // Multiple initialization strategies for maximum compatibility
    function initializeMultiple() {
        console.log('Case Study Navigation: Starting multiple initialization strategies');
        
        // Strategy 1: Immediate if DOM is ready
        if (document.readyState !== 'loading') {
            console.log('Case Study Navigation: DOM ready, initializing immediately');
            setupNavigation();
        }
        
        // Strategy 2: DOMContentLoaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Case Study Navigation: DOMContentLoaded fired');
            setupNavigation();
        });
        
        // Strategy 3: Window load (fallback)
        window.addEventListener('load', function() {
            console.log('Case Study Navigation: Window load fired');
            setupNavigation();
        });
        
        // Strategy 4: Delayed fallback
        setTimeout(function() {
            console.log('Case Study Navigation: Delayed fallback attempt');
            if (document.querySelector('.case-study-navigation-container')) {
                setupNavigation();
            }
        }, 1000);
        
        // Strategy 5: Very delayed fallback
        setTimeout(function() {
            console.log('Case Study Navigation: Very delayed fallback attempt');
            if (document.querySelector('.case-study-navigation-container')) {
                setupNavigation();
            }
        }, 2000);
    }
    
    // Start all initialization strategies
    initializeMultiple();
    
})(); 