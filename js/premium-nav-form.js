/**
 * PREMIUM NAVBAR & BOOKING FORM HANDLER
 * AUTOBOTZ TOURS & TRAVELS
 * Namespaced IIFE - No global leaks
 */
(function() {
    'use strict';

    // State management
    const state = {
        selectedCategory: null,
        selectedModel: null,
        openDropdown: null,
        isFormValid: false,
        mobilePanelOpen: false,
        touchStartY: 0,
        touchEndY: 0
    };

    // DOM elements cache
    let header, bookNowBtn, mobileToggle, mobilePanel, bookingModal, form, submitBtn;
    let categoryPills, categoryDropdowns, tripOptions, returnFields;

    // Initialize on DOM ready
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initComponents);
        } else {
            initComponents();
        }
    }

    function initComponents() {
        cacheElements();
        if (!header) return;

        initNavbar();
        initMobileMenu();
        
        // Only initialize form-related features if form exists
        if (form) {
            initCategoryPills();
            initFormValidation();
            initFormSubmission();
            initMobileModal();
            initKeyboardNavigation();
            initSwipeGesture();
        }
    }

    function cacheElements() {
        header = document.getElementById('premium-header');
        bookNowBtn = document.getElementById('premium-book-now-btn');
        mobileToggle = document.getElementById('premium-mobile-toggle');
        mobilePanel = document.getElementById('premium-mobile-panel');
        bookingModal = document.getElementById('premium-booking-modal');
        form = document.getElementById('premium-booking-form');
        submitBtn = document.getElementById('premium-submit-btn');
        categoryPills = document.querySelectorAll('.premium-category-pill');
        categoryDropdowns = document.querySelectorAll('.premium-category-dropdown');
        returnFields = document.getElementById('premium-return-fields');
    }

    // ===== NAVBAR FUNCTIONALITY =====
    function initNavbar() {
        // Shrink on scroll
        let lastScroll = 0;
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (currentScroll > 100) {
                header.classList.add('shrunk');
            } else {
                header.classList.remove('shrunk');
            }

            lastScroll = currentScroll;
        }, { passive: true });

        // Phone Call button - tel: link handles the call automatically
        // No need for click handler as the tel: link will trigger phone call
        // On mobile: directly initiates call
        // On desktop: may open default phone app or prompt

        // Vehicle dropdown hover
        const vehicleMenuItem = document.querySelector('.premium-menu-item-has-dropdown');
        if (vehicleMenuItem) {
            const submenu = vehicleMenuItem.querySelector('.premium-submenu');
            vehicleMenuItem.addEventListener('mouseenter', () => {
                vehicleMenuItem.querySelector('a').setAttribute('aria-expanded', 'true');
            });
            vehicleMenuItem.addEventListener('mouseleave', () => {
                vehicleMenuItem.querySelector('a').setAttribute('aria-expanded', 'false');
            });
        }
    }

    // ===== MOBILE MENU FUNCTIONALITY =====
    // NOTE: Mobile menu functionality is now handled by hamburger-fixes.js
    // This function is kept for backward compatibility but does nothing
    // to avoid conflicts with hamburger-fixes.js handlers
    function initMobileMenu() {
        // Mobile menu initialization is handled by hamburger-fixes.js
        // No action needed here to prevent duplicate handlers and conflicts
    }

    function scrollToForm() {
        const formSection = document.getElementById('premium-booking-form-section');
        if (formSection) {
            formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    // ===== CATEGORY PILLS & DROPDOWNS =====
    function initCategoryPills() {
        categoryPills.forEach(pill => {
            pill.addEventListener('click', (e) => {
                e.stopPropagation();
                const category = pill.getAttribute('data-category');
                toggleCategoryDropdown(category, pill);
            });

            // Keyboard support
            pill.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    pill.click();
                }
            });
        });

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.premium-category-pill') && 
                !e.target.closest('.premium-category-dropdown')) {
                closeAllDropdowns();
            }
        });

        // Initialize model option clicks
        document.querySelectorAll('.premium-model-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const category = option.closest('.premium-category-dropdown').getAttribute('data-category');
                const model = option.getAttribute('data-value');
                selectModel(category, model, option);
            });

            // Keyboard navigation in dropdown
            option.addEventListener('keydown', (e) => {
                const options = Array.from(option.parentElement.querySelectorAll('.premium-model-option'));
                const currentIndex = options.indexOf(option);

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const nextIndex = (currentIndex + 1) % options.length;
                    options[nextIndex].focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prevIndex = (currentIndex - 1 + options.length) % options.length;
                    options[prevIndex].focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    option.click();
                } else if (e.key === 'Escape') {
                    closeAllDropdowns();
                }
            });
        });
    }

    function toggleCategoryDropdown(category, pill) {
        const dropdown = document.querySelector(`.premium-category-dropdown[data-category="${category}"]`);
        
        if (state.openDropdown === category) {
            closeAllDropdowns();
        } else {
            closeAllDropdowns();
            state.openDropdown = category;
            pill.setAttribute('aria-expanded', 'true');
            pill.classList.add('active');
            if (dropdown) {
                dropdown.classList.add('show');
                // Focus first option
                const firstOption = dropdown.querySelector('.premium-model-option');
                if (firstOption) setTimeout(() => firstOption.focus(), 100);
            }
        }
    }

    function closeAllDropdowns() {
        categoryPills.forEach(pill => {
            pill.setAttribute('aria-expanded', 'false');
            pill.classList.remove('active');
        });
        categoryDropdowns.forEach(dropdown => {
            dropdown.classList.remove('show');
        });
        state.openDropdown = null;
    }

    function selectModel(category, model, optionElement) {
        state.selectedCategory = category;
        state.selectedModel = model;
        
        // Update hidden field
        const vehicleTypeField = document.getElementById('premium-vehicle-type');
        if (vehicleTypeField) {
            vehicleTypeField.value = `${category}-${model}`;
        }

        // Update UI
        categoryPills.forEach(pill => pill.classList.remove('active'));
        const selectedPill = document.querySelector(`.premium-category-pill[data-category="${category}"]`);
        if (selectedPill) selectedPill.classList.add('active');

        // Update selected state in dropdown
        document.querySelectorAll('.premium-model-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        optionElement.classList.add('selected');

        // Update summary pill
        updateSelectedPill(category, model);

        // Close dropdown
        closeAllDropdowns();

        // Enable submit if form is valid
        validateForm();
    }

    function updateSelectedPill(category, model) {
        const pill = document.getElementById('premium-selected-pill');
        const text = document.getElementById('premium-selected-text');
        const closeBtn = pill.querySelector('.premium-pill-close');

        if (pill && text) {
            const categoryNames = {
                'car': 'Car',
                'traveller': 'Traveller',
                'minibus': 'Mini-bus',
                'coach': 'Coach'
            };
            text.textContent = `${categoryNames[category]} — ${model}`;
            pill.style.display = 'inline-flex';
            if (closeBtn) closeBtn.style.display = 'block';
        }

        // Close button handler
        if (closeBtn) {
            closeBtn.onclick = () => {
                state.selectedCategory = null;
                state.selectedModel = null;
                const vehicleTypeField = document.getElementById('premium-vehicle-type');
                if (vehicleTypeField) vehicleTypeField.value = '';
                pill.style.display = 'none';
                categoryPills.forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.premium-model-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                validateForm();
            };
        }
    }


    // ===== FORM VALIDATION =====
    function initFormValidation() {
        const fields = form.querySelectorAll('input[required], select[required]');

        fields.forEach(field => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    validateField(field);
                }
                validateForm();
            });
        });

        // Real-time phone validation
        const phoneInput = document.getElementById('premium-phone-number');
        if (phoneInput) {
            phoneInput.addEventListener('input', () => {
                validatePhone(phoneInput);
                validateForm();
            });
        }

        // Date validation
        const pickupDate = document.getElementById('premium-pickup-date');
        const returnDate = document.getElementById('premium-return-date');

        if (pickupDate) {
            pickupDate.addEventListener('change', () => {
                validateDate(pickupDate);
                if (returnDate && returnDate.value) {
                    validateReturnDate(returnDate, pickupDate);
                }
                validateForm();
            });
        }

        if (returnDate) {
            returnDate.addEventListener('change', () => {
                validateReturnDate(returnDate, pickupDate);
                validateForm();
            });
        }
    }

    function validateField(field) {
        const errorMsg = field.parentElement.querySelector('.premium-error-message');
        let isValid = true;
        let message = '';

        // Required check
        if (field.hasAttribute('required') && !field.value.trim()) {
            isValid = false;
            message = 'This field is required';
        }

        // Phone validation
        if (field.id === 'premium-phone-number' && field.value) {
            if (!/^[0-9]{10}$/.test(field.value)) {
                isValid = false;
                message = 'Please enter a valid 10-digit phone number';
            }
        }

        // Date validation
        if (field.classList.contains('date-picker') && field.value) {
            const date = new Date(field.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isNaN(date.getTime())) {
                isValid = false;
                message = 'Please enter a valid date';
            } else if (date < today) {
                isValid = false;
                message = 'Date cannot be in the past';
            }
        }

        // Update UI
        if (isValid) {
            field.classList.remove('error');
            if (errorMsg) {
                errorMsg.classList.remove('show');
                errorMsg.textContent = '';
            }
        } else {
            field.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = message;
                errorMsg.classList.add('show');
            }
        }

        return isValid;
    }

    function validatePhone(phoneInput) {
        const value = phoneInput.value.replace(/\D/g, '');
        phoneInput.value = value;
        return validateField(phoneInput);
    }

    function validateDate(dateInput) {
        return validateField(dateInput);
    }

    function validateReturnDate(returnDateInput, pickupDateInput) {
        if (!returnDateInput.value || !pickupDateInput.value) {
            return true;
        }

        const returnDate = new Date(returnDateInput.value);
        const pickupDate = new Date(pickupDateInput.value);

        if (returnDate < pickupDate) {
            const errorMsg = returnDateInput.parentElement.querySelector('.premium-error-message');
            returnDateInput.classList.add('error');
            if (errorMsg) {
                errorMsg.textContent = 'Return date must be after pickup date';
                errorMsg.classList.add('show');
            }
            return false;
        }

        return validateField(returnDateInput);
    }

    function validateForm() {
        if (!form) return false;

        // Check vehicle selection
        if (!state.selectedCategory || !state.selectedModel) {
            state.isFormValid = false;
            updateSubmitButton();
            return false;
        }

        // Check required fields
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        let allValid = true;

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                allValid = false;
            }
        });

        state.isFormValid = allValid;
        updateSubmitButton();
        return allValid;
    }

    function updateSubmitButton() {
        if (submitBtn) {
            submitBtn.disabled = !state.isFormValid;
        }
    }

    // ===== FORM SUBMISSION =====
    function initFormSubmission() {
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm()) {
                showFormStatus('Please fill in all required fields correctly', 'error');
                // Focus first invalid field
                const firstInvalid = form.querySelector('.error');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Show loading state
            const btnText = submitBtn.querySelector('.premium-btn-text');
            const btnLoader = submitBtn.querySelector('.premium-btn-loader');
            
            submitBtn.disabled = true;
            if (btnText) btnText.style.display = 'none';
            if (btnLoader) btnLoader.style.display = 'flex';

            // Prepare form data for existing sendToWhatsapp function
            prepareFormForWhatsApp();

            // Call existing WhatsApp function
            setTimeout(() => {
                if (typeof sendToWhatsapp === 'function') {
                    const syntheticEvent = {
                        preventDefault: () => {},
                        target: form
                    };
                    sendToWhatsapp(syntheticEvent);
                } else {
                    // Fallback: direct WhatsApp redirect
                    redirectToWhatsApp();
                }

                // Show success message
                showFormStatus('Booking request sent! Redirecting to WhatsApp...', 'success');

                // Reset loading state after delay
                setTimeout(() => {
                    if (btnText) btnText.style.display = 'inline';
                    if (btnLoader) btnLoader.style.display = 'none';
                    submitBtn.disabled = false;
                }, 2000);
            }, 500);
        });
    }

    function prepareFormForWhatsApp() {
        // Map to existing field IDs for compatibility
        const vehicleType = document.getElementById('premium-vehicle-type').value;
        const pickupLocation = document.getElementById('premium-pickup-location').value;
        const dropoffLocation = document.getElementById('premium-dropoff-location').value;
        const phoneNumber = document.getElementById('premium-phone-number').value;
        const pickupDate = document.getElementById('premium-pickup-date').value;
        const pickupTime = document.getElementById('premium-pickup-time').value;
        const returnDate = document.getElementById('premium-return-date').value;
        const returnTime = document.getElementById('premium-return-time').value;

        // Create/update hidden radio for Car_Type
        let carTypeRadio = document.querySelector('input[name="Car_Type"]:checked');
        if (!carTypeRadio) {
            carTypeRadio = document.createElement('input');
            carTypeRadio.type = 'radio';
            carTypeRadio.name = 'Car_Type';
            carTypeRadio.style.display = 'none';
            document.body.appendChild(carTypeRadio);
        }
        carTypeRadio.value = vehicleType;
        carTypeRadio.checked = true;

        // Map to existing field IDs if they exist
        const autocomplete = document.getElementById('autocomplete');
        const autocomplete2 = document.getElementById('autocomplete2');
        const datePicker = document.getElementById('date-picker');
        const datePicker2 = document.getElementById('date-picker-2');
        const collectionTime = document.getElementById('collection-time');
        const phoneField = document.getElementById('phone-number');

        if (autocomplete) autocomplete.value = pickupLocation;
        if (autocomplete2) autocomplete2.value = dropoffLocation;
        if (datePicker) datePicker.value = pickupDate;
        if (datePicker2) datePicker2.value = returnDate;
        if (collectionTime) collectionTime.value = returnTime;
        if (phoneField) phoneField.value = phoneNumber;
    }

    function redirectToWhatsApp() {
        const number = "+917092666644";
        const vehicleType = document.getElementById('premium-vehicle-type').value;
        const pickupLocation = document.getElementById('premium-pickup-location').value;
        const dropoffLocation = document.getElementById('premium-dropoff-location').value;
        const phoneNumber = document.getElementById('premium-phone-number').value;
        const pickupDate = document.getElementById('premium-pickup-date').value;
        const pickupTime = document.getElementById('premium-pickup-time').value;
        const returnDate = document.getElementById('premium-return-date').value;
        const returnTime = document.getElementById('premium-return-time').value;

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
        const statusEl = document.getElementById('premium-form-status');
        if (statusEl) {
            statusEl.textContent = message;
            statusEl.className = `premium-form-status show ${type}`;
            statusEl.setAttribute('role', 'alert');
        }
    }

    // ===== MOBILE MODAL =====
    function initMobileModal() {
        if (!bookingModal) return;

        const modalBackdrop = bookingModal.querySelector('.premium-modal-backdrop');
        const modalClose = bookingModal.querySelector('.premium-modal-close');
        const modalBody = bookingModal.querySelector('.premium-modal-body');

        // Clone form to modal on mobile
        function cloneFormToModal() {
            if (window.innerWidth <= 992 && form && modalBody) {
                const formClone = form.cloneNode(true);
                formClone.id = 'premium-booking-form-mobile';
                modalBody.innerHTML = '';
                modalBody.appendChild(formClone);
                // Re-initialize form handlers for cloned form
                initFormValidation();
                initFormSubmission();
            }
        }

        // Open modal
        function openModal() {
            cloneFormToModal();
            bookingModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            state.mobilePanelOpen = true;
            trapFocus(bookingModal);
        }

        // Close modal
        function closeModal() {
            bookingModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            state.mobilePanelOpen = false;
            if (bookNowBtn) bookNowBtn.focus();
        }

        // Event listeners
        if (modalBackdrop) {
            modalBackdrop.addEventListener('click', closeModal);
        }

        if (modalClose) {
            modalClose.addEventListener('click', closeModal);
        }

        // Expose open function
        window.openMobileModal = openModal;

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && state.mobilePanelOpen) {
                closeModal();
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 992 && state.mobilePanelOpen) {
                closeModal();
            }
        });
    }

    function openMobileModal() {
        if (window.openMobileModal) {
            window.openMobileModal();
        }
    }

    // ===== KEYBOARD NAVIGATION & FOCUS TRAPPING =====
    function initKeyboardNavigation() {
        // Tab navigation in dropdowns
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllDropdowns();
                if (state.mobilePanelOpen && bookingModal) {
                    bookingModal.setAttribute('aria-hidden', 'true');
                    document.body.style.overflow = '';
                    state.mobilePanelOpen = false;
                }
            }
        });
    }

    function trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', function trap(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }

    // ===== SWIPE GESTURE =====
    function initSwipeGesture() {
        if (!bookingModal) return;

        bookingModal.addEventListener('touchstart', (e) => {
            state.touchStartY = e.touches[0].clientY;
        }, { passive: true });

        bookingModal.addEventListener('touchend', (e) => {
            state.touchEndY = e.changedTouches[0].clientY;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const swipeThreshold = 100;
        const swipeDistance = state.touchStartY - state.touchEndY;

        if (swipeDistance > swipeThreshold && state.mobilePanelOpen) {
            // Swipe down to close
            bookingModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            state.mobilePanelOpen = false;
        }
    }

    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize
    init();
})();

