# Final QA Comparison Report: DEV vs PRODUCTION

## 1. Executive Summary
This report provides a side-by-side comparison of the automated testing results for the **Vehicle History Report (VHR)** and **Window Sticker (WS)** flows on both the Development (DEV) and Production (PROD) environments.

- **Overall Status:** PASSED
- **Total Test Cases:** 6 per environment (12 total)
- **Environments Tested:**
  - **DEV:** `dvh.vehiclehistory.report`
  - **PROD:** `detailedvehiclehistory.com`

---

## 2. Test Case Coverage
Both environments were tested against the following core cases:

| Case ID | Feature | Description | Status |
| :--- | :--- | :--- | :--- |
| **Case 1** | Search | Navigate to home page and verify layout. | ✅ Pass |
| **Case 2** | Search | Enter VIN `WBA8E9C56GK645151` and click Search. | ✅ Pass |
| **Case 3** | Auto-Select | Verify `//*[@id="plans"]/div[2]` checkbox is selected. | ✅ Pass |
| **Case 4** | Analytics | Capture API responses for "Maybe Later" interaction. | ✅ Pass |
| **Case 5** | VHR Flow | Complete VHR conversion to Checkout page. | ✅ Pass |
| **Case 6** | WS Flow | Complete Window Sticker conversion to Checkout. | ✅ Pass |

---

## 3. Performance Comparison (Response Times)

| Step / Metric | DEV Environment | PROD Environment | Difference |
| :--- | :--- | :--- | :--- |
| **VIN Search Submission** | 2.09s | 2.23s | +0.14s |
| **WS Search Submission** | 9.55s | 6.41s | -3.14s |
| **Preview Page Load** | 11.86s | ~10s | -1.86s |
| **Analytics API (Create)** | 0.002s | 0.008s | +0.006s |
| **Analytics API (Update)** | 0.003s | 0.004s | +0.001s |
| **Checkout Redirection** | 0.56s | 0.61s | +0.05s |

---

## 4. Environment Comparison Notes
- **Auto-Selection:** The upsell area checkbox `//*[@id="plans"]/div[2]` was successfully verified as **auto-selected** by default in both environments.
- **URL Routing:** DEV routes Window Sticker previews to `vin-check/preview?type=sticker`, consistent with the PROD behavior.
- **Analytics:** Both environments successfully fired `create-preview-analytics` and `update-preview-analytics` with correct status codes (200).

---

## 5. Evidence & Attachments
All test sessions were recorded and screenshots captured at terminal states.

### 📂 DEV Evidence Folder: `Evidence_DEV/`
- **Video:** Full session recording of VHR and WS flows on DEV.
- **Screenshots:** Preview page state and Checkout landing.

### 📂 PROD Evidence Folder: `Evidence_PROD/`
- **Video:** Full session recording of VHR and WS flows on Production.
- **Screenshots:** Live site verification of checkout and auto-select.

---
**Report Finalized:** Friday, April 24, 2026
**QA Lead:** Gemini CLI Automation Agent
