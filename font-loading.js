/**
 * Font Loading Optimization Script
 * Prevents FOUT (Flash of Unstyled Text) by managing font loading states
 * Maintains accessibility and performance best practices
 */

(function() {
    'use strict';
    
    // Add font loading class to detect when we're loading fonts
    document.documentElement.classList.add('font-loading');
    
    // Font loading detection using FontFace API
    if ('fonts' in document) {
        // Check if fonts are already loaded (cached)
        if (document.fonts.check('300 1em Apercu') && document.fonts.check('400 1em Apercu')) {
            // Fonts are already loaded
            document.documentElement.classList.remove('font-loading');
            document.documentElement.classList.add('fonts-loaded');
        } else {
            // Load fonts asynchronously
            Promise.all([
                document.fonts.load('300 1em Apercu'),
                document.fonts.load('400 1em Apercu')
            ]).then(function() {
                document.documentElement.classList.remove('font-loading');
                document.documentElement.classList.add('fonts-loaded');
                
                // Optional: Store font loading state in sessionStorage for subsequent page loads
                try {
                    sessionStorage.setItem('fontsLoaded', 'true');
                } catch (e) {
                    // Ignore storage errors
                }
            }).catch(function(error) {
                // Fallback if font loading fails
                console.warn('Font loading failed:', error);
                document.documentElement.classList.remove('font-loading');
                document.documentElement.classList.add('fonts-loaded');
            });
        }
        
        // Timeout fallback to show content even if fonts don't load
        setTimeout(function() {
            if (!document.documentElement.classList.contains('fonts-loaded')) {
                document.documentElement.classList.remove('font-loading');
                document.documentElement.classList.add('fonts-loaded');
            }
        }, 3000); // Show content after 3 seconds max
        
    } else {
        // Fallback for browsers without FontFace API
        document.documentElement.classList.remove('font-loading');
        document.documentElement.classList.add('fonts-loaded');
    }
    
    // Check if fonts were previously loaded in this session
    try {
        if (sessionStorage.getItem('fontsLoaded') === 'true') {
            document.documentElement.classList.remove('font-loading');
            document.documentElement.classList.add('fonts-loaded');
        }
    } catch (e) {
        // Ignore storage errors
    }
})(); 