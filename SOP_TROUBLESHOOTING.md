# Standard Operating Procedures (SOPs)
## Troubleshooting & Maintenance Checklists

**Last Updated:** January 8, 2026  
**Purpose:** Step-by-step procedures for common issues and maintenance tasks

---

## SOP 1: Order Attributes Not Appearing in Admin/Email

**When to Use:** Customer reports that pickup date/time information is missing from order confirmation emails or Shopify admin order details.

### Checklist:
- [ ] **Step 1:** Verify customer selected pickup date/time on cart page
  - Ask customer if they saw and filled out the date/time picker
  - Check if they have both platter and non-platter items (may need separate dates)
  
- [ ] **Step 2:** Check order in Shopify Admin
  - Go to Orders → Select the order
  - Look for "Order Attributes" section (near bottom of order details)
  - Check for:
    - `Pre-Orders Pickup Date` (for platter items)
    - `Click and Collect Pickup Date` (for regular items)
  
- [ ] **Step 3:** Check customer's order page
  - Go to customer account → Orders → Select order
  - Look for "Pickup Information" section in the sidebar
  - Verify if attributes are displayed there
  
- [ ] **Step 4:** Verify theme code is present
  - Check: `sections/customers-order.liquid`
  - Ensure lines 209-238 exist (displays `order.note_attributes`)
  - If missing, contact developer to restore the code
  
- [ ] **Step 5:** Check cart form submission
  - Open browser console (F12) on cart page
  - Look for these log messages before checkout:
    - `🔄 Updating cart attributes before checkout:`
    - `✅ Cart attributes verified in response:`
  - If these messages are missing, cart attributes may not be saving
  
- [ ] **Step 6:** Verify cart-form-page.liquid code
  - Check: `snippets/cart-form-page.liquid`
  - Ensure form submission handler (around line 846-949) exists
  - Must include:
    - `updateCartWithRetry()` function
    - 500ms delay before redirect
    - Attribute verification before checkout redirect
  
- [ ] **Action Required:**
  - If attributes missing from admin → Contact developer immediately
  - If attributes missing from email → Check email template code
  - If attributes missing from both → Check cart form submission flow

---

## SOP 2: Freebie (WellnessBoost Buy 2 Get 1) Not Working

**When to Use:** Customer doesn't see freebie selection, or freebie doesn't apply discount.

### Checklist:
- [ ] **Step 1:** Verify eligibility
  - Customer must have:
    - At least 2 WellnessBoost items in cart ✅
    - At least 2 non-freebie items total ✅
  
- [ ] **Step 2:** Check freebie section appears
  - Look for "🎁 Buy 2 Get 1 Free - Select Your Freebie" section
  - Should show 2 freebie product options
  - If missing, customer may not meet criteria
  
- [ ] **Step 3:** Verify discount applies
  - Check if discount code `WELLNESSBOOSTFREE` exists in Shopify
  - Or verify automatic discount is set up:
    - 100% off items with property `_freebie` = `wellness-boost`
  
- [ ] **Step 4:** Check discount in order
  - After order placed, verify discount applied
  - Freebie item should show $0.00 or discounted price
  
- [ ] **Action Required:**
  - If freebie section missing → Verify customer meets eligibility
  - If discount not applying → Check discount configuration in Shopify
  - If freebie products wrong → Update handles in `cart-form-page.liquid` line 302-303

---

## Quick Reference: Common File Locations

- **Cart Page:** `sections/main-cart.liquid`
- **Cart Form:** `snippets/cart-form-page.liquid`
- **Order Template:** `sections/customers-order.liquid`
- **Store Selector:** `assets/store-selector.js`
- **Store Modal:** `snippets/store-selector-modal.liquid`

---

## Emergency Contacts

- **Developer:** [Your contact info]
- **Shopify Support:** support.shopify.com
- **Theme Backup Location:** [Where theme backups are stored]

---

**Note:** Always test in development/staging environment before applying fixes to production.

