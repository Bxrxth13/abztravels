/**
 * Test Runner Script
 * Executes all tests and generates report
 * Run with: node tests/run-tests.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting test execution...\n');

const testResults = {
    passed: 0,
    failed: 0,
    total: 0,
    failures: []
};

try {
    // Run Playwright tests
    console.log('Running Playwright tests...');
    const output = execSync('npx playwright test --reporter=json', {
        cwd: __dirname,
        encoding: 'utf8',
        stdio: 'pipe'
    });
    
    const results = JSON.parse(output);
    
    results.forEach(result => {
        result.specs.forEach(spec => {
            spec.tests.forEach(test => {
                testResults.total++;
                if (test.results[0].status === 'passed') {
                    testResults.passed++;
                } else {
                    testResults.failed++;
                    testResults.failures.push({
                        title: test.title,
                        file: spec.file,
                        error: test.results[0].error?.message || 'Unknown error'
                    });
                }
            });
        });
    });
    
    console.log(`✅ Tests passed: ${testResults.passed}`);
    console.log(`❌ Tests failed: ${testResults.failed}`);
    
} catch (error) {
    console.error('Error running tests:', error.message);
    testResults.failed++;
}

// Generate report
const reportPath = path.join(__dirname, 'report', 'summary.md');
const reportContent = generateReport(testResults);
fs.writeFileSync(reportPath, reportContent);

console.log(`\n📊 Test report generated: ${reportPath}`);

function generateReport(results) {
    return `# Test Execution Report
Generated: ${new Date().toISOString()}

## Summary
- **Total Tests**: ${results.total}
- **Passed**: ${results.passed} ✅
- **Failed**: ${results.failed} ${results.failed > 0 ? '❌' : ''}

## Test Results

${results.failures.length > 0 ? '### Failures\n' + results.failures.map(f => `- **${f.title}** (${f.file})\n  - Error: ${f.error}`).join('\n\n') : '### All tests passed! 🎉'}

## Next Steps
${results.failed > 0 ? '1. Review failed tests above\n2. Check screenshots in test-results/\n3. Fix issues and re-run tests' : 'All tests are passing. No action needed.'}
`;
}

