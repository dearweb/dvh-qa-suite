# Test Cases for V2-5265: Improve DVH Checkout Redirect Time

**Issue Key:** V2-5265
**Summary:** Improve DVH Checkout Redirect Time
**Description:** This ticket focuses on reducing the redirection time from the preview page to the checkout page after the user submits their email. The current redirection time is approximately 30 seconds.

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
