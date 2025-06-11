// Feedback Widget Functionality
class FeedbackWidget {
    constructor() {
        this.init();
    }

    init() {
        this.createFeedbackHTML();
        this.bindEvents();
        this.handleScroll();
    }

    createFeedbackHTML() {
        const feedbackHTML = `
            <div id="feedback-widget" class="feedback-widget hidden">
                <!-- Feedback Button State -->
                <button class="feedback-button" id="feedback-btn" aria-label="Leave feedback">
                    <img src="img/leave-feedback-icon.svg" alt="" class="feedback-icon">
                    <span class="feedback-text">Leave feedback</span>
                </button>

                <!-- Feedback Form State -->
                <div class="feedback-form-container" id="feedback-form">
                    <form class="feedback-form" name="feedback" method="POST" data-netlify="true" netlify-honeypot="bot-field">
                        <input type="hidden" name="form-name" value="feedback" />
                        <p style="display: none;">
                            <label>Don't fill this out if you're human: <input name="bot-field" /></label>
                        </p>
                        
                        <div class="feedback-form-header">
                            <div class="feedback-form-title-container">
                                <img src="img/leave-feedback-icon.svg" alt="" class="feedback-form-icon">
                                <h3 class="feedback-form-title">Leave feedback</h3>
                            </div>
                            <button type="button" class="feedback-close-btn" id="feedback-close" aria-label="Close feedback form">
                                <img src="img/close.svg" alt="" class="feedback-close-icon">
                            </button>
                        </div>

                        <div class="feedback-form-description">
                            <p class="feedback-description-text">Feedback on my portfolio would be hugely appreciated regardless of your line of work</p>
                        </div>

                        <div class="feedback-form-fields">
                            <div class="feedback-field">
                                <div class="feedback-label-row">
                                    <label for="feedback-name" class="feedback-label">Name</label>
                                    <span class="feedback-optional">Optional</span>
                                </div>
                                <input type="text" id="feedback-name" name="name" class="feedback-input">
                            </div>
                            
                            <div class="feedback-field">
                                <label for="feedback-message" class="feedback-label">Message</label>
                                <textarea id="feedback-message" name="message" class="feedback-textarea"></textarea>
                                <p class="feedback-error-message" id="feedback-message-error">Please enter a message</p>
                            </div>
                        </div>

                        <button type="submit" class="feedback-submit-btn">
                            <span class="feedback-submit-text">Submit feedback</span>
                        </button>
                    </form>
                </div>

                <!-- Success State -->
                <div class="feedback-success-container" id="feedback-success">
                    <div class="feedback-success-header">
                        <div class="feedback-success-title-container">
                            <div class="feedback-success-icon">
                                <div class="animated-checkmark">
                                    <svg width="18" height="18" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <defs>
                                            <linearGradient id="circleGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" style="stop-color:white;stop-opacity:1" />
                                                <stop offset="100%" style="stop-color:white;stop-opacity:0.5" />
                                            </linearGradient>
                                        </defs>
                                        <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" stroke="url(#circleGradient)" stroke-width="2"/>
                                        <path class="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </div>
                            </div>
                            <h3 class="feedback-success-title">Thank you</h3>
                        </div>
                        <button type="button" class="feedback-close-btn" id="feedback-success-close" aria-label="Close feedback">
                            <img src="img/close.svg" alt="" class="feedback-close-icon">
                        </button>
                    </div>
                    <div class="feedback-success-content">
                        <p class="feedback-success-message">Your feedback will help me further improve my portfolio</p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', feedbackHTML);
    }

    bindEvents() {
        const feedbackBtn = document.getElementById('feedback-btn');
        const feedbackClose = document.getElementById('feedback-close');
        const feedbackSuccessClose = document.getElementById('feedback-success-close');
        const feedbackForm = document.querySelector('.feedback-form');
        const messageField = document.getElementById('feedback-message');

        // Open feedback form
        feedbackBtn.addEventListener('click', () => this.openFeedbackForm());

        // Close feedback form
        feedbackClose.addEventListener('click', () => this.closeFeedbackForm());
        feedbackSuccessClose.addEventListener('click', () => this.closeFeedbackForm());

        // Handle form submission
        feedbackForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Clear error state when user starts typing in message field
        messageField.addEventListener('input', () => {
            if (messageField.classList.contains('error')) {
                this.hideValidationError(messageField);
            }
        });

        // Handle scroll for visibility
        window.addEventListener('scroll', () => this.handleScroll());

        // Close form when clicking outside of it
        document.addEventListener('click', (e) => this.handleClickOutside(e));
    }

    handleScroll() {
        const feedbackWidget = document.getElementById('feedback-widget');
        const scrollY = window.scrollY;
        
        // Different scroll thresholds for mobile vs desktop
        const isMobile = window.innerWidth <= 768;
        const scrollThreshold = isMobile ? 2000 : 200;
        
        // Only show the widget once the threshold is reached, but don't hide it again
        if (scrollY >= scrollThreshold && !feedbackWidget.classList.contains('visible')) {
            feedbackWidget.classList.remove('hidden');
            feedbackWidget.classList.add('visible');
        }
    }

    handleClickOutside(e) {
        const widget = document.getElementById('feedback-widget');
        const form = document.getElementById('feedback-form');
        const success = document.getElementById('feedback-success');
        
        // Only handle clicks if the form or success state is visible
        const isFormVisible = form.style.display === 'block';
        const isSuccessVisible = success.style.display === 'block';
        
        if (!isFormVisible && !isSuccessVisible) {
            return; // Nothing to close
        }
        
        // Check if click was outside the widget
        if (!widget.contains(e.target)) {
            this.closeFeedbackForm();
        }
    }

    openFeedbackForm() {
        const widget = document.getElementById('feedback-widget');
        const button = document.getElementById('feedback-btn');
        const form = document.getElementById('feedback-form');
        
        widget.classList.add('expanded');
        button.style.display = 'none';
        form.style.display = 'block';
        
        // Ensure form is in proper state for submission
        this.resetFormState();
        
        // Restore saved values from cookies
        this.restoreFormValues();
        
        // Focus on the name field
        setTimeout(() => {
            const nameField = document.getElementById('feedback-name');
            nameField.focus();
        }, 300);
    }

    closeFeedbackForm() {
        const widget = document.getElementById('feedback-widget');
        const button = document.getElementById('feedback-btn');
        const form = document.getElementById('feedback-form');
        const success = document.getElementById('feedback-success');
        
        // Save form values before closing (only if not submitted)
        if (form.style.display !== 'none') {
            this.saveFormValues();
        }
        
        widget.classList.remove('expanded');
        button.style.display = 'flex';
        form.style.display = 'none';
        success.style.display = 'none';
        
        // Only reset form if coming from success state
        if (success.style.display !== 'none') {
            const feedbackForm = document.querySelector('.feedback-form');
            feedbackForm.reset();
            // Clear the name cookie when fully resetting the form
            this.deleteCookie('feedback-name');
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const messageField = document.getElementById('feedback-message');
        const nameField = document.getElementById('feedback-name');
        
        // Custom validation for required message field
        if (!messageField.value.trim()) {
            this.showValidationError(messageField);
            return;
        } else {
            this.hideValidationError(messageField);
        }
        
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        
        // Construct form data manually to ensure all required fields are included
        const formData = new FormData();
        formData.append('form-name', 'feedback');
        formData.append('name', nameField.value || '');
        formData.append('message', messageField.value);
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                this.showSuccessState();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            // Reset submit button on error
            submitBtn.disabled = false;
            submitText.textContent = 'Submit feedback';
            alert('There was an error sending your feedback. Please try again.');
        }
    }

    showValidationError(field) {
        // Add error class to field for red outline
        field.classList.add('error');
        
        // Show error message
        const errorMessage = document.getElementById('feedback-message-error');
        if (errorMessage) {
            errorMessage.classList.add('show');
        }
        
        // Focus the field
        field.focus();
    }

    hideValidationError(field) {
        // Remove error class from field
        field.classList.remove('error');
        
        // Hide error message
        const errorMessage = document.getElementById('feedback-message-error');
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    }

    showSuccessState() {
        const form = document.getElementById('feedback-form');
        const success = document.getElementById('feedback-success');
        const messageField = document.getElementById('feedback-message');
        const nameField = document.getElementById('feedback-name');
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Save the current name for future use (always use the latest name entered)
        if (nameField.value.trim()) {
            this.setCookie('feedback-name', nameField.value, 7);
        }
        
        // Clear the message field and its saved value
        messageField.value = '';
        this.deleteCookie('feedback-message');
        
        // Reset submit button to original state for future submissions
        submitBtn.disabled = false;
        submitText.textContent = 'Submit feedback';
        
        form.style.display = 'none';
        success.style.display = 'block';
        
        // Success state will remain visible until user manually closes it
    }

    saveFormValues() {
        const nameField = document.getElementById('feedback-name');
        const messageField = document.getElementById('feedback-message');
        
        // Save values to cookies with 7 day expiry
        this.setCookie('feedback-name', nameField.value, 7);
        this.setCookie('feedback-message', messageField.value, 7);
    }

    resetFormState() {
        const form = document.querySelector('.feedback-form');
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        const messageField = document.getElementById('feedback-message');
        
        // Ensure submit button is in correct state
        submitBtn.disabled = false;
        submitText.textContent = 'Submit feedback';
        
        // Clear any error states
        this.hideValidationError(messageField);
    }

    restoreFormValues() {
        const nameField = document.getElementById('feedback-name');
        const messageField = document.getElementById('feedback-message');
        
        // Restore values from cookies
        const savedName = this.getCookie('feedback-name');
        const savedMessage = this.getCookie('feedback-message');
        
        if (savedName) nameField.value = savedName;
        // Only restore message if it exists (won't exist after successful submission)
        if (savedMessage) messageField.value = savedMessage;
    }

    clearSavedValues() {
        this.deleteCookie('feedback-name');
        this.deleteCookie('feedback-message');
    }

    setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict`;
    }

    getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    deleteCookie(name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
    }
}

// Initialize feedback widget when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FeedbackWidget();
}); 