// Case Study Navigation - Simple Version
(function() {
    
    // Define case studies in order
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
        return path.split('/').pop() || 'index.html';
    }
    
    function getCurrentCaseStudyIndex() {
        const currentPage = getCurrentPageFilename();
        return caseStudies.findIndex(study => study.filename === currentPage);
    }
    
    function updateNavigationCard(card, caseStudy) {
        if (!card || !caseStudy) return;
        
        const tagElement = card.querySelector('.tag-text');
        const companyElement = card.querySelector('.project-tile-company');
        const titleElement = card.querySelector('.case-study-nav-title');
        
        if (tagElement) tagElement.textContent = caseStudy.tag;
        if (companyElement) companyElement.textContent = caseStudy.company;
        if (titleElement) titleElement.textContent = caseStudy.title;
        
        // Make card clickable
        card.style.cursor = 'pointer';
        card.onclick = function() {
            window.location.href = caseStudy.filename;
        };
    }
    
    function setupNavigation() {
        const currentIndex = getCurrentCaseStudyIndex();
        
        if (currentIndex === -1) {
            return;
        }
        
        const navigationContainer = document.querySelector('.case-study-navigation-container');
        if (!navigationContainer) {
            return;
        }
        
        const previousCard = navigationContainer.querySelector('.case-study-nav-card.previous');
        const nextCard = navigationContainer.querySelector('.case-study-nav-card.next');
        
        // Handle previous case study (circular navigation)
        if (previousCard) {
            const previousIndex = currentIndex > 0 ? currentIndex - 1 : caseStudies.length - 1;
            const previousStudy = caseStudies[previousIndex];
            updateNavigationCard(previousCard, previousStudy);
        }
        
        // Handle next case study (circular navigation)
        if (nextCard) {
            const nextIndex = currentIndex < caseStudies.length - 1 ? currentIndex + 1 : 0;
            const nextStudy = caseStudies[nextIndex];
            updateNavigationCard(nextCard, nextStudy);
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupNavigation);
    } else {
        setupNavigation();
    }
    
})(); 