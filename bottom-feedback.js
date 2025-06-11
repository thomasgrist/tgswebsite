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
        const messageField = document.getElementById('bottom-feedback-message');
        const submitBtn = form.querySelector('.feedback-submit-btn');
        const submitText = submitBtn.querySelector('.feedback-submit-text');
        
        // Validate message field
        if (!messageField.value.trim()) {
            this.showValidationError(messageField);
            return;
        }

        // Show loading state
        const originalText = submitText.textContent;
        submitText.textContent = 'Submitting...';
        submitBtn.disabled = true;

        try {
            // Try a more direct approach with XMLHttpRequest
            const formData = new FormData(form);
            
            // Ensure form-name is included for Netlify
            formData.set('form-name', 'feedback');
            
            // Debug: Log what we're sending
            console.log('Form data entries:');
            for (const [key, value] of formData.entries()) {
                console.log(key + ':', value);
            }
            
            // Use XMLHttpRequest for better Netlify compatibility
            const xhr = new XMLHttpRequest();
            xhr.open('POST', '/');
            
            xhr.onload = () => {
                if (xhr.status === 200) {
                    this.showSuccessState();
                } else {
                    console.error('Form submission failed with status:', xhr.status);
                    alert('Sorry, there was an error submitting your feedback. Please try again.');
                    // Reset button
                    submitText.textContent = originalText;
                    submitBtn.disabled = false;
                }
            };
            
            xhr.onerror = () => {
                console.error('Network error during form submission');
                alert('Sorry, there was an error submitting your feedback. Please try again.');
                // Reset button
                submitText.textContent = originalText;
                submitBtn.disabled = false;
            };
            
            // Send as form data (multipart/form-data)
            xhr.send(formData);
            
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
        if (nameField) nameField.value = '';
        if (messageField) messageField.value = '';
        
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