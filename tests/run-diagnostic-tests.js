/**
 * Diagnostic Test Runner
 * Runs hamburger menu diagnostic tests and generates report
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const TEST_DIR = path.join(__dirname, 'hamburger-tests');
const REPORT_DIR = path.join(__dirname, 'report');
const REPORT_FILE = path.join(REPORT_DIR, 'hamburger-summary.md');

// Ensure report directory exists
if (!fs.existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true });
}

console.log('🧪 Running Hamburger Menu Diagnostic Tests...\n');

try {
    // Run Playwright tests
    const testOutput = execSync(
        'npx playwright test hamburger-tests/hamburger-diagnostic-test.js --reporter=list',
        { 
            cwd: __dirname,
            encoding: 'utf-8',
            stdio: 'pipe'
        }
    );

    // Parse test results (basic parsing)
    const lines = testOutput.split('\n');
    let passed = 0;
    let failed = 0;
    const testResults = [];

    lines.forEach(line => {
        if (line.includes('✓') || line.includes('passed')) {
            passed++;
            testResults.push({ status: 'PASS', message: line.trim() });
        } else if (line.includes('✘') || line.includes('failed')) {
            failed++;
            testResults.push({ status: 'FAIL', message: line.trim() });
        }
    });

    // Generate report
    const report = `# Hamburger Menu Diagnostic Test Report
**Generated**: ${new Date().toISOString()}
**Test File**: hamburger-diagnostic-test.js

---

## Test Summary

- **Total Tests**: ${passed + failed}
- **Passed**: ${passed} ✅
- **Failed**: ${failed} ${failed > 0 ? '❌' : ''}

---

## Test Results

${testResults.length > 0 ? testResults.map(r => `- **${r.status}**: ${r.message}`).join('\n') : 'No test results parsed'}

---

## Full Test Output

\`\`\`
${testOutput}
\`\`\`

---

## Next Steps

${failed > 0 ? 
    '⚠️ Some tests failed. Review the output above and fix any issues.' : 
    '✅ All tests passed! Hamburger menu is working correctly.'}
`;

    fs.writeFileSync(REPORT_FILE, report, 'utf-8');
    
    console.log(`\n✅ Test report generated: ${REPORT_FILE}`);
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    
    if (failed > 0) {
        console.log('❌ Some tests failed. Check the report for details.');
        process.exit(1);
    } else {
        console.log('✅ All tests passed!');
    }
    
} catch (error) {
    const errorReport = `# Hamburger Menu Diagnostic Test Report
**Generated**: ${new Date().toISOString()}
**Status**: ERROR

---

## Error

\`\`\`
${error.message}
\`\`\`

---

## Full Error Output

\`\`\`
${error.stdout || error.stderr || error.toString()}
\`\`\`

---

## Troubleshooting

1. Ensure a local server is running on port 5501:
   \`\`\`bash
   python -m http.server 5501
   # or
   npx serve -p 5501
   \`\`\`

2. Install Playwright browsers:
   \`\`\`bash
   npx playwright install
   \`\`\`

3. Check that all dependencies are installed:
   \`\`\`bash
   npm install
   \`\`\`
`;

    fs.writeFileSync(REPORT_FILE, errorReport, 'utf-8');
    console.error('\n❌ Test execution failed. Check the report for details.');
    console.error(error.message);
    process.exit(1);
}

