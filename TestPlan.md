# Test Plan: DVH VIN Flow Automation

## Project Overview
Automated verification of the vehicle history report (VHR) and Window Sticker (WS) flows, from initial VIN search through the preview page auto-selection, and ending at the checkout page.

## Objectives
- Verify VIN search functionality for both VHR and WS.
- Confirm auto-selection of upsell plans on preview pages.
- Validate analytics API calls during the conversion funnel.
- Measure performance (response times) in seconds for critical steps.

## Scope
- URL 1: https://dvh.vehiclehistory.report/
- URL 2: https://dvh.vehiclehistory.report/window-sticker
- Key Pages: Home, Window Sticker, Preview, Checkout.
- Browser: Chromium (Playwright).

## Tools & Environment
- Language: JavaScript
- Framework: Playwright
- Environment: Windows 32-bit (Test execution)
- Evidence: Video recording enabled (.webm format)

## Success Criteria
- All 5 test cases pass successfully.
- Critical APIs (Analytics) are captured with payload and timing.
- Final landing on the Checkout page is confirmed.
- Video recording of the session is generated.
