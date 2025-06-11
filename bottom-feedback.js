// Bottom Feedback Form Functionality
class BottomFeedbackForm {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.restoreFormData();
        
        // Add console log for debugging
        console.log('BottomFeedbackForm initialized');
    }

    bindEvents() {
        const form = document.getElementById('bottom-feedback-form');
        const nameField = document.getElementById('bottom-feedback-name');
        const messageField = document.getElementById('bottom-feedback-message');
        const leaveMoreBtn = document.getElementById('bottom-feedback-leave-more');

        if (!form || !messageField) {
            console.warn('Feedback form elements not found');
            return;
        }

        // Handle form submission
        form.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Save form data as user types and clear error state
        if (nameField) {
            console.log('Adding input listeners to name field');
            nameField.addEventListener('input', () => {
                console.log('Name field input event triggered');
                this.saveFormData();
            });
            
            // Also save on blur to catch any missed changes
            nameField.addEventListener('blur', () => {
                console.log('Name field blur event triggered');
                this.saveFormData();
            });
        } else {
            console.warn('Name field not found!');
        }

        if (messageField) {
            console.log('Adding input listeners to message field');
            messageField.addEventListener('input', () => {
                console.log('Message field input event triggered');
                this.saveFormData();
                if (messageField.classList.contains('error')) {
                    this.hideValidationError(messageField);
                }
            });
            
            // Also save on blur to catch any missed changes
            messageField.addEventListener('blur', () => {
                console.log('Message field blur event triggered');
                this.saveFormData();
            });
        } else {
            console.warn('Message field not found!');
        }

        // Handle "Leave more feedback" button click
        if (leaveMoreBtn) {
            leaveMoreBtn.addEventListener('click', () => this.resetForm());
        }

        // Save data periodically to catch any missed input events
        setInterval(() => {
            this.saveFormData();
        }, 2000); // Save every 2 seconds if there's data

        // Note: We don't need to clear sessionStorage on beforeunload
        // because sessionStorage automatically clears when the browser/tab is closed
        // and we want it to persist during page refreshes within the same session
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

        // Preserve user's name for future feedback, but clear the message
        const userName = nameField ? nameField.value.trim() : '';
        if (userName) {
            const preservedData = {
                name: userName,
                message: ''
            };
            sessionStorage.setItem('feedbackFormData', JSON.stringify(preservedData));
        } else {
            this.clearSavedFormData();
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
        
        // Preserve the user's name but clear the message
        const preservedName = nameField ? nameField.value : '';
        if (messageField) messageField.value = '';
        
        // Save the preserved name back to sessionStorage so it persists
        if (preservedName.trim()) {
            const formData = {
                name: preservedName,
                message: ''
            };
            sessionStorage.setItem('feedbackFormData', JSON.stringify(formData));
        } else {
            this.clearSavedFormData();
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

    saveFormData() {
        try {
            const nameField = document.getElementById('bottom-feedback-name');
            const messageField = document.getElementById('bottom-feedback-message');
            
            if (!nameField || !messageField) {
                console.warn('Form fields not found for saving');
                return;
            }
            
            const formData = {
                name: nameField.value.trim(),
                message: messageField.value.trim(),
                timestamp: Date.now() // Add timestamp for debugging
            };
            
            // Only save if there's actually some data to save
            if (formData.name || formData.message) {
                const dataToSave = JSON.stringify(formData);
                sessionStorage.setItem('feedbackFormData', dataToSave);
                console.log('Form data saved:', { name: formData.name ? '[name provided]' : '[no name]', message: formData.message ? '[message provided]' : '[no message]' });
                console.log('Raw data saved to sessionStorage:', dataToSave);
            } else {
                // If no data, remove any existing saved data
                sessionStorage.removeItem('feedbackFormData');
            }
        } catch (error) {
            console.error('Error saving form data:', error);
        }
    }

    restoreFormData() {
        try {
            // Debug sessionStorage contents
            console.log('All sessionStorage keys:', Object.keys(sessionStorage));
            console.log('sessionStorage length:', sessionStorage.length);
            for (let i = 0; i < sessionStorage.length; i++) {
                const key = sessionStorage.key(i);
                console.log(`sessionStorage[${key}]:`, sessionStorage.getItem(key));
            }
            
            const savedData = sessionStorage.getItem('feedbackFormData');
            console.log('Raw sessionStorage data:', savedData);
            
            if (savedData) {
                const formData = JSON.parse(savedData);
                const nameField = document.getElementById('bottom-feedback-name');
                const messageField = document.getElementById('bottom-feedback-message');
                
                if (!nameField || !messageField) {
                    console.warn('Form fields not found for restoration');
                    return;
                }
                
                let restored = false;
                
                if (formData.name) {
                    nameField.value = formData.name;
                    restored = true;
                }
                
                if (formData.message) {
                    messageField.value = formData.message;
                    restored = true;
                }
                
                if (restored) {
                    console.log('Form data restored:', { 
                        name: formData.name ? '[name restored]' : '[no name]', 
                        message: formData.message ? '[message restored]' : '[no message]',
                        savedAt: formData.timestamp ? new Date(formData.timestamp).toLocaleTimeString() : 'unknown'
                    });
                }
            } else {
                console.log('No saved form data found');
            }
        } catch (error) {
            console.error('Error restoring form data:', error);
            // Clear corrupted data
            sessionStorage.removeItem('feedbackFormData');
        }
    }

    clearSavedFormData() {
        sessionStorage.removeItem('feedbackFormData');
        sessionStorage.removeItem('feedbackUserName'); // Legacy cleanup
    }


}

// Ensure we only initialize once
let feedbackFormInitialized = false;

function initializeFeedbackForm() {
    if (feedbackFormInitialized) {
        console.log('Feedback form already initialized, skipping');
        return;
    }
    feedbackFormInitialized = true;
    console.log('Initializing feedback form');
    new BottomFeedbackForm();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeFeedbackForm);

// Fallback initialization for cases where DOMContentLoaded has already fired
if (document.readyState !== 'loading') {
    // DOM is already loaded, initialize immediately
    initializeFeedbackForm();
} 