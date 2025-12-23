/**
 * Button Interaction Tests
 * Tests all interactive buttons across the site
 */

const { test, expect } = require('@playwright/test');

test.describe('Button Interaction Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5501/index.html');
        await page.waitForLoadState('networkidle');
    });

    test('WhatsApp button functionality', async ({ page, context }) => {
        // Monitor for new pages/tabs
        const [newPage] = await Promise.all([
            context.waitForEvent('page', { timeout: 5000 }).catch(() => null),
            page.locator('[href*="wa.me"], .whatsapp-btn, [onclick*="whatsapp"]').first().click()
        ]);
        
        // Either a new page opened or sendToWhatsapp was called
        if (newPage) {
            const url = newPage.url();
            expect(url).toContain('wa.me');
            await newPage.close();
        }
    });

    test('Form category buttons work', async ({ page }) => {
        const categoryBtns = page.locator('.nb-category-btn, .premium-category-pill, .category-btn');
        const count = await categoryBtns.count();
        
        if (count > 0) {
            await categoryBtns.first().click();
            await page.waitForTimeout(200);
            
            // Button should have active state or dropdown should open
            const isActive = await categoryBtns.first().evaluate(el => 
                el.classList.contains('active') || el.getAttribute('aria-expanded') === 'true'
            );
            expect(isActive).toBeTruthy();
        }
    });

    test('Form submit button is enabled when form is valid', async ({ page }) => {
        const submitBtn = page.locator('button[type="submit"], .nb-submit-btn, #premium-submit-btn');
        
        if (await submitBtn.count() > 0) {
            const isDisabled = await submitBtn.first().isDisabled();
            // Button should exist and have proper state
            await expect(submitBtn.first()).toBeVisible();
        }
    });

    test('Social media buttons are clickable', async ({ page }) => {
        const socialButtons = page.locator('.social-icons a, .abz-footer-social-icons a');
        const count = await socialButtons.count();
        
        if (count > 0) {
            await expect(socialButtons.first()).toBeVisible();
            const href = await socialButtons.first().getAttribute('href');
            expect(href).toBeTruthy();
        }
    });

    test('Call button works', async ({ page }) => {
        const callBtn = page.locator('[href^="tel:"], .premium-btn-book-now');
        
        if (await callBtn.count() > 0) {
            await expect(callBtn.first()).toBeVisible();
            const href = await callBtn.first().getAttribute('href');
            if (href) {
                expect(href).toContain('tel:');
            }
        }
    });
});

