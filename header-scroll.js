// Header scroll animation
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('.fixed-header');
    const leftNav = document.querySelector('.left-navigation');
    let scrollThreshold = 50; // Trigger animation after 50px of scroll
    
    function handleScroll() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > scrollThreshold) {
            header.classList.add('scrolled');
            // Only animate left nav on desktop (check if it's visible)
            if (window.innerWidth > 768) {
                leftNav.classList.add('scrolled');
            }
        } else {
            header.classList.remove('scrolled');
            leftNav.classList.remove('scrolled');
        }
    }
    
    // Throttle scroll events for better performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    });
    

    
    // Initial check in case page loads scrolled
    handleScroll();
}); 