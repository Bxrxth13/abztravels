/**
 * Playwright Configuration
 * Run tests with: npx playwright test
 */

module.exports = {
    testDir: './hamburger-tests',
    timeout: 30000,
    retries: 1,
    use: {
        baseURL: 'http://localhost:5501',
        viewport: { width: 1280, height: 720 },
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    projects: [
        {
            name: 'Mobile Chrome',
            use: {
                ...require('@playwright/test').devices['iPhone 12'],
            },
        },
        {
            name: 'Desktop Chrome',
            use: {
                viewport: { width: 1366, height: 768 },
            },
        },
    ],
    webServer: {
        command: 'python -m http.server 5501',
        port: 5501,
        reuseExistingServer: true,
    },
};

