const { test, expect } = require('@playwright/test');

test.describe('DVH Production VIN Flow Automation', () => {
  const VIN = 'WBA8E9C56GK645151';
  const PROD_BASE_URL = 'https://detailedvehiclehistory.com/';
  const PROD_WS_URL = 'https://detailedvehiclehistory.com/window-sticker';

  test('Prod: VHR End-to-End Flow with Analytics', async ({ page, context }) => {
    await context.clearCookies();
    
    console.log('Case 1 & 2 (Prod): Searching VIN...');
    const searchStart = Date.now();
    await page.goto(PROD_BASE_URL, { waitUntil: 'domcontentloaded' });
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.fill(VIN);
    await page.locator('button:has-text("Search VIN"), button:has-text("Check VIN")').first().click();
    console.log(`Prod Search Step Timing: ${((Date.now() - searchStart) / 1000).toFixed(2)}s`);

    console.log('Case 3 (Prod): Verifying Preview page auto-select...');
    await page.waitForURL(url => url.href.includes('preview'), { timeout: 45000, waitUntil: 'load' });
    
    const upsellSection = page.locator('xpath=//*[@id="plans"]/div[2]');
    await upsellSection.waitFor({ state: 'visible', timeout: 30000 });
    const checkbox = upsellSection.locator('input[type="checkbox"]').first();
    await page.waitForTimeout(3000); 
    const isChecked = await checkbox.isChecked();
    console.log(`Prod Auto-select verified: ${isChecked}`);
    expect(isChecked).toBe(true);

    console.log('Case 4 & 5 (Prod): Capturing APIs...');
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

    const accessBtn = page.locator('button:has-text("Access Records")').filter({ visible: true }).first();
    await accessBtn.click();
    
    await page.locator('input[type="email"]').fill(`prod_test_${Date.now()}@example.com`);
    await page.locator('button:has-text("Maybe Later")').click();
    await page.waitForTimeout(1000);

    if (page.url().includes('/checkout')) {
      console.log('Already on checkout page (Maybe Later triggered it).');
    } else {
      const emailInput = page.locator('input[type="email"]').filter({ visible: true }).first();
      if (!(await emailInput.isVisible())) {
        await accessBtn.click();
        await emailInput.waitFor({ state: 'visible' });
      }
      
      if (await emailInput.isEnabled()) {
        await emailInput.fill(`prod_final_${Date.now()}@example.com`);
        await page.locator('button:has-text("Proceed to checkout")').click();
      } else {
        console.log('Email input is disabled (likely submitting), waiting for checkout...');
      }
    }
    
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log(`Prod Flow reached Checkout: ${page.url()}`);
    
    console.log('\n--- Prod Captured API Data ---');
    capturedApis.forEach(a => console.log(`URL: ${a.url} | Status: ${a.status} | Timing: ${a.timing}`));
  });

  test('Prod: WS Preview page Update P23', async ({ page, context }) => {
    await context.clearCookies();
    
    console.log('Step 1 & 2 (Prod WS): VIN Search...');
    const searchStart = Date.now();
    // Use domcontentloaded to avoid networkidle timeouts on production
    await page.goto(PROD_WS_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.waitFor({ state: 'visible' });
    await page.waitForTimeout(2000); 
    await vinInput.fill(VIN);
    
    const searchBtn = page.locator('button:has-text("Search VIN"), button:has-text("Get Sticker"), button[type="submit"]').filter({ visible: true }).first();
    await searchBtn.click();

    console.log('Step 3 (Prod WS): Verifying Preview page auto-select...');
    await page.waitForURL(url => url.href.includes('preview'), { timeout: 45000, waitUntil: 'load' });

    const upsellSection = page.locator('xpath=//*[@id="plans"]/div[2]');
    await upsellSection.waitFor({ state: 'visible', timeout: 30000 });
    const checkbox = upsellSection.locator('input[type="checkbox"]').first();
    await page.waitForTimeout(3000); 
    const isChecked = await checkbox.isChecked();
    console.log(`Prod WS Auto-select verified: ${isChecked}`);
    expect(isChecked).toBe(true);

    console.log('Step 4 & 5 (Prod WS): Analytics Capture...');
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
    await emailInput.fill(`prod_ws_test_${Date.now()}@example.com`);
    
    await page.locator('button:has-text("Proceed to checkout")').click();
    
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log('Prod WS Flow reached Checkout');
    
    console.log('\n--- Prod WS Captured API Data ---');
    capturedApis.forEach(a => console.log(`URL: ${a.url} | Status: ${a.status} | Timing: ${a.timing}`));
  });
});
