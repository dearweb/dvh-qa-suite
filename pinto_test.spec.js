const { test, expect } = require('@playwright/test');

test.describe('Classic Decoder (Pinto) Flow Automation - Updated VINs', () => {
  const VHR_VIN = '2D67M2P157717';
  const WS_VIN = '3F91H525247'; 
  const BASE_URL = 'https://dev.pintonaturals.com/';
  const BUILD_SHEET_URL = 'https://dev.pintonaturals.com/build-sheet';

  test.beforeEach(async ({ context }) => {
    await context.clearCookies();
  });

  test('Pinto VHR: Search -> Preview -> Checkout', async ({ page }) => {
    test.setTimeout(120000);
    console.log('Step 1: Loading VHR Home Page...');
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.fill(VHR_VIN);
    await page.locator('button:has-text("Decode classic VIN"), button:has-text("Get started")').first().click();

    // Step 3: Verifying Preview Page Auto-Select
    await page.waitForURL(url => url.href.includes('preview'), { timeout: 60000 });
    console.log(`Landed on Preview: ${page.url()}`);
    
    const vhrUpsellXPath = 'xpath=//*[@id="__next"]/div[2]/main/main/section/div[6]/div/div[2]/div[2]/div/label/div';
    await page.locator(vhrUpsellXPath).waitFor({ state: 'visible', timeout: 30000 }).catch(() => console.log('VHR Upsell XPath not visible, continuing...'));
    
    // Verify Checkbox is auto-selected - using more robust locator
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.waitFor({ state: 'attached', timeout: 30000 });
    const isChecked = await checkbox.isChecked();
    console.log(`VHR Auto-select status: ${isChecked}`);
    expect(isChecked).toBe(true);

    console.log('Step 4: Accessing Vehicle History...');
    const accessBtn = page.locator('button:has-text("Access vehicle history"), button:has-text("Access Records")').filter({ visible: true }).first();
    await accessBtn.click();
    
    await page.locator('input[type="email"]').fill(`test_vhr_${Date.now()}@example.com`);
    await page.locator('button:has-text("Proceed to checkout")').click();
    
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log('VHR Flow Passed');
  });

  test('Pinto Build Sheet: Search -> Preview -> Checkout', async ({ page }) => {
    test.setTimeout(120000);
    console.log('Step 1: Loading Build Sheet Page...');
    await page.goto(BUILD_SHEET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    
    const vinInput = page.locator('input[placeholder*="VIN" i], input[name="vin"]').first();
    await vinInput.fill(WS_VIN);
    await page.locator('button:has-text("Decode classic VIN"), button:has-text("Get started")').first().click();

    console.log('Step 3: Verifying Build Sheet Preview...');
    // Handle both preview and ws-preview URLs
    await page.waitForURL(url => url.href.includes('preview'), { timeout: 60000 });
    console.log(`Landed on Preview: ${page.url()}`);
    
    const bsUpsellXPath = 'xpath=//*[@id="__next"]/div[2]/main/main/section/div[5]/div/div[2]/div[2]/div/label/div';
    await page.locator(bsUpsellXPath).waitFor({ state: 'visible', timeout: 30000 }).catch(() => console.log('BS Upsell XPath not visible, continuing...'));
    
    const checkbox = page.locator('input[type="checkbox"]').first();
    await checkbox.waitFor({ state: 'attached', timeout: 30000 });
    const isChecked = await checkbox.isChecked();
    console.log(`Build Sheet Auto-select status: ${isChecked}`);
    expect(isChecked).toBe(true);

    console.log('Step 4: Accessing Buildsheet...');
    const accessBtn = page.locator('button:has-text("Access buildsheet"), button:has-text("Access Records"), button:has-text("Get Build Sheet")').filter({ visible: true }).first();
    await accessBtn.click();
    
    await page.locator('input[type="email"]').fill(`test_bs_${Date.now()}@example.com`);
    await page.locator('button:has-text("Proceed to checkout")').click();
    
    await page.waitForURL('**/checkout**', { timeout: 60000 });
    console.log('Build Sheet Flow Passed');
  });
});
