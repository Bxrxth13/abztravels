/**
 * Modern Booking Form Handler for AUTOBOTZ TOURS & TRAVELS
 * Optimized, clean, and user-friendly
 */

(function() {
    'use strict';

    // Form state
    const formState = {
        isRoundTrip: true,
        isLoading: false
    };

    // Initialize form
    function initBookingForm() {
        const form = document.getElementById('contact_form');
        if (!form) return;

        // Initialize trip type toggle
        initTripToggle();
        
        // Initialize vehicle selectors
        initVehicleSelectors();
        
        // Initialize location swap
        initLocationSwap();
        
        // Initialize validation
        initValidation();
        
        // Initialize date pickers
        initDatePickers();
    }

    // Trip type toggle (One Way / Round Trip)
    function initTripToggle() {
        const oneWayBtn = document.getElementById('trip-one-way');
        const roundTripBtn = document.getElementById('trip-round-trip');
        const returnFields = document.getElementById('return-fields');

        if (!oneWayBtn || !roundTripBtn) return;

        oneWayBtn.addEventListener('click', () => {
            formState.isRoundTrip = false;
            oneWayBtn.classList.add('active');
            roundTripBtn.classList.remove('active');
            if (returnFields) {
                returnFields.style.display = 'none';
                // Clear return date/time
                const returnDate = document.getElementById('date-picker-2');
                const returnTime = document.getElementById('collection-time');
                if (returnDate) returnDate.value = '';
                if (returnTime) returnTime.value = 'Select time';
            }
        });

        roundTripBtn.addEventListener('click', () => {
            formState.isRoundTrip = true;
            roundTripBtn.classList.add('active');
            oneWayBtn.classList.remove('active');
            if (returnFields) {
                returnFields.style.display = 'block';
            }
        });
    }

    // Vehicle selector cards
    function initVehicleSelectors() {
        const vehicleCards = document.querySelectorAll('.vehicle-card');
        vehicleCards.forEach(card => {
            const radio = card.querySelector('input[type="radio"]');
            if (!radio) return;

            card.addEventListener('click', () => {
                // Remove selected from all
                vehicleCards.forEach(c => c.classList.remove('selected'));
                // Add selected to clicked
                card.classList.add('selected');
                radio.checked = true;
            });

            // Update on radio change
            radio.addEventListener('change', () => {
                if (radio.checked) {
                    vehicleCards.forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                }
            });
        });
    }

    // Swap locations
    function initLocationSwap() {
        const swapBtn = document.getElementById('swap-locations');
        if (!swapBtn) return;

        swapBtn.addEventListener('click', () => {
            const pickup = document.getElementById('autocomplete');
            const dropoff = document.getElementById('autocomplete2');
            
            if (pickup && dropoff) {
                const temp = pickup.value;
                pickup.value = dropoff.value;
                dropoff.value = temp;
                
                // Trigger validation
                validateField(pickup);
                validateField(dropoff);
            }
        });
    }

    // Real-time validation
    function initValidation() {
        const form = document.getElementById('contact_form');
        if (!form) return;

        const fields = form.querySelectorAll('input, select');
        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });
    }

    // Validate individual field
    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove previous error state
        field.classList.remove('error');
        if (errorMsg) errorMsg.classList.remove('show');

        // Check if required and empty
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Phone number validation
        if (field.id === 'phone-number') {
            const phonePattern = /^\d{10}$/;
            if (field.value && !phonePattern.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid 10-digit phone number';
            }
        }

        // Date validation
        if (field.id === 'date-picker' || field.id === 'date-picker-2') {
            if (field.value) {
                const selectedDate = new Date(field.value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                
                if (selectedDate < today) {
                    isValid = false;
                    message = 'Please select a future date';
                }
            }
        }

        // Return date should be after pickup date
        if (field.id === 'date-picker-2' && formState.isRoundTrip) {
            const pickupDate = document.getElementById('date-picker');
            if (pickupDate && pickupDate.value && field.value) {
                const pickup = new Date(pickupDate.value);
                const returnDate = new Date(field.value);
                
                if (returnDate < pickup) {
                    isValid = false;
                    message = 'Return date must be after pickup date';
                }
            }
        }

        // Show error if invalid
        if (!isValid) {
            field.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.classList.add('show');
            }
        }

        return isValid;
    }

    // Initialize date pickers (if using a date picker library)
    function initDatePickers() {
        // This would integrate with your date picker library
        // For now, we'll just ensure min date is today
        const datePickers = document.querySelectorAll('#date-picker, #date-picker-2');
        const today = new Date().toISOString().split('T')[0];
        
        datePickers.forEach(picker => {
            if (picker.type === 'date') {
                picker.setAttribute('min', today);
            }
        });
    }

    // Enhanced form submission
    function handleFormSubmit(event) {
        event.preventDefault();
        
        if (formState.isLoading) return;

        const form = document.getElementById('contact_form');
        if (!form) return;

        // Validate all fields
        const fields = form.querySelectorAll('input[required], select[required]');
        let allValid = true;

        fields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        // Check vehicle selection
        const vehicleSelected = form.querySelector('input[name="Car_Type"]:checked');
        if (!vehicleSelected) {
            allValid = false;
            const vehicleSection = form.querySelector('.vehicle-selector');
            if (vehicleSection) {
                vehicleSection.style.border = '2px solid #dc3545';
                setTimeout(() => {
                    vehicleSection.style.border = 'none';
                }, 3000);
            }
        }

        if (!allValid) {
            showNotification('Please fill in all required fields correctly', 'error');
            return;
        }

        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('btn-loading');
            submitBtn.disabled = true;
        }
        formState.isLoading = true;

        // Collect form data
        const formData = collectFormData();

        // Send to WhatsApp
        setTimeout(() => {
            sendToWhatsApp(formData);
            formState.isLoading = false;
            if (submitBtn) {
                submitBtn.classList.remove('btn-loading');
                submitBtn.disabled = false;
            }
        }, 500); // Small delay for UX
    }

    // Collect form data
    function collectFormData() {
        const vehicleType = document.querySelector('input[name="Car_Type"]:checked')?.value || '';
        const pickupLocation = document.getElementById('autocomplete')?.value || '';
        const dropoffLocation = document.getElementById('autocomplete2')?.value || '';
        const countryCode = document.getElementById('country-code')?.value || '+91';
        const phoneNumber = document.getElementById('phone-number')?.value || '';
        const pickupDate = document.getElementById('date-picker')?.value || '';
        const pickupTime = document.getElementById('pickup-time')?.value || '';
        const returnDate = formState.isRoundTrip ? (document.getElementById('date-picker-2')?.value || '') : '';
        const returnTime = formState.isRoundTrip ? (document.getElementById('collection-time')?.value || '') : '';

        return {
            vehicleType,
            pickupLocation,
            dropoffLocation,
            phoneNumber: `${countryCode}${phoneNumber}`,
            pickupDate,
            pickupTime,
            returnDate,
            returnTime,
            tripType: formState.isRoundTrip ? 'Round Trip' : 'One Way'
        };
    }

    // Send to WhatsApp
    function sendToWhatsApp(data) {
        const number = "+917092666644";
        
        let message = `*ENQUIRE FROM AUTOBOTZ TOURS & TRAVELS*\n\n`;
        message += `*Vehicle Type:* ${data.vehicleType}\n`;
        message += `*Trip Type:* ${data.tripType}\n\n`;
        message += `*Pickup Location:* ${data.pickupLocation}\n`;
        message += `*Dropoff Location:* ${data.dropoffLocation}\n\n`;
        message += `*Phone Number:* ${data.phoneNumber}\n\n`;
        message += `*Pickup Date:* ${data.pickupDate}\n`;
        message += `*Pickup Time:* ${data.pickupTime}\n`;
        
        if (formState.isRoundTrip) {
            message += `\n*Return Date:* ${data.returnDate}\n`;
            message += `*Return Time:* ${data.returnTime}\n`;
        }
        
        message += `\n_Powered by AUTOBOTZ TOURS & TRAVELS_`;

        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // Show notification
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc3545' : '#28a745'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBookingForm);
    } else {
        initBookingForm();
    }

    // Export for global use
    window.handleFormSubmit = handleFormSubmit;
    window.validateField = validateField;

})();

