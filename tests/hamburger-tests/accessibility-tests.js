/**
 * Accessibility Tests
 * Tests for ARIA attributes, keyboard navigation, focus management
 */

const { test, expect } = require('@playwright/test');

test.describe('Accessibility Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5501/index.html');
        await page.waitForLoadState('networkidle');
    });

    test('Hamburger button has proper ARIA attributes', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        
        if (await hamburger.count() > 0) {
            await expect(hamburger).toHaveAttribute('aria-label');
            await expect(hamburger).toHaveAttribute('aria-expanded');
            await expect(hamburger).toHaveAttribute('aria-controls', 'premium-mobile-panel');
        }
    });

    test('Menu items have proper roles', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        const hamburger = page.locator('#premium-mobile-toggle');
        
        if (await hamburger.count() > 0) {
            await hamburger.click();
            await page.waitForTimeout(300);
            
            const menuItems = page.locator('.premium-mobile-menu-item[role="menuitem"]');
            const count = await menuItems.count();
            expect(count).toBeGreaterThan(0);
        }
    });

    test('Keyboard navigation works', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        const hamburger = page.locator('#premium-mobile-toggle');
        
        if (await hamburger.count() > 0) {
            await hamburger.focus();
            await page.keyboard.press('Enter');
            await page.waitForTimeout(300);
            
            const menuPanel = page.locator('#premium-mobile-panel');
            await expect(menuPanel).toHaveAttribute('aria-hidden', 'false');
        }
    });

    test('Focus is trapped in open menu', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        const hamburger = page.locator('#premium-mobile-toggle');
        
        if (await hamburger.count() > 0) {
            await hamburger.click();
            await page.waitForTimeout(300);
            
            // Tab multiple times - focus should stay within menu
            for (let i = 0; i < 5; i++) {
                await page.keyboard.press('Tab');
                await page.waitForTimeout(100);
                
                const activeElement = await page.evaluate(() => {
                    const el = document.activeElement;
                    return el ? el.closest('#premium-mobile-panel') !== null : false;
                });
                
                // Focus should be within menu panel
                expect(activeElement).toBeTruthy();
            }
        }
    });

    test('All interactive elements are keyboard accessible', async ({ page }) => {
        const interactiveElements = page.locator('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const count = await interactiveElements.count();
        
        for (let i = 0; i < Math.min(count, 10); i++) {
            const element = interactiveElements.nth(i);
            const tagName = await element.evaluate(el => el.tagName);
            const tabIndex = await element.getAttribute('tabindex');
            
            // Element should be focusable
            expect(['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA']).toContain(tagName);
        }
    });
});

