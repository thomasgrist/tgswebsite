// Bottom Feedback Form Functionality
class BottomFeedbackForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.restoreFormData();
    }

    bindEvents() {
        const form = document.getElementById('bottom-feedback-form');
        const nameField = document.getElementById('bottom-feedback-name');
        const messageField = document.getElementById('bottom-feedback-message');
        const leaveMoreBtn = document.getElementById('bottom-feedback-leave-more');

        if (!form || !messageField) return;

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Save form data as user types and clear error state
        if (nameField) {
            nameField.addEventListener('input', () => {
                this.saveFormData();
            });
        }

        messageField.addEventListener('input', () => {
            this.saveFormData();
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

        // Clear saved form data since we're submitting
        this.clearSavedFormData();

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
        
        // Reset form fields (clear everything for a fresh start)
        if (nameField) nameField.value = '';
        if (messageField) messageField.value = '';
        
        // Clear any saved data since we're starting fresh
        this.clearSavedFormData();
        
        // Reset button
        submitText.textContent = 'Submit feedback';
        submitBtn.disabled = false;
        
        // Clear any error states
        this.hideValidationError(messageField);
        
        // Show form and hide success state
        form.style.display = 'block';
        successState.style.display = 'none';
    }

    saveFormData() {
        const nameField = document.getElementById('bottom-feedback-name');
        const messageField = document.getElementById('bottom-feedback-message');
        
        const formData = {
            name: nameField ? nameField.value : '',
            message: messageField ? messageField.value : ''
        };
        
        // Only save if there's actually some data to save
        if (formData.name.trim() || formData.message.trim()) {
            sessionStorage.setItem('feedbackFormData', JSON.stringify(formData));
            console.log('Form data saved:', formData); // Debug log
        } else {
            // Remove saved data if both fields are empty
            sessionStorage.removeItem('feedbackFormData');
        }
    }

    restoreFormData() {
        const savedData = sessionStorage.getItem('feedbackFormData');
        
        if (savedData) {
            try {
                const formData = JSON.parse(savedData);
                const nameField = document.getElementById('bottom-feedback-name');
                const messageField = document.getElementById('bottom-feedback-message');
                
                console.log('Restoring form data:', formData); // Debug log
                
                if (nameField && formData.name) {
                    nameField.value = formData.name;
                }
                
                if (messageField && formData.message) {
                    messageField.value = formData.message;
                }
            } catch (error) {
                console.error('Error restoring form data:', error);
                // Clear corrupted data
                sessionStorage.removeItem('feedbackFormData');
            }
        } else {
            console.log('No saved form data found'); // Debug log
        }
    }

    clearSavedFormData() {
        sessionStorage.removeItem('feedbackFormData');
        sessionStorage.removeItem('feedbackUserName'); // Legacy cleanup
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BottomFeedbackForm();
}); 