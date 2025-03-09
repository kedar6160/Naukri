require('dotenv').config();
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false }); // Set true for headless mode
    const context = await browser.newContext();
    const page = await context.newPage();

    // Navigate to Naukri login page
    await page.goto('https://www.naukri.com/nlogin/login');

    // Enter credentials securely
    await page.fill('input[name="email"]', process.env.NAUKRI_EMAIL);
    await page.fill('input[name="password"]', process.env.NAUKRI_PASSWORD);

    // Click login button and wait for navigation
    await Promise.all([
        page.click('button[type="submit"]'),
        page.waitForNavigation({ waitUntil: 'networkidle' })
    ]);

    console.log('Logged in successfully');

    // Navigate to profile page
    await page.goto('https://www.naukri.com/mnjuser/profile');

    // Locate and click on the "Edit Resume" or "Upload" button
    const fileInput = await page.$('input[type="file"]');
    if (fileInput) {
        await fileInput.setInputFiles('path/to/your/resume.pdf'); // Update with actual path
        console.log('Resume uploaded successfully');
    } else {
        console.log('Resume upload button not found');
    }

    // Save changes if required
    const saveButton = await page.$('button[type="submit"]');
    if (saveButton) {
        await saveButton.click();
        console.log('Changes saved');
    }

    // Close browser
    await browser.close();
})();
