# Test Cases: DVH VIN Flow

| Case ID | Description | Expected Result |
| :--- | :--- | :--- |
| **Case 1** | Open website URL: `https://dvh.vehiclehistory.report/` | Page loads successfully. |
| **Case 2** | Enter VIN `WBA8E9C56GK645151` and click Search. | User navigates to the Preview page. |
| **Case 3** | Verify Upsell section `//*[@id="plans"]/div[2]`. | Checkbox is auto-selected by default. |
| **Case 4** | Fill email, click "Maybe Later", and capture network API. | Analytics/Log API is captured with response. |
| **Case 5** | Fill unique email, click "Proceed to checkout", and capture Analytics APIs. | Navigates to Checkout page; captures `create-preview-analytics` and `update-preview-analytics`. |
| **Case 6** | **WS Preview page Update P23**: Open `window-sticker` URL, search VIN, and verify preview. | Navigates to WS preview; verifies auto-select and proceeds to checkout. |
