(function () {
  'use strict';

  // Helper selectors
  const form = document.getElementById('single-booking-form');
  const categoryButtons = document.querySelectorAll('.category-btn');
  const categoryWrappers = document.querySelectorAll('.category-dropdown-wrapper');
  const modelButtonsSelector = '.compact-model-option';
  const selectedSummary = document.getElementById('selected-vehicle-summary');
  const selectedText = document.getElementById('selected-vehicle-text');
  const vehicleTypeInput = document.getElementById('vehicle_type');
  const submitBtn = document.getElementById('compact-submit');
  const loaderSpan = submitBtn ? submitBtn.querySelector('.compact-btn-loader') : null;

  // Early return if form doesn't exist
  if (!form) {
    console.warn('Compact booking form not found');
    return;
  }

  // Close all dropdowns utility
  function closeAllDropdowns() {
    categoryWrappers.forEach(wrapper => {
      const btn = wrapper.querySelector('.category-btn');
      const dropdown = wrapper.querySelector('.category-dropdown');
      if (dropdown) dropdown.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  }

  // Open a dropdown
  function openDropdown(wrapper) {
    closeAllDropdowns();
    const btn = wrapper.querySelector('.category-btn');
    const dropdown = wrapper.querySelector('.category-dropdown');
    if (!dropdown) return;
    dropdown.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    // focus first model
    const first = dropdown.querySelector('button');
    if (first) first.focus();
  }

  // Attach category buttons
  categoryWrappers.forEach(wrapper => {
    const btn = wrapper.querySelector('.category-btn');
    const dropdown = wrapper.querySelector('.category-dropdown');

    // Toggle click
    btn.addEventListener('click', (e) => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      } else {
        openDropdown(wrapper);
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrapper.contains(e.target)) {
        if (dropdown) dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      }
    });

    // Keyboard support: Enter toggles, Esc closes
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      } else if (ev.key === 'Escape') {
        const dd = wrapper.querySelector('.category-dropdown');
        if (dd) { dd.hidden = true; btn.setAttribute('aria-expanded', 'false'); }
      }
    });

    // Model selection inside each dropdown
    if (dropdown) {
      dropdown.addEventListener('click', (ev) => {
        const target = ev.target.closest('button');
        if (!target) return;
        const value = target.dataset.value;
        if (!value) return;
        // set hidden input and UI
        vehicleTypeInput.value = value;
        // mark selected
        dropdown.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
        target.classList.add('selected');
        // update summary
        if (selectedSummary) {
          selectedText.textContent = (btn.textContent || btn.innerText).trim().split('\n')[0] + ' • ' + value;
          selectedSummary.style.display = 'inline-flex';
        }
        // close dropdown
        dropdown.hidden = true;
        btn.setAttribute('aria-expanded', 'false');
      });

      // allow keyboard nav inside dropdown (basic)
      dropdown.addEventListener('keydown', (ev) => {
        const focusable = Array.from(dropdown.querySelectorAll('button'));
        const index = focusable.indexOf(document.activeElement);
        if (ev.key === 'ArrowDown') {
          ev.preventDefault();
          const next = focusable[index + 1] || focusable[0];
          next.focus();
        } else if (ev.key === 'ArrowUp') {
          ev.preventDefault();
          const prev = focusable[index - 1] || focusable[focusable.length - 1];
          prev.focus();
        } else if (ev.key === 'Escape') {
          dropdown.hidden = true;
          btn.setAttribute('aria-expanded', 'false');
          btn.focus();
        }
      });
    }
  });


  // Validation helpers: write errors ONLY into .compact-error inside the field-group
  function setFieldError(inputEl, msg) {
    const group = inputEl.closest('.compact-field-group') || inputEl.parentElement;
    const errorEl = group.querySelector('.compact-error');
    if (errorEl) {
      if (msg && msg.length) {
        errorEl.textContent = msg;
        errorEl.classList.add('show');
        // for accessibility, focus the input
        inputEl.setAttribute('aria-invalid', 'true');
      } else {
        errorEl.textContent = '';
        errorEl.classList.remove('show');
        inputEl.removeAttribute('aria-invalid');
      }
    }
  }

  function validateForm() {
    let valid = true;

    // pickup
    const pickup = document.getElementById('pickup-location');
    if (!pickup.value.trim()) { setFieldError(pickup, 'Pickup location required'); valid = false; } else setFieldError(pickup, '');

    // date/time
    const date = document.getElementById('date-picker');
    const time = document.getElementById('pickup-time');
    if (!date.value) { setFieldError(date, 'Select a date'); valid = false; } else setFieldError(date, '');
    if (!time.value) { setFieldError(time, 'Select time'); valid = false; } else setFieldError(time, '');

    // phone
    const phone = document.getElementById('phone-number');
    const cleaned = phone.value.replace(/\D/g, '');
    if (!cleaned || cleaned.length < 7) { setFieldError(phone, 'Enter valid phone'); valid = false; } else setFieldError(phone, '');

    // vehicle type
    if (!vehicleTypeInput.value) {
      // show a small global error in the first category field's compact-error (non-intrusive)
      const firstGroup = document.querySelector('.compact-field-group');
      if (firstGroup) {
        const err = firstGroup.querySelector('.compact-error');
        if (err) {
          err.textContent = 'Choose a vehicle model';
          err.classList.add('show');
        }
      }
      valid = false;
    } else {
      // clear category-level errors
      document.querySelectorAll('.compact-field-group .compact-error').forEach(e => {
        if (e.textContent === 'Choose a vehicle model') { e.textContent = ''; e.classList.remove('show'); }
      });
    }


    return valid;
  }

  // Show loader + call the existing sendToWhatsapp after small delay (so loader shows)
  if (submitBtn) {
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();

      // Remove previous global errors in reserved slots
      document.querySelectorAll('.compact-error').forEach(e => { if (e.textContent === 'Choose a vehicle model') { e.textContent=''; e.classList.remove('show'); }});

      if (!validateForm()) {
        // focus first invalid input
        const firstInvalid = form.querySelector('[aria-invalid="true"], .compact-error.show');
        if (firstInvalid) {
          const input = firstInvalid.closest('.compact-field-group')?.querySelector('.compact-input') || firstInvalid;
          if (input && typeof input.focus === 'function') input.focus();
        }
        return;
      }

      // disable submit and show loader
      submitBtn.disabled = true;
      if (loaderSpan) loaderSpan.style.display = 'inline-flex';

      // small UX delay so loader is visible
      setTimeout(() => {
        // call the existing whatsapp flow - pass the event (the sendToWhatsapp function expects event)
        try {
          // create a synthetic event that mirrors the original if needed
          if (typeof sendToWhatsapp === 'function') {
            // The existing function expects an event with preventDefault - we can craft a simple object
            const fakeEvent = { preventDefault: () => {}, currentTarget: form };
            sendToWhatsapp(fakeEvent);
          } else {
            console.warn('sendToWhatsapp not found — ensure whatsapp.js is loaded.');
          }
        } catch (err) {
          console.error(err);
        } finally {
          // reset loader (the WA redirect will open a tab; resets here in case)
          if (loaderSpan) loaderSpan.style.display = 'none';
          submitBtn.disabled = false;
        }
      }, 550);
    });
  }

  // Ensure inputs remove errors on input
  document.querySelectorAll('.compact-input').forEach(input => {
    input.addEventListener('input', () => { setFieldError(input, ''); });
  });

  // Accessibility: close dropdowns with global Esc
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeAllDropdowns();
  });

  // Mobile: clone form into modal when screen narrow and Book Now pressed (improve experience)
  function openMobileModal() {
    const modal = document.getElementById('compact-mobile-modal');
    if (!modal) return;
    const container = modal.querySelector('.compact-modal-body');
    if (!container) return;

    container.innerHTML = '';
    // deep clone form (events not cloned)
    const clone = form.cloneNode(true);
    container.appendChild(clone);
    // copy vehicle_type value
    const cloneVehicleType = clone.querySelector('#vehicle_type');
    if (cloneVehicleType && vehicleTypeInput) {
      cloneVehicleType.value = vehicleTypeInput.value;
    }
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    // attach close handler: clicking backdrop or close button
    const closeBtn = modal.querySelector('.compact-modal-close');
    const backdrop = modal.querySelector('.compact-modal-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeMobileModal);
    if (backdrop) backdrop.addEventListener('click', closeMobileModal);
  }

  function closeMobileModal() {
    const modal = document.getElementById('compact-mobile-modal');
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Expose openMobileModal to Book Now CTA if used elsewhere
  window.openCompactBookingModal = openMobileModal;

  // Init: pick a default category and model (first ones) to reduce friction
  (function initDefault() {
    const firstModel = document.querySelector('.category-dropdown button');
    if (firstModel && vehicleTypeInput) {
      firstModel.click(); // will select and set vehicle_type via click handler above
      // if not, clear it
    }
  })();

})();
