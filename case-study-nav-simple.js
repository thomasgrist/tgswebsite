// Case Study Navigation - Simple Version
(function() {
    
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
            title: '~66% increase in ops speed',
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
        return filename;
    }
    
    function getCurrentCaseStudyIndex() {
        const currentPage = getCurrentPageFilename();
        const index = caseStudies.findIndex(study => study.filename === currentPage);
        return index;
    }
    
    function updateNavigationCard(card, caseStudy, direction) {
        if (!card || !caseStudy) {
            console.warn('Case study navigation: Missing card or case study data');
            return;
        }
        
        const tagElement = card.querySelector('.tag-text');
        const companyElement = card.querySelector('.project-tile-company');
        const titleElement = card.querySelector('.case-study-nav-title');
        
        // Update content
        if (tagElement) tagElement.textContent = caseStudy.tag;
        if (companyElement) companyElement.textContent = caseStudy.company;
        if (titleElement) titleElement.textContent = caseStudy.title;
        
        // Remove any existing click handlers by cloning the card
        const newCard = card.cloneNode(true);
        card.parentNode.replaceChild(newCard, card);
        
        // Make card clickable with proper event handling
        newCard.style.cursor = 'pointer';
        newCard.style.transition = 'transform 0.2s ease';
        
        // Add click handler
        newCard.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            window.location.href = caseStudy.filename;
        });
        
        // Add hover effects
        newCard.addEventListener('mouseenter', function() {
            newCard.style.transform = 'translateY(-2px)';
        });
        
        newCard.addEventListener('mouseleave', function() {
            newCard.style.transform = 'translateY(0)';
        });
        
        // Update the DOM elements in the new card
        const newTagElement = newCard.querySelector('.tag-text');
        const newCompanyElement = newCard.querySelector('.project-tile-company');
        const newTitleElement = newCard.querySelector('.case-study-nav-title');
        
        if (newTagElement) newTagElement.textContent = caseStudy.tag;
        if (newCompanyElement) newCompanyElement.textContent = caseStudy.company;
        if (newTitleElement) newTitleElement.textContent = caseStudy.title;
        
        return newCard;
    }
    
    function setupNavigation() {
        const currentIndex = getCurrentCaseStudyIndex();
        
        // Exit if not on a case study page
        if (currentIndex === -1) {
            return;
        }
        
        const navigationContainer = document.querySelector('.case-study-navigation-container');
        
        if (!navigationContainer) {
            console.warn('Case study navigation: Navigation container not found');
            return;
        }
        
        const previousCard = navigationContainer.querySelector('.case-study-nav-card.previous');
        const nextCard = navigationContainer.querySelector('.case-study-nav-card.next');
        
        // Handle previous case study (circular navigation)
        if (previousCard) {
            const previousIndex = currentIndex > 0 ? currentIndex - 1 : caseStudies.length - 1;
            const previousStudy = caseStudies[previousIndex];
            updateNavigationCard(previousCard, previousStudy, 'previous');
            previousCard.style.display = 'flex';
        }
        
        // Handle next case study (circular navigation)
        if (nextCard) {
            const nextIndex = currentIndex < caseStudies.length - 1 ? currentIndex + 1 : 0;
            const nextStudy = caseStudies[nextIndex];
            updateNavigationCard(nextCard, nextStudy, 'next');
            nextCard.style.display = 'flex';
        }
        
        // Set layout for both cards visible (circular navigation always shows both)
        if (navigationContainer) {
            navigationContainer.style.justifyContent = 'space-between';
        }
    }
    
    // Initialize when DOM is ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupNavigation);
        } else {
            setupNavigation();
        }
    }
    
    // Start initialization
    init();
    
})(); 