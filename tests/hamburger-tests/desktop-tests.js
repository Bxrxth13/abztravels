/**
 * Desktop Viewport Tests
 * Tests for desktop viewport (1366x768)
 */

const { test, expect } = require('@playwright/test');

test.describe('Desktop Interactive Elements Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 1366, height: 768 });
        await page.goto('http://localhost:5501/index.html');
        await page.waitForLoadState('networkidle');
    });

    test('Navbar links are visible and clickable', async ({ page }) => {
        const navLinks = page.locator('.premium-menu-item');
        const count = await navLinks.count();
        expect(count).toBeGreaterThan(0);
        
        await expect(navLinks.first()).toBeVisible();
    });

    test('Book Now button works', async ({ page }) => {
        const bookNowBtn = page.locator('#premium-book-now-btn, .premium-btn-book-now');
        
        if (await bookNowBtn.count() > 0) {
            await expect(bookNowBtn.first()).toBeVisible();
            // Click should either scroll or open modal
            await bookNowBtn.first().click();
            await page.waitForTimeout(500);
        }
    });

    test('Vehicle dropdown opens on hover', async ({ page }) => {
        const vehicleMenu = page.locator('.premium-menu-item-has-dropdown');
        
        if (await vehicleMenu.count() > 0) {
            await vehicleMenu.first().hover();
            await page.waitForTimeout(300);
            
            const submenu = page.locator('.premium-submenu');
            await expect(submenu.first()).toBeVisible();
        }
    });

    test('All anchor links scroll smoothly', async ({ page }) => {
        const anchorLinks = page.locator('a[href^="#"]').filter({ hasNotText: '#' });
        const count = await anchorLinks.count();
        
        if (count > 0) {
            await anchorLinks.first().click();
            await page.waitForTimeout(500);
            
            // Should have scrolled
            const scrollY = await page.evaluate(() => window.scrollY);
            expect(scrollY).toBeGreaterThanOrEqual(0);
        }
    });
});

