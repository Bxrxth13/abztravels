/**
 * HAMBURGER MENU & INTERACTIVE ELEMENTS FIXES
 * Comprehensive fixes for mobile menu and all interactive controls
 * AUTOBOTZ TOURS & TRAVELS
 */
(function() {
    'use strict';

    // ===== MOBILE MENU FIXES =====
    function initHamburgerMenu() {
        const mobileToggle = document.getElementById('premium-mobile-toggle');
        const mobilePanel = document.getElementById('premium-mobile-panel');
        
        if (!mobileToggle || !mobilePanel) {
            return;
        }

        // Focus trap management
        let focusableElements = [];
        let firstFocusable, lastFocusable;

        function updateFocusableElements() {
            const focusableSelectors = [
                'a[href]',
                'button:not([disabled])',
                'input:not([disabled])',
                'select:not([disabled])',
                'textarea:not([disabled])',
                '[tabindex]:not([tabindex="-1"])'
            ].join(', ');
            
            focusableElements = Array.from(mobilePanel.querySelectorAll(focusableSelectors))
                .filter(el => {
                    const style = window.getComputedStyle(el);
                    return style.display !== 'none' && style.visibility !== 'hidden';
                });
            
            firstFocusable = focusableElements[0];
            lastFocusable = focusableElements[focusableElements.length - 1];
        }

        function trapFocus(e) {
            if (!mobilePanel.classList.contains('active')) return;
            
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        e.preventDefault();
                        lastFocusable?.focus();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        e.preventDefault();
                        firstFocusable?.focus();
                    }
                }
            }
        }

        function openMenu() {
            // Force panel visibility first
            mobilePanel.setAttribute('aria-hidden', 'false');
            mobilePanel.classList.add('active');
            mobilePanel.style.display = 'block';
            mobilePanel.style.visibility = 'visible';
            mobilePanel.style.opacity = '1';
            mobilePanel.style.pointerEvents = 'all';
            mobilePanel.style.zIndex = '9999';
            
            mobileToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');
            
            // Force menu visibility and transform
            const mobileMenu = mobilePanel.querySelector('.premium-mobile-menu');
            if (mobileMenu) {
                mobileMenu.style.transform = 'translateX(0)';
                mobileMenu.style.display = 'block';
                mobileMenu.style.visibility = 'visible';
                mobileMenu.style.opacity = '1';
                mobileMenu.style.zIndex = '10000';
                // Ensure menu container has proper height for all items
                const headerHeight = document.querySelector('.premium-header')?.offsetHeight || 70;
                mobileMenu.style.setProperty('max-height', '100vh', 'important');
                mobileMenu.style.setProperty('height', '100vh', 'important');
                mobileMenu.style.setProperty('overflow-y', 'auto', 'important');
                mobileMenu.style.setProperty('overflow-x', 'hidden', 'important');
                mobileMenu.style.setProperty('box-sizing', 'border-box', 'important');
                // Force container to show all content
                mobileMenu.style.setProperty('min-height', 'auto', 'important');
                mobileMenu.style.setProperty('padding-top', '5rem', 'important');
                mobileMenu.style.setProperty('padding-bottom', '2rem', 'important');
            }
            
            // CRITICAL: Force a reflow to ensure styles are applied
            if (mobileMenu) {
                mobileMenu.offsetHeight; // Trigger reflow
            }
            
            // ABSOLUTE CRITICAL FIX: Ensure menu container can show all items
            if (mobileMenu) {
                // Remove any height constraints that might be hiding items
                mobileMenu.style.removeProperty('max-height');
                mobileMenu.style.setProperty('height', '100vh', 'important');
                mobileMenu.style.setProperty('min-height', '100vh', 'important');
                mobileMenu.style.setProperty('overflow-y', 'auto', 'important');
                mobileMenu.style.setProperty('overflow-x', 'hidden', 'important');
                mobileMenu.style.setProperty('-webkit-overflow-scrolling', 'touch', 'important');
            }
            
            // Force list items visibility FIRST (parent elements) - CRITICAL
            // Use setProperty with !important to override any CSS
            const listItems = mobilePanel.querySelectorAll('.premium-mobile-menu > li');
            console.log('🔍 Found list items:', listItems.length); // Debug
            console.log('📋 List items:', Array.from(listItems).map((li, i) => ({
                index: i,
                text: li.textContent.trim().substring(0, 30),
                display: window.getComputedStyle(li).display,
                visibility: window.getComputedStyle(li).visibility,
                opacity: window.getComputedStyle(li).opacity
            })));
            
            listItems.forEach((li, index) => {
                console.log('✅ Processing list item', index, li.textContent.trim().substring(0, 30)); // Debug
                // Set inline styles with !important
                li.style.setProperty('display', 'block', 'important');
                li.style.setProperty('visibility', 'visible', 'important');
                li.style.setProperty('opacity', '1', 'important');
                li.style.setProperty('list-style', 'none', 'important');
                li.style.setProperty('margin', '0', 'important');
                li.style.setProperty('padding', '0', 'important');
                li.style.setProperty('height', 'auto', 'important');
                li.style.setProperty('min-height', 'auto', 'important');
                li.style.setProperty('max-height', 'none', 'important');
                li.style.setProperty('overflow', 'visible', 'important');
                li.style.setProperty('position', 'relative', 'important');
                li.style.setProperty('transform', 'none', 'important');
                li.style.setProperty('clip', 'auto', 'important');
                li.style.setProperty('clip-path', 'none', 'important');
            });
            
            // Force menu items visibility - ALL items, not just first
            const menuItems = mobilePanel.querySelectorAll('.premium-mobile-menu-item');
            console.log('Found menu items:', menuItems.length); // Debug
            menuItems.forEach((item, index) => {
                console.log('Processing menu item', index, item.textContent.trim(), item); // Debug
                item.style.setProperty('display', 'flex', 'important');
                item.style.setProperty('visibility', 'visible', 'important');
                item.style.setProperty('opacity', '1', 'important');
                item.style.setProperty('width', '100%', 'important');
                item.style.setProperty('min-height', '48px', 'important');
                item.style.setProperty('height', 'auto', 'important');
                item.style.setProperty('max-height', 'none', 'important');
                item.style.setProperty('overflow', 'visible', 'important');
                item.style.setProperty('position', 'relative', 'important');
                item.style.setProperty('transform', 'none', 'important');
                item.style.setProperty('clip', 'auto', 'important');
                item.style.setProperty('clip-path', 'none', 'important');
                // Force computed style refresh
                item.offsetHeight;
            });
            
            // Force dropdown container visibility
            const dropdownContainers = mobilePanel.querySelectorAll('.premium-mobile-menu-item-has-dropdown');
            dropdownContainers.forEach(container => {
                container.style.setProperty('display', 'block', 'important');
                container.style.setProperty('visibility', 'visible', 'important');
                container.style.setProperty('opacity', '1', 'important');
            });
            
            // Force submenu visibility
            const submenus = mobilePanel.querySelectorAll('.premium-mobile-submenu');
            submenus.forEach(submenu => {
                submenu.style.setProperty('display', 'block', 'important');
                submenu.style.setProperty('visibility', 'visible', 'important');
                submenu.style.setProperty('opacity', '1', 'important');
            });
            
            // Force submenu items visibility
            const submenuItems = mobilePanel.querySelectorAll('.premium-mobile-submenu-item');
            submenuItems.forEach(item => {
                item.style.setProperty('display', 'block', 'important');
                item.style.setProperty('visibility', 'visible', 'important');
                item.style.setProperty('opacity', '1', 'important');
            });
            
            // Force submenu list items visibility
            const submenuListItems = mobilePanel.querySelectorAll('.premium-mobile-submenu > li');
            submenuListItems.forEach(li => {
                li.style.setProperty('display', 'block', 'important');
                li.style.setProperty('visibility', 'visible', 'important');
                li.style.setProperty('opacity', '1', 'important');
            });
            
            // FINAL CHECK: Log the computed styles after all forcing
            setTimeout(() => {
                console.log('🎯 FINAL CHECK - After forcing all styles:');
                const finalCheck = mobilePanel.querySelectorAll('.premium-mobile-menu > li');
                finalCheck.forEach((li, i) => {
                    const computed = window.getComputedStyle(li);
                    console.log(`Item ${i}:`, {
                        text: li.textContent.trim().substring(0, 30),
                        display: computed.display,
                        visibility: computed.visibility,
                        opacity: computed.opacity,
                        height: computed.height,
                        position: computed.position
                    });
                });
                console.log('📐 Menu container height:', mobileMenu ? mobileMenu.scrollHeight : 'N/A');
                console.log('👁️ Menu container visible height:', mobileMenu ? mobileMenu.clientHeight : 'N/A');
            }, 100);
            
            // Update focusable elements and focus first item
            updateFocusableElements();
            setTimeout(() => {
                if (firstFocusable) {
                    firstFocusable.focus();
                }
            }, 100);
            
            // Add focus trap
            document.addEventListener('keydown', trapFocus);
        }

        function closeMenu() {
            mobilePanel.setAttribute('aria-hidden', 'true');
            mobilePanel.classList.remove('active');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            document.body.classList.remove('menu-open');
            
            // Reset panel styles (allow CSS transitions to work)
            mobilePanel.style.display = '';
            mobilePanel.style.visibility = '';
            mobilePanel.style.opacity = '';
            mobilePanel.style.pointerEvents = '';
            mobilePanel.style.zIndex = '';
            
            // Reset menu transform
            const mobileMenu = mobilePanel.querySelector('.premium-mobile-menu');
            if (mobileMenu) {
                mobileMenu.style.transform = 'translateX(100%)';
                mobileMenu.style.display = '';
                mobileMenu.style.visibility = '';
                mobileMenu.style.opacity = '';
                mobileMenu.style.zIndex = '';
            }
            
            // Remove focus trap
            document.removeEventListener('keydown', trapFocus);
            
            // Return focus to toggle button
            setTimeout(() => {
                mobileToggle.focus();
            }, 100);
            
            // Close all dropdowns
            const dropdowns = mobilePanel.querySelectorAll('.premium-mobile-menu-item-has-dropdown');
            dropdowns.forEach(dropdown => {
                dropdown.setAttribute('aria-expanded', 'false');
                const menuItem = dropdown.querySelector('.premium-mobile-menu-item');
                if (menuItem) {
                    menuItem.setAttribute('aria-expanded', 'false');
                }
            });
        }

        // Toggle menu
        function handleToggle(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isOpen = mobilePanel.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        }

        // Attach toggle handlers
        mobileToggle.addEventListener('click', handleToggle);
        mobileToggle.addEventListener('touchend', handleToggle);

        // Close on backdrop click
        mobilePanel.addEventListener('click', (e) => {
            if (e.target === mobilePanel) {
                closeMenu();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mobilePanel.classList.contains('active')) {
                closeMenu();
            }
        });

        // Handle smooth scrolling for anchor links
        const menuLinks = mobilePanel.querySelectorAll('a[href^="#"]');
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && href !== '#' && href !== '#top') {
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId) || 
                                        document.querySelector(`[name="${targetId}"]`);
                    
                    if (targetElement) {
                        e.preventDefault();
                        closeMenu();
                        
                        // Smooth scroll after menu closes
                        setTimeout(() => {
                            targetElement.scrollIntoView({
                                behavior: 'smooth',
                                block: 'start'
                            });
                            
                            // Focus the target element if it's focusable
                            if (targetElement.tabIndex >= 0 || 
                                targetElement.tagName === 'A' || 
                                targetElement.tagName === 'BUTTON' ||
                                targetElement.tagName === 'INPUT') {
                                targetElement.focus();
                            }
                        }, 300);
                    }
                } else if (href === '#top') {
                    e.preventDefault();
                    closeMenu();
                    setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 300);
                }
            });
        });

        // Handle dropdown toggles
        const dropdownToggles = mobilePanel.querySelectorAll('.premium-mobile-menu-item-has-dropdown > .premium-mobile-menu-item');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const parent = toggle.parentElement;
                const isExpanded = parent.getAttribute('aria-expanded') === 'true';
                
                parent.setAttribute('aria-expanded', !isExpanded);
                toggle.setAttribute('aria-expanded', !isExpanded);
                
                // Update focusable elements after dropdown state changes
                updateFocusableElements();
            });
        });
    }

    // ===== ENSURE ALL BUTTONS WORK =====
    function initButtonHandlers() {
        // Use event delegation for dynamically created elements
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-action]');
            if (!target) return;

            const action = target.getAttribute('data-action');
            
            switch(action) {
                case 'book-now':
                    e.preventDefault();
                    const formSection = document.getElementById('new-booking-section') || 
                                      document.getElementById('premium-booking-form-section');
                    if (formSection) {
                        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        formSection.focus();
                    }
                    break;
                    
                case 'whatsapp':
                    if (typeof sendToWhatsapp === 'function') {
                        sendToWhatsapp(e);
                    }
                    break;
            }
        });

        // Ensure WhatsApp button works
        const whatsappButtons = document.querySelectorAll('[href*="wa.me"], [onclick*="whatsapp"], .whatsapp-btn');
        whatsappButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (typeof sendToWhatsapp === 'function') {
                    e.preventDefault();
                    sendToWhatsapp(e);
                }
            });
        });

        // Ensure all anchor links with # work smoothly
        document.addEventListener('click', (e) => {
            const link = e.target.closest('a[href^="#"]');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (href === '#' || !href) return;
            
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId) || 
                                document.querySelector(`[name="${targetId}"]`);
            
            if (targetElement && !link.hasAttribute('data-no-smooth')) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, true);
    }

    // ===== INITIALIZE =====
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initHamburgerMenu();
                initButtonHandlers();
            });
        } else {
            initHamburgerMenu();
            initButtonHandlers();
        }
    }

    init();
})();

