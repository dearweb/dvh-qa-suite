# DVH Checkout Optimization Test Documentation

**Issue:** V2-5265 - Improve DVH Checkout Redirect Time
**Project:** V2 Project (DVH Checkout Optimization)
**Description:** To reduce the redirection time from the preview page to the checkout page after the user submits their email. The current redirection time is approximately 30 seconds.
**Status:** QA to do
**Reporter:** Zain Khan
**Assignee:** Muhammad Ahmed
**Created:** 24/Mar/26
**Updated:** 22/Apr/26

## Test Plan

**1. Environment Setup:**
    *   Ensure the latest build of the DVH Checkout feature is deployed to the QA environment.
    *   Confirm that the QA environment has the necessary configurations and dependencies for the optimized checkout flow.
    *   Access to the "Provide VINs/Emails for cases to troubleshoot" field might be needed for specific test scenarios.

**2. Test Scenarios:**

    *   **Scenario 1: Baseline Performance Measurement**
        *   **Action:** Navigate to the preview page, enter a valid email address, and submit.
        *   **Expected Result:** Measure the time taken for the redirection to the checkout page. Record this as a baseline.

    *   **Scenario 2: Optimized Redirect Time Verification**
        *   **Action:** After the optimization is implemented, repeat Scenario 1.
        *   **Expected Result:** The redirection time should be significantly less than the baseline (target: < 5 seconds, ideally much faster).

    *   **Scenario 3: "Fire and Forget" API - Create Preview Analytics**
        *   **Action:** Trigger the `create_preview_analytics` API call (e.g., by loading the preview page). Monitor network requests and server logs (if accessible) to confirm the call is made and handled asynchronously.
        *   **Expected Result:** The API call is made without blocking the UI, and the page loads promptly. No errors are observed in logs related to this call.

    *   **Scenario 4: "Fire and Forget" API - Update Preview Analytics**
        *   **Action:** Trigger actions that would update preview analytics (if applicable on the preview page). Confirm asynchronous handling.
        *   **Expected Result:** The update happens in the background without user-perceptible delays.

    *   **Scenario 5: "Fire and Forget" API - Register**
        *   **Action:** Perform the registration process (if part of the preview/checkout flow). Confirm asynchronous handling of the `register` API.
        *   **Expected Result:** Registration process completes smoothly, with the `register` API call handled in the background.

    *   **Scenario 6: "Fire and Forget" API - Create Order**
        *   **Action:** Complete the checkout process (after successful redirection) and submit the order. Confirm asynchronous handling of the `create_order` API.
        *   **Expected Result:** The order is successfully created, and the `create_order` API call is made without blocking the final confirmation step.

    *   **Scenario 7: Error Handling for APIs**
        *   **Action:** Intentionally simulate errors for each of the "fire and forget" APIs (if possible via test configurations or mock services).
        *   **Expected Result:** The application should handle these API errors gracefully, without crashing or significantly degrading user experience. User-facing errors should be informative.

    *   **Scenario 8: User Journey Integrity**
        *   **Action:** Perform a complete user journey from landing on the preview page, submitting email, redirecting to checkout, and completing the order.
        *   **Expected Result:** The entire flow is smooth, logical, and free of functional or visual defects. All data is correctly processed and stored.

**3. Test Data:**
    *   Valid email addresses.
    *   Invalid email addresses (for negative testing if applicable).
    *   Test VINs/Emails (if required for specific troubleshooting scenarios).

**4. Success Criteria:**
    *   Redirection time reduced from ~30 seconds to an acceptable performance threshold (e.g., < 5 seconds).
    *   All "fire and forget" APIs are confirmed to be implemented asynchronously.
    *   No critical or major bugs introduced in the checkout or preview flow.
    *   All previously working functionalities remain intact.

## Test Cases

**Test Case ID:** V2-5265-TC001
**Test Case Title:** Verify Baseline Redirect Time
**Preconditions:** Application deployed to QA environment, user can access the preview page.
**Test Steps:**
1.  Navigate to the DVH checkout preview page.
2.  Observe the page load time.
3.  Enter a valid email address in the provided field.
4.  Click the submit button.
5.  Measure the time elapsed until the checkout page is fully loaded.
**Expected Results:** The redirection to the checkout page takes approximately 30 seconds.

**Test Case ID:** V2-5265-TC002
**Test Case Title:** Verify Optimized Redirect Time
**Preconditions:** Latest optimized build deployed, user can access the preview page.
**Test Steps:**
1.  Navigate to the DVH checkout preview page.
2.  Enter a valid email address in the provided field.
3.  Click the submit button.
4.  Measure the time elapsed until the checkout page is fully loaded.
**Expected Results:** The redirection to the checkout page is significantly faster, ideally under 5 seconds.

**Test Case ID:** V2-5265-TC003
**Test Case Title:** Verify Asynchronous `create_preview_analytics` API
**Preconditions:** Latest optimized build deployed. Network monitoring tools available.
**Test Steps:**
1.  Navigate to the DVH checkout preview page.
2.  Observe network activity for the `create_preview_analytics` API call.
3.  Submit a valid email address.
4.  Observe network activity and UI responsiveness during redirection.
**Expected Results:** The `create_preview_analytics` API call is initiated without blocking the UI thread, and the page remains responsive. Redirection occurs promptly.

**Test Case ID:** V2-5265-TC004
**Test Case Title:** Verify Asynchronous `update_preview_analytics` API (if applicable)
**Preconditions:** Latest optimized build deployed. Functionality to trigger `update_preview_analytics` exists.
**Test Steps:**
1.  Perform actions on the preview page that would trigger an update to preview analytics.
2.  Observe if there are any UI delays or interruptions.
**Expected Results:** Analytics updates occur in the background without impacting user interaction or page performance.

**Test Case ID:** V2-5265-TC005
**Test Case Title:** Verify Asynchronous `register` API
**Preconditions:** Latest optimized build deployed.
**Test Steps:**
1.  Follow the user journey that includes registration (if applicable to the preview/checkout flow).
2.  Observe the responsiveness of the registration process.
**Expected Results:** The registration process completes smoothly, with the `register` API call handled asynchronously.

**Test Case ID:** V2-5265-TC006
**Test Case Title:** Verify Asynchronous `create_order` API
**Preconditions:** Latest optimized build deployed.
**Test Steps:**
1.  Complete the checkout process (after successful redirection).
2.  Submit the order.
3.  Observe the responsiveness of the order submission.
**Expected Results:** The order is successfully placed, and the `create_order` API call is made without blocking the final confirmation step.

**Test Case ID:** V2-5265-TC007
**Test Case Title:** Verify API Error Handling Gracefully
**Preconditions:** Latest optimized build deployed. Ability to simulate API errors (e.g., using mock services or test configurations).
**Test Steps:**
1.  Attempt to perform actions that trigger the "fire and forget" APIs.
2.  Simulate an error condition for one or more of these APIs.
3.  Observe the application's response.
**Expected Results:** The application handles API errors gracefully, without crashing. User-facing error messages are informative and helpful.

**Test Case ID:** V2-5265-TC008
**Test Case Title:** Verify Full User Journey Integrity
**Preconditions:** Latest optimized build deployed.
**Test Steps:**
1.  Start from landing on the preview page.
2.  Submit a valid email address.
3.  Observe redirection to the checkout page.
4.  Complete the checkout process and submit the order.
5.  Verify all data (order details, user info) is correctly processed and stored.
**Expected Results:** The entire flow from preview to order completion is seamless, functional, and free of defects. Data integrity is maintained.

## Final Report

*(This section will be filled out after test execution. It will include a summary of tests performed, pass/fail status for each scenario, observed defects, and overall recommendation.)*
    
*   **Test Execution Date:** [To be filled]
*   **Tester:** [To be filled]
*   **Build Version:** [To be filled]
*   **Summary of Findings:**
    *   [Summary of Pass/Fail for each test case]
    *   [List of any defects found, with IDs if applicable]
*   **Performance Metrics:**
    *   Baseline Redirect Time: [Value]
    *   Optimized Redirect Time: [Value]
*   **Overall Recommendation:**
    *   [e.g., Pass, Pass with Minor Defects, Fail]

**Notes:**
*   The "Provide VINs/Emails for cases to troubleshoot" field was not explicitly used in the test cases but should be considered for specific error reproduction scenarios.
*   Specific API endpoints for `create_preview_analytics`, `update_preview_analytics`, `register`, and `create_order` should be confirmed for monitoring and potential error simulation.
*   Actual execution of tests will provide the data for the Final Report section.
