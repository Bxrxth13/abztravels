/**
 * Modern Navbar & Booking Form Handler
 * Namespaced IIFE to avoid conflicts
 */
(function() {
    'use strict';

    // State management
    const state = {
        selectedCategory: null,
        selectedModel: null,
        openDropdown: null,
        isFormValid: false
    };

    // Initialize on DOM ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initComponents);
        } else {
            initComponents();
        }
    }

    function initComponents() {
        initNavbar();
        initVehicleDropdowns();
        initFormValidation();
        initFormSubmission();
        initScrollToForm();
    }

    // ===== NAVBAR FUNCTIONALITY =====
    function initNavbar() {
        const header = document.getElementById('main-header');
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const menu = document.getElementById('main-menu');
        const menuItems = menu.querySelectorAll('.menu-item');

        // Sticky header scroll effect
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            lastScroll = currentScroll;
        });

        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
                mobileToggle.setAttribute('aria-expanded', !isExpanded);
                menu.classList.toggle('active');
            });
        }

        // Close mobile menu on item click
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menu.classList.remove('active');
                if (mobileToggle) {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                }
            });
        });

        // Close mobile menu on outside click
        document.addEventListener('click', (e) => {
            if (menu && mobileToggle && !menu.contains(e.target) && !mobileToggle.contains(e.target)) {
                menu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            }
        });

        // Keyboard navigation for menu
        menuItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowRight' && index < menuItems.length - 1) {
                    menuItems[index + 1].focus();
                } else if (e.key === 'ArrowLeft' && index > 0) {
                    menuItems[index - 1].focus();
                }
            });
        });
    }

    // ===== VEHICLE DROPDOWN FUNCTIONALITY =====
    function initVehicleDropdowns() {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const dropdowns = document.querySelectorAll('.category-dropdown');
        const modelButtons = document.querySelectorAll('.category-dropdown button');
        const vehicleTypeInput = document.getElementById('vehicle_type');
        const summary = document.getElementById('selected-vehicle-summary');
        const summaryText = document.getElementById('selected-vehicle-text');
        const submitBtn = document.getElementById('form-submit-btn');

        // Category button click handlers
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = btn.getAttribute('data-category');
                const dropdown = btn.nextElementSibling;
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';

                // Close all other dropdowns
                closeAllDropdowns(btn);

                // Toggle current dropdown
                if (!isExpanded) {
                    openDropdown(btn, dropdown);
                } else {
                    closeDropdown(btn, dropdown);
                }
            });

            // Keyboard support
            btn.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                } else if (e.key === 'Escape') {
                    closeAllDropdowns();
                }
            });
        });

        // Model selection handlers
        modelButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const categoryBtn = btn.closest('.category-dropdown-wrapper').querySelector('.category-btn');
                const category = categoryBtn.getAttribute('data-category');
                const model = btn.getAttribute('data-value');

                // Update state
                state.selectedCategory = category;
                state.selectedModel = model;

                // Update UI
                updateSelectedModel(categoryBtn, btn, modelButtons);
                updateVehicleSummary(category, model, summary, summaryText);
                updateHiddenField(vehicleTypeInput, category, model);
                enableSubmitButton(submitBtn);

                // Close dropdown
                closeAllDropdowns();
            });

            // Keyboard navigation in dropdown
            btn.addEventListener('keydown', (e) => {
                const dropdown = btn.closest('.category-dropdown');
                const buttons = Array.from(dropdown.querySelectorAll('button'));
                const currentIndex = buttons.indexOf(btn);

                if (e.key === 'ArrowDown' && currentIndex < buttons.length - 1) {
                    e.preventDefault();
                    buttons[currentIndex + 1].focus();
                } else if (e.key === 'ArrowUp' && currentIndex > 0) {
                    e.preventDefault();
                    buttons[currentIndex - 1].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    btn.click();
                } else if (e.key === 'Escape') {
                    closeAllDropdowns();
                }
            });
        });

        // Close dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.category-dropdown-wrapper')) {
                closeAllDropdowns();
            }
        });
    }

    function openDropdown(btn, dropdown) {
        btn.setAttribute('aria-expanded', 'true');
        btn.classList.add('active');
        dropdown.classList.add('active');
        state.openDropdown = btn;
    }

    function closeDropdown(btn, dropdown) {
        btn.setAttribute('aria-expanded', 'false');
        btn.classList.remove('active');
        dropdown.classList.remove('active');
        state.openDropdown = null;
    }

    function closeAllDropdowns(exceptBtn = null) {
        const categoryButtons = document.querySelectorAll('.category-btn');
        const dropdowns = document.querySelectorAll('.category-dropdown');

        categoryButtons.forEach((btn, index) => {
            if (btn !== exceptBtn) {
                closeDropdown(btn, dropdowns[index]);
            }
        });
    }

    function updateSelectedModel(categoryBtn, selectedBtn, allButtons) {
        // Remove selected from all
        allButtons.forEach(btn => btn.classList.remove('selected'));

        // Add selected to clicked
        selectedBtn.classList.add('selected');

        // Update category button
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        categoryBtn.classList.add('active');
    }

    function updateVehicleSummary(category, model, summary, summaryText) {
        const categoryNames = {
            'car': 'Car',
            'traveller': 'Traveller',
            'minibus': 'Mini-bus',
            'coach': 'Coach'
        };

        summaryText.textContent = `${categoryNames[category]} — ${model}`;
        summary.style.display = 'block';
    }

    function updateHiddenField(input, category, model) {
        input.value = `${category}-${model}`;
    }

    function enableSubmitButton(btn) {
        btn.disabled = false;
        btn.setAttribute('aria-label', 'Submit booking form');
    }


    // ===== FORM VALIDATION =====
    function initFormValidation() {
        const form = document.getElementById('single-booking-form');
        const fields = form.querySelectorAll('input[required], select[required]');

        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
            });
        });

        // Real-time phone validation
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                validatePhone(phoneInput);
            });
        }

        // Date validation
        const pickupDate = document.getElementById('pickup-date');
        const returnDate = document.getElementById('return-date');
        
        if (pickupDate) {
            pickupDate.addEventListener('change', () => {
                validateDate(pickupDate);
                if (returnDate && returnDate.value) {
                    validateReturnDate(returnDate, pickupDate);
                }
            });
        }

        if (returnDate) {
            returnDate.addEventListener('change', () => {
                validateReturnDate(returnDate, pickupDate);
            });
        }
    }

    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let message = '';

        // Remove previous error
        field.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
            errorMsg.textContent = '';
        }

        // Check required
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Show error
        if (!isValid) {
            field.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.classList.add('show');
            }
        }

        return isValid;
    }

    function validatePhone(input) {
        const errorMsg = input.parentElement.querySelector('.error-message');
        const phonePattern = /^\d{10}$/;
        
        input.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }

        if (input.value && !phonePattern.test(input.value)) {
            input.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'Please enter a valid 10-digit phone number';
                errorMsg.classList.add('show');
            }
            return false;
        }

        return true;
    }

    function validateDate(dateInput) {
        const errorMsg = dateInput.parentElement.querySelector('.error-message');
        const selectedDate = new Date(dateInput.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        dateInput.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }

        if (dateInput.value && selectedDate < today) {
            dateInput.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'Please select a future date';
                errorMsg.classList.add('show');
            }
            return false;
        }

        return true;
    }

    function validateReturnDate(returnInput, pickupInput) {
        const errorMsg = returnInput.parentElement.querySelector('.error-message');
        const pickupDate = new Date(pickupInput.value);
        const returnDate = new Date(returnInput.value);

        returnInput.classList.remove('error');
        if (errorMsg) {
            errorMsg.classList.remove('show');
        }

        if (returnInput.value && returnDate < pickupDate) {
            returnInput.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'Return date must be after pickup date';
                errorMsg.classList.add('show');
            }
            return false;
        }

        return true;
    }

    function validateForm() {
        const form = document.getElementById('single-booking-form');
        const requiredFields = form.querySelectorAll('input[required]:not(.hidden), select[required]:not(.hidden)');
        let isValid = true;

        // Check vehicle selection
        if (!state.selectedModel) {
            isValid = false;
            showFormStatus('Please select a vehicle model', 'error');
        }

        // Validate all required fields
        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isValid = false;
            }
        });

        // Validate phone
        const phoneInput = document.getElementById('phone-number');
        if (phoneInput && phoneInput.value && !validatePhone(phoneInput)) {
            isValid = false;
        }

        // Validate dates
        const pickupDate = document.getElementById('pickup-date');
        if (pickupDate && pickupDate.value && !validateDate(pickupDate)) {
            isValid = false;
        }

        // Always validate return date
        const returnDate = document.getElementById('return-date');
        if (returnDate && returnDate.value) {
            if (!validateReturnDate(returnDate, pickupDate)) {
                isValid = false;
            }
        }

        state.isFormValid = isValid;
        return isValid;
    }

    // ===== FORM SUBMISSION =====
    function initFormSubmission() {
        const form = document.getElementById('single-booking-form');
        const submitBtn = document.getElementById('form-submit-btn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Validate form
            if (!validateForm()) {
                showFormStatus('Please fill in all required fields correctly', 'error');
                return;
            }

            // Show loading state
            submitBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoader.style.display = 'inline-flex';

            // Prepare form data for WhatsApp
            prepareFormForWhatsApp();

            // Call existing WhatsApp function
            setTimeout(() => {
                if (typeof sendToWhatsapp === 'function') {
                    // Create a synthetic event for the existing function
                    const syntheticEvent = {
                        preventDefault: () => {}
                    };
                    sendToWhatsapp(syntheticEvent);
                } else {
                    // Fallback: direct WhatsApp redirect
                    redirectToWhatsApp();
                }

                // Reset loading state
                submitBtn.disabled = false;
                btnText.style.display = 'inline';
                btnLoader.style.display = 'none';
            }, 500);
        });
    }

    function prepareFormForWhatsApp() {
        // Map form fields to existing WhatsApp function expectations
        const vehicleType = document.getElementById('vehicle_type').value;
        const pickupLocation = document.getElementById('pickup-location').value;
        const dropoffLocation = document.getElementById('dropoff-location').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        const returnDate = document.getElementById('return-date').value;
        const returnTime = document.getElementById('return-time').value;

        // Create hidden radio button for vehicle type (for existing function compatibility)
        let carTypeRadio = document.querySelector('input[name="Car_Type"]:checked');
        if (!carTypeRadio) {
            carTypeRadio = document.createElement('input');
            carTypeRadio.type = 'radio';
            carTypeRadio.name = 'Car_Type';
            carTypeRadio.value = vehicleType;
            carTypeRadio.checked = true;
            carTypeRadio.style.display = 'none';
            document.body.appendChild(carTypeRadio);
        } else {
            carTypeRadio.value = vehicleType;
        }

        // Map to existing field IDs if they exist
        const autocomplete = document.getElementById('autocomplete');
        const autocomplete2 = document.getElementById('autocomplete2');
        const datePicker = document.getElementById('date-picker');
        const datePicker2 = document.getElementById('date-picker-2');
        const collectionTime = document.getElementById('collection-time');

        if (autocomplete) autocomplete.value = pickupLocation;
        if (autocomplete2) autocomplete2.value = dropoffLocation;
        if (datePicker) datePicker.value = pickupDate;
        if (datePicker2) datePicker2.value = returnDate;
        if (collectionTime) collectionTime.value = returnTime;
    }

    function redirectToWhatsApp() {
        const number = "+917092666644";
        const vehicleType = document.getElementById('vehicle_type').value;
        const pickupLocation = document.getElementById('pickup-location').value;
        const dropoffLocation = document.getElementById('dropoff-location').value;
        const phoneNumber = document.getElementById('phone-number').value;
        const pickupDate = document.getElementById('pickup-date').value;
        const pickupTime = document.getElementById('pickup-time').value;
        const returnDate = document.getElementById('return-date').value;
        const returnTime = document.getElementById('return-time').value;

        let message = `*ENQUIRE FROM AUTOBOTZ TOURS & TRAVELS*\n\n`;
        message += `*Vehicle Type:* ${vehicleType}\n\n`;
        message += `*Pickup Location:* ${pickupLocation}\n`;
        message += `*Dropoff Location:* ${dropoffLocation}\n\n`;
        message += `*Phone Number:* +91${phoneNumber}\n\n`;
        message += `*Pickup Date:* ${pickupDate}\n`;
        message += `*Pickup Time:* ${pickupTime}\n`;
        message += `\n*Return Date:* ${returnDate}\n`;
        message += `*Return Time:* ${returnTime}\n`;
        message += `\n_Powered by AUTOBOTZ TOURS & TRAVELS_`;

        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    function showFormStatus(message, type) {
        const statusEl = document.getElementById('form-status');
        statusEl.textContent = message;
        statusEl.className = `form-status ${type} show`;
        statusEl.setAttribute('role', 'alert');

        setTimeout(() => {
            statusEl.classList.remove('show');
        }, 5000);
    }

    // ===== SCROLL TO FORM =====
    function initScrollToForm() {
        const scrollBtn = document.getElementById('scroll-to-form');
        const formSection = document.getElementById('booking-form-section');

        if (scrollBtn && formSection) {
            scrollBtn.addEventListener('click', () => {
                formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }

    // Initialize
    init();

})();

