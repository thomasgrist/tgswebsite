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
                    <div class="feedback-success-content">
                        <div class="feedback-success-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="12" cy="12" r="10" fill="#10B981"/>
                                <path d="M9 12L11 14L15 10" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </div>
                        <h3 class="feedback-success-title">Thank you!</h3>
                        <p class="feedback-success-message">Your feedback has been received.</p>
                        <button type="button" class="feedback-close-btn" id="feedback-success-close" aria-label="Close feedback">
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L13 13M1 13L13 1" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
                            </svg>
                        </button>
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
    }

    handleScroll() {
        const feedbackWidget = document.getElementById('feedback-widget');
        const scrollY = window.scrollY;
        
        // Only show the widget once the threshold is reached, but don't hide it again
        if (scrollY >= 200 && !feedbackWidget.classList.contains('visible')) {
            feedbackWidget.classList.remove('hidden');
            feedbackWidget.classList.add('visible');
        }
    }

    openFeedbackForm() {
        const widget = document.getElementById('feedback-widget');
        const button = document.getElementById('feedback-btn');
        const form = document.getElementById('feedback-form');
        
        widget.classList.add('expanded');
        button.style.display = 'none';
        form.style.display = 'block';
        
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
            this.clearSavedValues();
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const messageField = document.getElementById('feedback-message');
        
        // Custom validation for required message field
        if (!messageField.value.trim()) {
            this.showValidationError(messageField);
            return;
        } else {
            this.hideValidationError(messageField);
        }
        
        const formData = new FormData(form);
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Show loading state
        submitBtn.disabled = true;
        submitText.textContent = 'Sending...';
        
        try {
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                this.showSuccessState();
                // Clear saved values since form was submitted successfully
                this.clearSavedValues();
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
        
        // Clear saved values since form was submitted successfully
        this.clearSavedValues();
        
        form.style.display = 'none';
        success.style.display = 'block';
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.closeFeedbackForm();
        }, 3000);
    }

    saveFormValues() {
        const nameField = document.getElementById('feedback-name');
        const messageField = document.getElementById('feedback-message');
        
        // Save values to cookies with 7 day expiry
        this.setCookie('feedback-name', nameField.value, 7);
        this.setCookie('feedback-message', messageField.value, 7);
    }

    restoreFormValues() {
        const nameField = document.getElementById('feedback-name');
        const messageField = document.getElementById('feedback-message');
        
        // Restore values from cookies
        const savedName = this.getCookie('feedback-name');
        const savedMessage = this.getCookie('feedback-message');
        
        if (savedName) nameField.value = savedName;
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