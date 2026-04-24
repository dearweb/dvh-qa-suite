const { test, expect } = require('@playwright/test');

test.describe('DVH VIN Flow Full Automation', () => {
  const VIN = 'WBA8E9C56GK645151';
  const BASE_URL = 'https://dvh.vehiclehistory.report/';
  const PREVIEW_URL = `https://dvh.vehiclehistory.report/vin-check/preview?vin=${VIN}&wpPage=homepage&type=vhr`;

  test('DVH End-to-End Flow with Analytics', async ({ page, context }) => {
    // Ensuring clean state
    await context.clearCookies();
    
    // Case 1 & 2: Search
    console.log('Case 1 & 2: Searching VIN...');
    const searchStart = Date.now();
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' });
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.fill(VIN);
    await page.locator('button:has-text("Search VIN")').first().click();
    console.log(`Search Step Timing: ${((Date.now() - searchStart) / 1000).toFixed(2)}s`);

    // Case 3: Preview
    console.log('Case 3: Verifying Preview page auto-select...');
    const previewStart = Date.now();
    await page.goto(PREVIEW_URL, { waitUntil: 'networkidle' });
    const upsellSection = page.locator('xpath=//*[@id="plans"]/div[2]');
    await upsellSection.waitFor({ state: 'visible' });
    const checkbox = upsellSection.locator('input[type="checkbox"]').first();
    await page.waitForTimeout(2000); // Wait for JS logic
    const isChecked = await checkbox.isChecked();
    console.log(`Preview Page Load Timing: ${((Date.now() - previewStart) / 1000).toFixed(2)}s`);
    console.log(`Auto-select verified: ${isChecked}`);
    expect(isChecked).toBe(true);

    // Case 4 & 5: Analytics Capture
    console.log('Case 4 & 5: Capturing APIs...');
    const capturedApis = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('analytics') || url.includes('/checkout')) {
        const apiStart = Date.now();
        const data = {
          url: url.split('?')[0],
          status: response.status(),
          payload: response.request().postData(),
        };
        try { data.response = await response.json(); } catch(e) { data.response = 'Text/HTML content'; }
        data.timing = `${((Date.now() - apiStart) / 1000).toFixed(3)}s`;
        capturedApis.push(data);
      }
    });

    const accessBtn = page.locator('button:has-text("Access Records")').filter({ visible: true }).first();
    await accessBtn.click();
    
    // Maybe Later step
    await page.locator('input[type="email"]').fill(`test_maybe_${Date.now()}@example.com`);
    await page.locator('button:has-text("Maybe Later")').click();
    await page.waitForTimeout(1000);

    // Proceed to Checkout step
    console.log('Case 5: Proceeding to Checkout...');
    if (page.url().includes('/checkout')) {
      console.log('Already on checkout page (Maybe Later triggered it).');
    } else {
      const emailInput = page.locator('input[type="email"]').filter({ visible: true }).first();
      if (!(await emailInput.isVisible())) {
        await accessBtn.click();
        await emailInput.waitFor({ state: 'visible' });
      }
      
      // If the email is enabled, we fill it. If it's disabled, we check if we can click proceed
      if (await emailInput.isEnabled()) {
        await emailInput.fill(`test_final_${Date.now()}@example.com`);
        const checkoutStart = Date.now();
        await page.locator('button:has-text("Proceed to checkout")').click();
      } else {
        console.log('Email input is disabled (likely submitting), waiting for checkout...');
      }
    }
    
    const navStart = Date.now();
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log(`Checkout Final Navigation Timing: ${((Date.now() - navStart) / 1000).toFixed(2)}s`);
    
    // Final Report Summary
    console.log('\n--- Captured API Data ---');
    capturedApis.forEach(a => console.log(`URL: ${a.url} | Status: ${a.status} | Timing: ${a.timing}`));
  });

  test('WS Preview page Update P23', async ({ page, context }) => {
    const WS_URL = 'https://dvh.vehiclehistory.report/window-sticker';
    // The actual URL seen in logs is vin-check/preview with type=sticker
    const WS_PREVIEW_URL_PART = 'vin-check/preview'; 
    
    // Ensuring clean state by clearing cookies and permissions
    await context.clearCookies();
    
    console.log('Step 1 & 2: WS VIN Search...');
    const searchStart = Date.now();
    // Wait for networkidle to ensure page is fully ready
    await page.goto(WS_URL, { waitUntil: 'networkidle', timeout: 60000 });
    
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.waitFor({ state: 'visible' });
    await page.waitForTimeout(2000); // Buffer for page stability
    await vinInput.fill(VIN);
    
    const searchBtn = page.locator('button:has-text("Search VIN"), button:has-text("Get Sticker"), button[type="submit"]').filter({ visible: true }).first();
    await searchBtn.click();
    console.log(`WS Search Step Timing: ${((Date.now() - searchStart) / 1000).toFixed(2)}s`);

    console.log('Step 3: Verifying WS Preview page auto-select (XPath: //*[@id="plans"]/div[2])...');
    // Flexible wait for the preview page
    await page.waitForURL(url => url.href.includes(WS_PREVIEW_URL_PART), { timeout: 45000, waitUntil: 'load' });
    console.log(`Landed on WS Preview: ${page.url()}`);

    // Applying the specific XPath for Window Sticker preview as requested
    const upsellSection = page.locator('xpath=//*[@id="plans"]/div[2]');
    await upsellSection.waitFor({ state: 'visible', timeout: 30000 });
    const checkbox = upsellSection.locator('input[type="checkbox"]').first();
    await page.waitForTimeout(3000); // Wait for auto-select logic
    const isChecked = await checkbox.isChecked();
    console.log(`WS Auto-select verified: ${isChecked}`);
    expect(isChecked).toBe(true);

    console.log('Step 4 & 5: WS Analytics Capture...');
    const capturedApis = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('analytics') || url.includes('/checkout')) {
        const apiStart = Date.now();
        const data = {
          url: url.split('?')[0],
          status: response.status(),
        };
        data.timing = `${((Date.now() - apiStart) / 1000).toFixed(3)}s`;
        capturedApis.push(data);
      }
    });

    const accessBtn = page.locator('button:has-text("Access Records"), button:has-text("Download Sticker"), button:has-text("Get Sticker")').filter({ visible: true }).first();
    await accessBtn.click();
    
    const emailInput = page.locator('input[type="email"]').filter({ visible: true }).first();
    await emailInput.waitFor({ state: 'visible' });
    await emailInput.fill(`ws_test_${Date.now()}@example.com`);
    
    const proceedBtn = page.locator('button:has-text("Proceed to checkout")').filter({ visible: true }).first();
    await proceedBtn.click();
    
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log('WS Flow Successfully reached Checkout');
    
    console.log('\n--- WS Captured API Data ---');
    capturedApis.forEach(a => console.log(`URL: ${a.url} | Status: ${a.status} | Timing: ${a.timing}`));
  });
});
