// Case Study Navigation Handler
// Handles previous and next navigation between case studies

class CaseStudyNavigation {
    constructor() {
        this.caseStudies = [
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
        
        this.currentPage = this.getCurrentPageFilename();
        this.currentIndex = this.getCurrentCaseStudyIndex();
        
        this.init();
    }
    
    getCurrentPageFilename() {
        const path = window.location.pathname;
        return path.split('/').pop() || 'index.html';
    }
    
    getCurrentCaseStudyIndex() {
        return this.caseStudies.findIndex(study => study.filename === this.currentPage);
    }
    
    getPreviousCaseStudy() {
        if (this.currentIndex <= 0) return null;
        return this.caseStudies[this.currentIndex - 1];
    }
    
    getNextCaseStudy() {
        if (this.currentIndex >= this.caseStudies.length - 1) return null;
        return this.caseStudies[this.currentIndex + 1];
    }
    
    updateNavigationCard(card, caseStudy, isPrevious = false) {
        if (!card || !caseStudy) return;
        
        const tagElement = card.querySelector('.tag-text');
        const companyElement = card.querySelector('.project-tile-company');
        const titleElement = card.querySelector('.case-study-nav-title');
        
        if (tagElement) tagElement.textContent = caseStudy.tag;
        if (companyElement) companyElement.textContent = caseStudy.company;
        if (titleElement) titleElement.textContent = caseStudy.title;
        
        // Make the card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
            window.location.href = caseStudy.filename;
        });
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-2px)';
            card.style.transition = 'transform 0.2s ease';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    }
    
    hideNavigationCard(card) {
        if (card) {
            card.style.display = 'none';
        }
    }
    
    init() {
        // Only run on case study pages
        if (this.currentIndex === -1) return;
        
        const navigationContainer = document.querySelector('.case-study-navigation-container');
        if (!navigationContainer) return;
        
        const previousCard = navigationContainer.querySelector('.case-study-nav-card.previous');
        const nextCard = navigationContainer.querySelector('.case-study-nav-card.next');
        
        const previousCaseStudy = this.getPreviousCaseStudy();
        const nextCaseStudy = this.getNextCaseStudy();
        
        if (previousCaseStudy) {
            this.updateNavigationCard(previousCard, previousCaseStudy, true);
        } else {
            this.hideNavigationCard(previousCard);
        }
        
        if (nextCaseStudy) {
            this.updateNavigationCard(nextCard, nextCaseStudy, false);
        } else {
            this.hideNavigationCard(nextCard);
        }
        
        // If either card is hidden, adjust the layout
        if (!previousCaseStudy || !nextCaseStudy) {
            navigationContainer.style.justifyContent = 'center';
            
            const visibleCard = previousCaseStudy ? previousCard : nextCard;
            if (visibleCard) {
                visibleCard.style.maxWidth = '400px';
            }
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CaseStudyNavigation();
}); 