document.addEventListener('DOMContentLoaded', function() {
    const headerButtonsContainer = document.querySelector('.header-buttons-container');
    const buttons = headerButtonsContainer?.querySelectorAll('.action-button');
    
    if (!headerButtonsContainer || !buttons.length) return;
    
    let currentHoveredButton = null;
    let hasBeenHovered = false; // Track if any button has been hovered before
    
    function updateSliderPosition(button, isFirstHover = false) {
        const containerRect = headerButtonsContainer.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        
        const left = buttonRect.left - containerRect.left;
        const width = buttonRect.width;
        
        // Update the sliding background position and size
        headerButtonsContainer.style.setProperty('--slider-left', `${left}px`);
        headerButtonsContainer.style.setProperty('--slider-width', `${width}px`);
        
        // Remove any existing classes
        headerButtonsContainer.classList.remove('slider-active', 'slider-fade-in');
        
        if (isFirstHover) {
            // Simple fade-in for first hover
            headerButtonsContainer.classList.add('slider-fade-in');
        } else {
            // Sliding effect for subsequent hovers
            headerButtonsContainer.classList.add('slider-active');
        }
    }
    
    function hideSlider() {
        headerButtonsContainer.classList.remove('slider-active', 'slider-fade-in');
        currentHoveredButton = null;
        hasBeenHovered = false; // Reset when completely leaving the container
    }
    
    // Add event listeners to each button
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            const isFirstHover = !hasBeenHovered;
            currentHoveredButton = this;
            hasBeenHovered = true;
            updateSliderPosition(this, isFirstHover);
        });
        
        button.addEventListener('mouseleave', function() {
            // Small delay to allow moving between buttons
            setTimeout(() => {
                if (currentHoveredButton === this) {
                    hideSlider();
                }
            }, 50);
        });
    });
    
    // Handle container mouse leave
    headerButtonsContainer.addEventListener('mouseleave', function() {
        hideSlider();
    });
    
    // Handle smooth transitions between buttons
    headerButtonsContainer.addEventListener('mouseenter', function(event) {
        // If we're entering the container, check if we're over a button
        const hoveredButton = document.elementFromPoint(event.clientX, event.clientY);
        if (hoveredButton && hoveredButton.classList.contains('action-button')) {
            const isFirstHover = !hasBeenHovered;
            currentHoveredButton = hoveredButton;
            hasBeenHovered = true;
            updateSliderPosition(hoveredButton, isFirstHover);
        }
    });
}); 