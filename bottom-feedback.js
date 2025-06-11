// Bottom Feedback Form Functionality
class BottomFeedbackForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const form = document.getElementById('bottom-feedback-form');
        const messageField = document.getElementById('bottom-feedback-message');
        const leaveMoreBtn = document.getElementById('bottom-feedback-leave-more');

        if (!form || !messageField) return;

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Clear error state when user starts typing in message field
        messageField.addEventListener('input', () => {
            if (messageField.classList.contains('error')) {
                this.hideValidationError(messageField);
            }
        });

        // Handle "Leave more feedback" button click
        if (leaveMoreBtn) {
            leaveMoreBtn.addEventListener('click', () => this.resetForm());
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const nameField = document.getElementById('bottom-feedback-name');
        const messageField = document.getElementById('bottom-feedback-message');
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Validate message field
        if (!messageField.value.trim()) {
            this.showValidationError(messageField);
            return;
        }

        // Store name in sessionStorage for this session only
        if (nameField && nameField.value.trim()) {
            sessionStorage.setItem('feedbackUserName', nameField.value.trim());
        }

        // Show loading state
        const originalText = submitText.textContent;
        submitText.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Submit to Netlify
            const formData = new FormData(form);
            
            // Ensure form-name is included for Netlify
            if (!formData.has('form-name')) {
                formData.append('form-name', 'feedback');
            }
            
            // Ensure bot-field is empty (honeypot should be empty for humans)
            if (!formData.has('bot-field')) {
                formData.append('bot-field', '');
            }
            
            const response = await fetch('/', {
                method: 'POST',
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString()
            });

            if (response.ok) {
                this.showSuccessState();
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            alert('Sorry, there was an error submitting your feedback. Please try again.');
            
            // Reset button
            submitText.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showValidationError(field) {
        const errorMessage = document.getElementById('bottom-feedback-message-error');
        
        field.classList.add('error');
        
        if (errorMessage) {
            errorMessage.classList.add('show');
        }
        
        // Focus the field
        field.focus();
    }

    hideValidationError(field) {
        const errorMessage = document.getElementById('bottom-feedback-message-error');
        
        field.classList.remove('error');
        
        if (errorMessage) {
            errorMessage.classList.remove('show');
        }
    }

    showSuccessState() {
        const form = document.getElementById('bottom-feedback-form');
        const successState = document.getElementById('bottom-feedback-success');
        
        if (form && successState) {
            // Hide form and show success state
            form.style.display = 'none';
            successState.style.display = 'flex';
            
            // Trigger animation for checkmark
            const checkmark = successState.querySelector('.animated-checkmark');
            if (checkmark) {
                // Remove any existing animation classes
                checkmark.classList.remove('animate');
                
                // Trigger reflow to restart animation
                checkmark.offsetHeight;
                
                // Add animation class
                checkmark.classList.add('animate');
            }
            
            // No auto-hide - user must click "Leave more feedback" button
        }
    }

    resetForm() {
        const form = document.getElementById('bottom-feedback-form');
        const successState = document.getElementById('bottom-feedback-success');
        const nameField = document.getElementById('bottom-feedback-name');
        const messageField = document.getElementById('bottom-feedback-message');
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Reset form fields
        if (messageField) messageField.value = '';
        
        // Restore name from sessionStorage if available
        if (nameField) {
            const savedName = sessionStorage.getItem('feedbackUserName');
            nameField.value = savedName || '';
        }
        
        // Reset button
        submitText.textContent = 'Submit feedback';
        submitBtn.disabled = false;
        
        // Clear any error states
        this.hideValidationError(messageField);
        
        // Show form and hide success state
        form.style.display = 'block';
        successState.style.display = 'none';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BottomFeedbackForm();
}); 