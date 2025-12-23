/**
 * Mobile Hamburger Menu Tests
 * Tests for mobile viewport (iPhone 12 - 375x812)
 * Run with: npx playwright test mobile-menu-tests.js
 */

const { test, expect } = require('@playwright/test');

test.describe('Mobile Hamburger Menu Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 812 });
        await page.goto('http://localhost:5501/index.html');
        await page.waitForLoadState('networkidle');
    });

    test('Hamburger button is visible and clickable', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        await expect(hamburger).toBeVisible();
        await expect(hamburger).toHaveAttribute('aria-label', /toggle/i);
    });

    test('Click hamburger opens menu with correct aria state', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const menuPanel = page.locator('#premium-mobile-panel');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'false');
        await expect(hamburger).toHaveAttribute('aria-expanded', 'true');
        await expect(menuPanel).toHaveClass(/active/);
    });

    test('Menu items are visible when menu is open', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const menuItems = page.locator('.premium-mobile-menu-item');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        const count = await menuItems.count();
        expect(count).toBeGreaterThan(0);
        
        // Check first few items are visible
        await expect(menuItems.first()).toBeVisible();
        await expect(menuItems.nth(1)).toBeVisible();
    });

    test('Body scroll is disabled when menu is open', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        const bodyOverflow = await page.evaluate(() => {
            return window.getComputedStyle(document.body).overflow;
        });
        
        expect(bodyOverflow).toBe('hidden');
    });

    test('Focus trap works in menu', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        // Tab through menu items
        await page.keyboard.press('Tab');
        const focusedElement = await page.evaluate(() => document.activeElement.tagName);
        expect(['A', 'BUTTON']).toContain(focusedElement);
    });

    test('Escape key closes menu', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const menuPanel = page.locator('#premium-mobile-panel');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'false');
        
        await page.keyboard.press('Escape');
        await page.waitForTimeout(300);
        
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'true');
        await expect(hamburger).toHaveAttribute('aria-expanded', 'false');
    });

    test('Clicking backdrop closes menu', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const menuPanel = page.locator('#premium-mobile-panel');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        // Click on backdrop (panel itself, not menu)
        await menuPanel.click({ position: { x: 50, y: 50 } });
        await page.waitForTimeout(300);
        
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'true');
    });

    test('Clicking menu link scrolls to section and closes menu', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const menuPanel = page.locator('#premium-mobile-panel');
        const homeLink = page.locator('.premium-mobile-menu-item[href="#top"]');
        
        // Scroll down first
        await page.evaluate(() => window.scrollTo(0, 500));
        await page.waitForTimeout(200);
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        await homeLink.click();
        await page.waitForTimeout(500);
        
        // Menu should be closed
        await expect(menuPanel).toHaveAttribute('aria-hidden', 'true');
        
        // Page should scroll to top
        const scrollY = await page.evaluate(() => window.scrollY);
        expect(scrollY).toBeLessThan(100);
    });

    test('Vehicle dropdown expands/collapses', async ({ page }) => {
        const hamburger = page.locator('#premium-mobile-toggle');
        const vehicleLink = page.locator('.premium-mobile-menu-item-has-dropdown > .premium-mobile-menu-item');
        
        await hamburger.click();
        await page.waitForTimeout(300);
        
        await vehicleLink.click();
        await page.waitForTimeout(200);
        
        const isExpanded = await vehicleLink.getAttribute('aria-expanded');
        expect(isExpanded).toBe('true');
        
        // Submenu should be visible
        const submenu = page.locator('.premium-mobile-submenu');
        const submenuItems = await submenu.locator('.premium-mobile-submenu-item').count();
        expect(submenuItems).toBeGreaterThan(0);
    });
});

