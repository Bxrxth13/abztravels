/**
 * NEW BOOKING FORM HANDLER
 * AUTOBOTZ TOURS & TRAVELS
 * Namespaced IIFE - No global leaks
 */

(function() {
    'use strict';

    // ===== CONFIGURATION =====
    const CONFIG = {
        categories: {
            car: ['Dezire', 'Etios', 'Ciaz', 'Ertiga', 'Innova', 'Innova Crysta', 'Innova Hycross'],
            traveller: ['12 Seater', '14 Seater', '17 Seater', '18 Seater', '26 Seater'],
            minibus: ['28 Seater', '32 Seater', '36 Seater', '40 Seater', '54 Seater'],
            coach: ['21 Seater', '25 Seater'],
            urbania: ['8 Seater', '10 Seater', '12 Seater','16 Seater']
        },
        // Stub suggestions - Replace with Google Places API in production
        locationSuggestions: [
            'Airport', 'Railway Station', 'Bus Stand', 'City Center',
            'Hotel', 'Hospital', 'Shopping Mall', 'University'
        ]
    };

    // ===== STATE =====
    const state = {
        selectedCategory: null,
        selectedModel: null,
        activeDropdown: null,
        activeSuggestion: null,
        suggestionList: null
    };

    // ===== DOM ELEMENTS =====
    const form = document.getElementById('new-booking-form');
    if (!form) {
        console.warn('New booking form not found');
        return;
    }

    const categoryButtons = document.querySelectorAll('.nb-category-btn');
    const submitBtn = document.getElementById('nb-submit-btn');
    const vehicleTypeInput = document.getElementById('nb-vehicle-type');
    const selectedBadge = document.getElementById('nb-selected-badge');
    const selectedText = document.getElementById('nb-selected-text');
    const mobileModal = document.getElementById('nb-mobile-modal');

    // ===== UTILITY FUNCTIONS =====
    
    function setError(inputEl, message) {
        const fieldGroup = inputEl.closest('.nb-field-group');
        if (!fieldGroup) return;
        
        const errorSlot = fieldGroup.querySelector('.nb-error-slot');
        if (errorSlot) {
            if (message) {
                errorSlot.textContent = message;
                errorSlot.classList.add('show');
                inputEl.setAttribute('aria-invalid', 'true');
            } else {
                errorSlot.textContent = '';
                errorSlot.classList.remove('show');
                inputEl.removeAttribute('aria-invalid');
            }
        }
    }

    function closeAllDropdowns() {
        categoryButtons.forEach(btn => {
            const dropdown = btn.nextElementSibling;
            if (dropdown && dropdown.classList.contains('nb-category-dropdown')) {
                dropdown.setAttribute('aria-hidden', 'true');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        state.activeDropdown = null;
    }

    function closeAllSuggestions() {
        document.querySelectorAll('.nb-suggestions.show').forEach(s => {
            s.classList.remove('show');
        });
        state.suggestionList = null;
        state.activeSuggestion = null;
    }

    function positionDropdownWithinViewport(dropdown, button) {
        if (!dropdown || !button) return;
        
        // Reset positioning
        dropdown.style.left = '';
        dropdown.style.right = '';
        dropdown.style.top = '';
        dropdown.style.bottom = '';
        dropdown.style.transform = '';
        dropdown.style.maxHeight = '';
        dropdown.style.overflowY = '';
        dropdown.style.width = '';
        dropdown.style.maxWidth = '';
        
        // Get viewport and element dimensions
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const buttonRect = button.getBoundingClientRect();
        const wrapper = button.closest('.nb-category-wrapper');
        const wrapperRect = wrapper ? wrapper.getBoundingClientRect() : buttonRect;
        
        // Force a reflow to get accurate dropdown dimensions
        dropdown.style.visibility = 'hidden';
        dropdown.style.display = 'block';
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
        const dropdownRect = dropdown.getBoundingClientRect();
        dropdown.style.visibility = '';
        
        const dropdownWidth = dropdownRect.width;
        const dropdownHeight = dropdownRect.height;
        const padding = 16; // Minimum padding from viewport edges
        
        // Calculate where dropdown would be if positioned at left: 0 (relative to wrapper)
        const dropdownLeftInViewport = wrapperRect.left;
        const dropdownRightInViewport = wrapperRect.left + dropdownWidth;
        
        // Check horizontal overflow
        const wouldOverflowRight = dropdownRightInViewport > viewportWidth - padding;
        const wouldOverflowLeft = dropdownLeftInViewport < padding;
        
        // Position horizontally - always align left like Car button, then adjust if needed
        dropdown.style.left = '0';
        dropdown.style.right = 'auto';
        
        // Force reflow and check actual position
        void dropdown.offsetHeight; // Force reflow
        dropdown.style.visibility = 'hidden';
        const testRect = dropdown.getBoundingClientRect();
        dropdown.style.visibility = '';
        
        // Check if it overflows and adjust
        if (testRect.right > viewportWidth - padding) {
            // Overflows right - shift it left using transform
            const overflowAmount = testRect.right - (viewportWidth - padding);
            dropdown.style.transform = `translateY(0) scale(1) translateX(-${overflowAmount}px)`;
            dropdown.style.maxWidth = (viewportWidth - wrapperRect.left - padding) + 'px';
        } else if (testRect.left < padding) {
            // Would overflow left - shift it right
            const underflowAmount = padding - testRect.left;
            dropdown.style.transform = `translateY(0) scale(1) translateX(${underflowAmount}px)`;
            dropdown.style.maxWidth = (viewportWidth - padding * 2) + 'px';
        } else {
            // No overflow - ensure transform includes translateY and scale for animation
            dropdown.style.transform = 'translateY(0) scale(1)';
        }
        
        // Final check: ensure dropdown is within viewport after all positioning
        void dropdown.offsetHeight; // Force reflow
        const finalRect = dropdown.getBoundingClientRect();
        let currentTransform = dropdown.style.transform || 'translateY(0) scale(1)';
        
        if (finalRect.right > viewportWidth - padding) {
            const overflowAmount = finalRect.right - (viewportWidth - padding);
            // Extract existing translateX if any, otherwise use 0
            const translateXMatch = currentTransform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
            const currentX = translateXMatch ? parseFloat(translateXMatch[1]) : 0;
            const newX = currentX - overflowAmount;
            // Replace or add translateX while preserving translateY and scale
            if (translateXMatch) {
                currentTransform = currentTransform.replace(/translateX\([^)]+\)/, `translateX(${newX}px)`);
            } else {
                currentTransform = `${currentTransform} translateX(${newX}px)`.trim();
            }
            dropdown.style.transform = currentTransform;
        }
        if (finalRect.left < padding) {
            const underflowAmount = padding - finalRect.left;
            const translateXMatch = currentTransform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/);
            const currentX = translateXMatch ? parseFloat(translateXMatch[1]) : 0;
            const newX = currentX + underflowAmount;
            if (translateXMatch) {
                currentTransform = currentTransform.replace(/translateX\([^)]+\)/, `translateX(${newX}px)`);
            } else {
                currentTransform = `${currentTransform} translateX(${newX}px)`.trim();
            }
            dropdown.style.transform = currentTransform;
        }
        
        // Ensure max-width is set for mobile to prevent overflow
        if (viewportWidth <= 768) {
            const currentMaxWidth = dropdown.style.maxWidth;
            if (!currentMaxWidth) {
                dropdown.style.maxWidth = Math.min(dropdownWidth, viewportWidth - padding * 2) + 'px';
            }
        }
        
        // Position vertically - if dropdown would overflow bottom, show above button or limit height
        const dropdownBottom = buttonRect.bottom + dropdownHeight + 8; // 8px is the gap
        if (dropdownBottom > viewportHeight - padding) {
            const spaceAbove = buttonRect.top;
            const spaceBelow = viewportHeight - buttonRect.bottom;
            
            if (spaceAbove > spaceBelow && spaceAbove > dropdownHeight + padding) {
                // Show above button
                dropdown.style.top = 'auto';
                dropdown.style.bottom = 'calc(100% + 8px)';
                dropdown.style.transform = 'translateY(0) scale(1)';
            } else {
                // Limit height and make scrollable
                const maxHeight = Math.min(dropdownHeight, viewportHeight - buttonRect.bottom - padding);
                dropdown.style.maxHeight = maxHeight + 'px';
                dropdown.style.overflowY = 'auto';
            }
        }
    }

    function updateSubmitButton() {
        if (!submitBtn) return;
        
        const name = document.getElementById('nb-name').value.trim();
        const phone = document.getElementById('nb-phone').value.trim();
        const pickup = document.getElementById('nb-pickup').value.trim();
        const destination = document.getElementById('nb-destination').value.trim();
        const pickupDate = document.getElementById('nb-pickup-date').value;
        const returnDate = document.getElementById('nb-return-date').value;
        
        const isValid = name && phone && pickup && destination && pickupDate && returnDate && state.selectedModel;
        submitBtn.disabled = !isValid;
    }

    // ===== CATEGORY DROPDOWNS =====
    
    function initCategoryDropdowns() {
        categoryButtons.forEach(btn => {
            const category = btn.dataset.category;
            const dropdown = btn.nextElementSibling;
            
            if (!dropdown || !dropdown.classList.contains('nb-category-dropdown')) return;

            // Populate dropdown
            const models = CONFIG.categories[category] || [];
            dropdown.innerHTML = models.map(model => 
                `<li><button type="button" class="nb-model-option" data-value="${model}">${model}</button></li>`
            ).join('');

            // Toggle dropdown
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const isOpen = btn.getAttribute('aria-expanded') === 'true';
                
                closeAllDropdowns();
                closeAllSuggestions();
                
                if (!isOpen) {
                    btn.setAttribute('aria-expanded', 'true');
                    dropdown.setAttribute('aria-hidden', 'false');
                    state.activeDropdown = dropdown;
                    
                    // Position dropdown within viewport
                    // Use double requestAnimationFrame to ensure dropdown is fully rendered first
                    requestAnimationFrame(() => {
                        requestAnimationFrame(() => {
                            positionDropdownWithinViewport(dropdown, btn);
                        });
                    });
                    
                    // Focus first option
                    const firstOption = dropdown.querySelector('button');
                    if (firstOption) firstOption.focus();
                }
            });

            // Model selection
            dropdown.addEventListener('click', (e) => {
                const option = e.target.closest('.nb-model-option');
                if (!option) return;
                
                const model = option.dataset.value;
                state.selectedCategory = category;
                state.selectedModel = model;
                
                if (vehicleTypeInput) vehicleTypeInput.value = model;
                
                // Update UI
                dropdown.querySelectorAll('button').forEach(b => b.classList.remove('nb-selected'));
                option.classList.add('nb-selected');
                
                if (selectedBadge) {
                    selectedText.textContent = `${category.charAt(0).toUpperCase() + category.slice(1)} • ${model}`;
                    selectedBadge.style.display = 'inline-flex';
                }
                
                closeAllDropdowns();
                updateSubmitButton();
            });

            // Keyboard navigation
            dropdown.addEventListener('keydown', (e) => {
                const options = Array.from(dropdown.querySelectorAll('button'));
                const currentIndex = options.indexOf(document.activeElement);
                
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    const next = options[currentIndex + 1] || options[0];
                    next.focus();
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    const prev = options[currentIndex - 1] || options[options.length - 1];
                    prev.focus();
                } else if (e.key === 'Escape') {
                    closeAllDropdowns();
                    btn.focus();
                } else if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (document.activeElement.classList.contains('nb-model-option')) {
                        document.activeElement.click();
                    }
                }
            });
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nb-category-btn') && !e.target.closest('.nb-category-dropdown')) {
                closeAllDropdowns();
            }
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeAllDropdowns();
                closeAllSuggestions();
            }
        });
        
        // Reposition dropdown on window resize if it's open
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (state.activeDropdown) {
                    const activeButton = Array.from(categoryButtons).find(btn => {
                        const dropdown = btn.nextElementSibling;
                        return dropdown === state.activeDropdown;
                    });
                    if (activeButton) {
                        positionDropdownWithinViewport(state.activeDropdown, activeButton);
                    }
                }
            }, 100);
        });
    }

    // ===== PREDICTIVE SUGGESTIONS =====
    
    function initPredictiveSuggestions() {
        const pickupInput = document.getElementById('nb-pickup');
        const destinationInput = document.getElementById('nb-destination');
        
        // Initialize suggestions for pickup location
        if (pickupInput) {
            
            let suggestionsContainer = pickupInput.parentElement.querySelector('.nb-suggestions');
            if (!suggestionsContainer) {
                suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'nb-suggestions';
                suggestionsContainer.setAttribute('role', 'listbox');
                pickupInput.parentElement.style.position = 'relative';
                pickupInput.parentElement.appendChild(suggestionsContainer);
            }

            pickupInput.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                
                if (query.length < 2) {
                    suggestionsContainer.classList.remove('show');
                    state.suggestionList = null;
                    return;
                }

                // Stub: Filter suggestions (Replace with Google Places API call)
                const filtered = CONFIG.locationSuggestions.filter(s => 
                    s.toLowerCase().includes(query)
                );

                if (filtered.length === 0) {
                    suggestionsContainer.classList.remove('show');
                    return;
                }

                // Render suggestions
                suggestionsContainer.innerHTML = filtered.map((suggestion, index) => 
                    `<div class="nb-suggestion-item" role="option" tabindex="0" data-index="${index}">${suggestion}</div>`
                ).join('');

                suggestionsContainer.classList.add('show');
                state.suggestionList = suggestionsContainer;
                state.activeSuggestion = null;

                // Keyboard navigation
                const items = suggestionsContainer.querySelectorAll('.nb-suggestion-item');
                items.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        pickupInput.value = item.textContent;
                        suggestionsContainer.classList.remove('show');
                        updateSubmitButton();
                    });

                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            item.click();
                        }
                    });
                });
            });

            pickupInput.addEventListener('keydown', (e) => {
                if (!suggestionsContainer.classList.contains('show')) return;
                
                const items = Array.from(suggestionsContainer.querySelectorAll('.nb-suggestion-item'));
                if (items.length === 0) return;

                let currentIndex = state.activeSuggestion !== null ? state.activeSuggestion : -1;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % items.length;
                    items[currentIndex].focus();
                    items[currentIndex].classList.add('nb-highlighted');
                    items.forEach((item, i) => {
                        if (i !== currentIndex) item.classList.remove('nb-highlighted');
                    });
                    state.activeSuggestion = currentIndex;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                    items[currentIndex].focus();
                    items[currentIndex].classList.add('nb-highlighted');
                    items.forEach((item, i) => {
                        if (i !== currentIndex) item.classList.remove('nb-highlighted');
                    });
                    state.activeSuggestion = currentIndex;
                } else if (e.key === 'Escape') {
                    suggestionsContainer.classList.remove('show');
                    state.suggestionList = null;
                }
            });

            // Close on blur (with delay to allow clicks)
            pickupInput.addEventListener('blur', () => {
                setTimeout(() => {
                    suggestionsContainer.classList.remove('show');
                }, 200);
            });
        }

        // Initialize suggestions for destination
        if (destinationInput) {
            let suggestionsContainer = destinationInput.parentElement.querySelector('.nb-suggestions');
            if (!suggestionsContainer) {
                suggestionsContainer = document.createElement('div');
                suggestionsContainer.className = 'nb-suggestions';
                suggestionsContainer.setAttribute('role', 'listbox');
                destinationInput.parentElement.style.position = 'relative';
                destinationInput.parentElement.appendChild(suggestionsContainer);
            }

            destinationInput.addEventListener('input', (e) => {
                const query = e.target.value.trim().toLowerCase();
                
                if (query.length < 2) {
                    suggestionsContainer.classList.remove('show');
                    state.suggestionList = null;
                    return;
                }

                // Stub: Filter suggestions (Replace with Google Places API call)
                const filtered = CONFIG.locationSuggestions.filter(s => 
                    s.toLowerCase().includes(query)
                );

                if (filtered.length === 0) {
                    suggestionsContainer.classList.remove('show');
                    return;
                }

                // Render suggestions
                suggestionsContainer.innerHTML = filtered.map((suggestion, index) => 
                    `<div class="nb-suggestion-item" role="option" tabindex="0" data-index="${index}">${suggestion}</div>`
                ).join('');

                suggestionsContainer.classList.add('show');
                state.suggestionList = suggestionsContainer;
                state.activeSuggestion = null;

                // Keyboard navigation
                const items = suggestionsContainer.querySelectorAll('.nb-suggestion-item');
                items.forEach((item, index) => {
                    item.addEventListener('click', () => {
                        destinationInput.value = item.textContent;
                        suggestionsContainer.classList.remove('show');
                        updateSubmitButton();
                    });

                    item.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            item.click();
                        }
                    });
                });
            });

            destinationInput.addEventListener('keydown', (e) => {
                if (!suggestionsContainer.classList.contains('show')) return;
                
                const items = Array.from(suggestionsContainer.querySelectorAll('.nb-suggestion-item'));
                if (items.length === 0) return;

                let currentIndex = state.activeSuggestion !== null ? state.activeSuggestion : -1;

                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    currentIndex = (currentIndex + 1) % items.length;
                    items[currentIndex].focus();
                    items[currentIndex].classList.add('nb-highlighted');
                    items.forEach((item, i) => {
                        if (i !== currentIndex) item.classList.remove('nb-highlighted');
                    });
                    state.activeSuggestion = currentIndex;
                } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    currentIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
                    items[currentIndex].focus();
                    items[currentIndex].classList.add('nb-highlighted');
                    items.forEach((item, i) => {
                        if (i !== currentIndex) item.classList.remove('nb-highlighted');
                    });
                    state.activeSuggestion = currentIndex;
                } else if (e.key === 'Escape') {
                    suggestionsContainer.classList.remove('show');
                    state.suggestionList = null;
                }
            });

            // Close on blur (with delay to allow clicks)
            destinationInput.addEventListener('blur', () => {
                setTimeout(() => {
                    suggestionsContainer.classList.remove('show');
                }, 200);
            });
        }

        // Close suggestions on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nb-suggestions') && !e.target.closest('.nb-input')) {
                closeAllSuggestions();
            }
        });
    }

    // ===== VALIDATION =====
    
    function validateForm() {
        let isValid = true;

        const name = document.getElementById('nb-name');
        const phone = document.getElementById('nb-phone');
        const pickup = document.getElementById('nb-pickup');
        const destination = document.getElementById('nb-destination');
        const pickupDate = document.getElementById('nb-pickup-date');
        const returnDate = document.getElementById('nb-return-date');

        // Name validation
        if (!name.value.trim()) {
            setError(name, 'Name is required');
            isValid = false;
        } else {
            setError(name, '');
        }

        // Phone validation
        const phoneClean = phone.value.replace(/\D/g, '');
        if (!phoneClean || phoneClean.length < 10) {
            setError(phone, 'Enter a valid phone number');
            isValid = false;
        } else {
            setError(phone, '');
        }

        // Pickup validation
        if (!pickup.value.trim()) {
            setError(pickup, 'Pickup location is required');
            isValid = false;
        } else {
            setError(pickup, '');
        }

        // Destination validation
        if (!destination.value.trim()) {
            setError(destination, 'Destination is required');
            isValid = false;
        } else {
            setError(destination, '');
        }

        // Pickup Date validation
        if (!pickupDate.value) {
            setError(pickupDate, 'Pickup date is required');
            isValid = false;
        } else {
            const selectedDate = new Date(pickupDate.value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (selectedDate < today) {
                setError(pickupDate, 'Pickup date cannot be in the past');
                isValid = false;
            } else {
                setError(pickupDate, '');
            }
        }

        // Return Date validation
        if (!returnDate.value) {
            setError(returnDate, 'Return date is required');
            isValid = false;
        } else {
            const returnDateObj = new Date(returnDate.value);
            const pickupDateObj = pickupDate.value ? new Date(pickupDate.value) : null;
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (returnDateObj < today) {
                setError(returnDate, 'Return date cannot be in the past');
                isValid = false;
            } else if (pickupDateObj && returnDateObj < pickupDateObj) {
                setError(returnDate, 'Return date must be after pickup date');
                isValid = false;
            } else {
                setError(returnDate, '');
            }
        }

        // Vehicle model validation
        if (!state.selectedModel) {
            // Show error in first field
            setError(name, 'Please select a vehicle model');
            isValid = false;
        }

        return isValid;
    }

    // ===== FORM SUBMISSION =====
    
    function initFormSubmission() {
        if (!form || !submitBtn) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Clear previous vehicle model error
            const nameInput = document.getElementById('nb-name');
            const nameError = nameInput.closest('.nb-field-group')?.querySelector('.nb-error-slot');
            if (nameError && nameError.textContent === 'Please select a vehicle model') {
                setError(nameInput, '');
            }

            if (!validateForm()) {
                // Focus first invalid field
                const firstInvalid = form.querySelector('[aria-invalid="true"]');
                if (firstInvalid) firstInvalid.focus();
                return;
            }

            // Show loader
            const loader = submitBtn.querySelector('.nb-loader');
            const btnText = submitBtn.querySelector('.nb-btn-text');
            if (loader) loader.classList.add('show');
            if (btnText) btnText.style.display = 'none';
            submitBtn.disabled = true;

            // Prepare data for sendToWhatsapp compatibility
            prepareFormData();

            // Call sendToWhatsapp after short delay
            setTimeout(() => {
                try {
                    if (typeof sendToWhatsapp === 'function') {
                        const syntheticEvent = {
                            preventDefault: () => {},
                            currentTarget: form
                        };
                        sendToWhatsapp(syntheticEvent);
                    } else {
                        // Fallback: Direct WhatsApp redirect
                        redirectToWhatsApp();
                    }
                } catch (err) {
                    console.error('Error submitting form:', err);
                    redirectToWhatsApp();
                } finally {
                    // Reset button (WA will open new tab)
                    if (loader) loader.classList.remove('show');
                    if (btnText) btnText.style.display = '';
                    submitBtn.disabled = false;
                }
            }, 500);
        });
    }

    function prepareFormData() {
        // Map form fields to sendToWhatsapp expected IDs
        const name = document.getElementById('nb-name').value;
        const phone = document.getElementById('nb-phone').value;
        const pickup = document.getElementById('nb-pickup').value;
        const destination = document.getElementById('nb-destination').value;
        const pickupDate = document.getElementById('nb-pickup-date').value;
        const returnDate = document.getElementById('nb-return-date').value;

        // Create hidden inputs for sendToWhatsapp compatibility
        let autocomplete = document.getElementById('autocomplete');
        if (!autocomplete) {
            autocomplete = document.createElement('input');
            autocomplete.type = 'hidden';
            autocomplete.id = 'autocomplete';
            document.body.appendChild(autocomplete);
        }
        autocomplete.value = pickup;

        let autocomplete2 = document.getElementById('autocomplete2');
        if (!autocomplete2) {
            autocomplete2 = document.createElement('input');
            autocomplete2.type = 'hidden';
            autocomplete2.id = 'autocomplete2';
            document.body.appendChild(autocomplete2);
        }
        autocomplete2.value = destination;

        let phoneNumberInput = document.getElementById('phone-number');
        if (!phoneNumberInput) {
            phoneNumberInput = document.createElement('input');
            phoneNumberInput.type = 'hidden';
            phoneNumberInput.id = 'phone-number';
            document.body.appendChild(phoneNumberInput);
        }
        phoneNumberInput.value = phone;

        let datePicker = document.getElementById('date-picker');
        if (!datePicker) {
            datePicker = document.createElement('input');
            datePicker.type = 'hidden';
            datePicker.id = 'date-picker';
            document.body.appendChild(datePicker);
        }
        datePicker.value = pickupDate;


        // Vehicle type radio (for sendToWhatsapp)
        let carTypeRadio = document.querySelector('input[name="Car_Type"]:checked');
        if (!carTypeRadio) {
            carTypeRadio = document.createElement('input');
            carTypeRadio.type = 'radio';
            carTypeRadio.name = 'Car_Type';
            carTypeRadio.value = state.selectedModel || 'Sedan';
            carTypeRadio.checked = true;
            document.body.appendChild(carTypeRadio);
        } else {
            carTypeRadio.value = state.selectedModel || 'Sedan';
            carTypeRadio.checked = true;
        }

        // Return date/time (defaults)
        let returnDatePicker = document.getElementById('date-picker-2');
        if (!returnDatePicker) {
            returnDatePicker = document.createElement('input');
            returnDatePicker.type = 'hidden';
            returnDatePicker.id = 'date-picker-2';
            document.body.appendChild(returnDatePicker);
        }
        returnDatePicker.value = returnDate;

    }

    function redirectToWhatsApp() {
        const number = "+917092666644";
        const name = document.getElementById('nb-name').value;
        const phone = document.getElementById('nb-phone').value;
        const pickup = document.getElementById('nb-pickup').value;
        const destination = document.getElementById('nb-destination').value;
        const pickupDate = document.getElementById('nb-pickup-date').value;
        const returnDate = document.getElementById('nb-return-date').value;
        const vehicle = state.selectedModel || 'Sedan';

        const message = `*ENQUIRE FROM ABz WEBSITE*\n\n` +
            `*Name:* ${name}\n` +
            `*Vehicle Type:* ${vehicle}\n\n` +
            `*Pickup Location:* ${pickup}\n` +
            `*Destination:* ${destination}\n\n` +
            `*Phone Number:* ${phone}\n\n` +
            `*Pickup Date:* ${pickupDate}\n` +
            `*Return Date:* ${returnDate}\n\n` +
            `_Powered by ABz Travels_`;

        const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    }

    // ===== REAL-TIME VALIDATION =====
    
    function initRealTimeValidation() {
        const inputs = form.querySelectorAll('.nb-input');
        inputs.forEach(input => {
            // Skip date inputs for input event (they handle their own events)
            if (input.type === 'date') {
                input.addEventListener('change', () => {
                    setError(input, '');
                    updateSubmitButton();
                });
            } else {
                input.addEventListener('input', () => {
                    setError(input, '');
                    updateSubmitButton();
                });
            }
        });
    }

    // ===== MOBILE MODAL =====
    
    function initMobileModal() {
        if (!mobileModal) return;

        const backdrop = mobileModal.querySelector('.nb-modal-backdrop');
        const closeBtn = mobileModal.querySelector('.nb-modal-close');

        function openModal() {
            mobileModal.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
            
            // Clone form into modal
            const modalBody = mobileModal.querySelector('.nb-modal-body');
            if (modalBody) {
                const formClone = form.cloneNode(true);
                modalBody.innerHTML = '';
                modalBody.appendChild(formClone);
                // Re-initialize form in modal (simplified - in production, re-run init)
            }
        }

        function closeModal() {
            mobileModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
        }

        if (backdrop) backdrop.addEventListener('click', closeModal);
        if (closeBtn) closeBtn.addEventListener('click', closeModal);

        // Open modal on mobile when form is focused (but not for date inputs)
        if (window.innerWidth <= 768) {
            form.addEventListener('focusin', (e) => {
                // Don't open modal for date inputs - let calendar open instead
                if (e.target && e.target.type === 'date') {
                    return;
                }
                openModal();
            }, true);
        }
    }

    // ===== DATE PICKER INITIALIZATION =====
    
    function initDatePickers() {
        const pickupDateInput = document.getElementById('nb-pickup-date');
        const returnDateInput = document.getElementById('nb-return-date');
        
        if (!pickupDateInput || !returnDateInput) return;
        
        // Get calendar icons
        const pickupDateIcon = pickupDateInput.parentElement?.querySelector('.nb-date-icon');
        const returnDateIcon = returnDateInput.parentElement?.querySelector('.nb-date-icon');
        
        // Set minimum date to today for pickup date
        const today = new Date().toISOString().split('T')[0];
        pickupDateInput.setAttribute('min', today);
        
        // Set minimum date for return date (initially today, will update when pickup date changes)
        returnDateInput.setAttribute('min', today);
        
        // Ensure date inputs are not disabled and are clickable
        pickupDateInput.removeAttribute('disabled');
        returnDateInput.removeAttribute('disabled');
        pickupDateInput.removeAttribute('readonly');
        returnDateInput.removeAttribute('readonly');
        pickupDateInput.style.pointerEvents = 'auto';
        returnDateInput.style.pointerEvents = 'auto';
        pickupDateInput.style.cursor = 'pointer';
        returnDateInput.style.cursor = 'pointer';
        
        // Helper function to open date picker
        function openDatePicker(input) {
            // Remove readonly if present
            input.removeAttribute('readonly');
            
            // Try modern showPicker() API (Chrome, Edge, Safari 16+)
            if (input.showPicker && typeof input.showPicker === 'function') {
                setTimeout(() => {
                    try {
                        input.showPicker();
                    } catch (err) {
                        // If showPicker fails, focus the input to trigger native picker
                        input.focus();
                    }
                }, 10);
            } else {
                // Fallback: focus the input to trigger native picker
                input.focus();
            }
        }
        
        // Setup date picker handlers for pickup date input
        pickupDateInput.addEventListener('click', function(e) {
            openDatePicker(this);
        }, false);
        
        pickupDateInput.addEventListener('focus', function(e) {
            openDatePicker(this);
        }, false);
        
        pickupDateInput.addEventListener('touchend', function(e) {
            e.preventDefault();
            openDatePicker(this);
        }, { passive: false });
        
        // Setup date picker handlers for return date input
        returnDateInput.addEventListener('click', function(e) {
            openDatePicker(this);
        }, false);
        
        returnDateInput.addEventListener('focus', function(e) {
            openDatePicker(this);
        }, false);
        
        returnDateInput.addEventListener('touchend', function(e) {
            e.preventDefault();
            openDatePicker(this);
        }, { passive: false });
        
        // Make calendar icons clickable for pickup date
        if (pickupDateIcon) {
            // Use mousedown to ensure it fires before any other handlers
            pickupDateIcon.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(pickupDateInput);
            }, true); // Use capture phase
            
            pickupDateIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(pickupDateInput);
            }, true); // Use capture phase
            
            // Touch events for mobile
            pickupDateIcon.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(pickupDateInput);
            }, { passive: false, capture: true });
            
            // Keyboard support for icon
            pickupDateIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    openDatePicker(pickupDateInput);
                }
            }, false);
            
            // Ensure icon is always clickable
            pickupDateIcon.style.pointerEvents = 'auto';
            pickupDateIcon.style.zIndex = '10';
        }
        
        // Make calendar icons clickable for return date
        if (returnDateIcon) {
            // Use mousedown to ensure it fires before any other handlers
            returnDateIcon.addEventListener('mousedown', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(returnDateInput);
            }, true); // Use capture phase
            
            returnDateIcon.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(returnDateInput);
            }, true); // Use capture phase
            
            // Touch events for mobile
            returnDateIcon.addEventListener('touchend', function(e) {
                e.preventDefault();
                e.stopPropagation();
                openDatePicker(returnDateInput);
            }, { passive: false, capture: true });
            
            // Keyboard support for icon
            returnDateIcon.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    e.stopPropagation();
                    openDatePicker(returnDateInput);
                }
            }, false);
            
            // Ensure icon is always clickable
            returnDateIcon.style.pointerEvents = 'auto';
            returnDateIcon.style.zIndex = '10';
        }
        
        // Update return date min when pickup date changes
        pickupDateInput.addEventListener('change', () => {
            const pickupDateValue = pickupDateInput.value;
            if (pickupDateValue) {
                // Set return date min to pickup date (or today if pickup is in the past)
                const pickupDate = new Date(pickupDateValue);
                const todayDate = new Date();
                todayDate.setHours(0, 0, 0, 0);
                
                // Use pickup date if it's today or later, otherwise use today
                const minDate = pickupDate >= todayDate ? pickupDateValue : today;
                returnDateInput.setAttribute('min', minDate);
                
                // If return date is before the new min, clear it
                if (returnDateInput.value && returnDateInput.value < minDate) {
                    returnDateInput.value = '';
                    updateSubmitButton();
                }
            } else {
                // If pickup date is cleared, reset return date min to today
                returnDateInput.setAttribute('min', today);
            }
            updateSubmitButton();
        });
    }

    // ===== INITIALIZATION =====
    
    function init() {
        initCategoryDropdowns();
        initPredictiveSuggestions();
        initDatePickers();
        initRealTimeValidation();
        initFormSubmission();
        initMobileModal();
        updateSubmitButton();

        // Update submit button on any change
        form.addEventListener('input', updateSubmitButton);
        form.addEventListener('change', updateSubmitButton);
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

