# Debugging Guide - Checkout Extension

This guide will help you verify that your checkout extension is working correctly.

## Step 1: Verify Extension is Deployed

1. **Check if extension is built:**
   ```bash
   npm run build
   ```

2. **Deploy the extension:**
   ```bash
   shopify app deploy
   ```

3. **Verify in Shopify Admin:**
   - Go to **Settings → Checkout → Checkout extensions**
   - Look for "checkout-ui" extension
   - Make sure it's **enabled/active**

## Step 2: Check Browser Console

1. **Open your checkout page** (add items to cart and go to checkout)

2. **Open browser Developer Tools** (F12 or Right-click → Inspect)

3. **Go to Console tab**

4. **Look for these log messages:**
   - ✅ `Checkout Extension - Cart attributes: [...]`
   - ✅ `Checkout Extension - Full cart: {...}`
   - ✅ `Checkout Extension - Platter Pickup Date: ...`
   - ✅ `Checkout Extension - Other Items Pickup Date: ...`
   - ✅ `🚀 Checkout Extension: Starting customization injection...`
   - ✅ `✅ Checkout Extension: Custom CSS injected successfully`
   - ✅ `✅ Checkout Extension: Customization script loaded successfully`

5. **If you see errors:**
   - ❌ `Failed to load checkout customization script` → Check network_access in shopify.extension.toml
   - ❌ `document is not available` → Extension might be running in wrong context
   - ❌ `setTimeout is not available` → Extension environment issue

## Step 3: Verify CSS Injection

1. **In Developer Tools, go to Elements/Inspector tab**

2. **Search for `<style id="checkout-custom-css">`** in the `<head>` section

3. **If found:** CSS is injected ✅

4. **If not found:** Extension might not be running or CSS injection failed

## Step 4: Verify Script Injection

1. **In Developer Tools, go to Elements/Inspector tab**

2. **Search for `<script id="checkout-custom-script-injected">`** in the `<head>` or `<body>` section

3. **Check the Network tab:**
   - Look for request to `/checkout-script.js`
   - Status should be `200 OK`
   - If `404` or `Failed`: Script route might not be accessible

## Step 5: Verify Elements are Hidden

1. **In Developer Tools, go to Elements/Inspector tab**

2. **Find the element with id `local_pickup_methods`**

3. **Look for the `<strong>` element containing "PICK UP/BOOK YOUR OWN RIDER"**

4. **Check its computed styles:**
   - Should have `display: none`
   - Should have `visibility: hidden`
   - Should have `opacity: 0`

5. **Look for `<p>` elements containing "Usually ready in X hours"**
   - Should also be hidden with same styles

## Step 6: Verify Hidden Inputs

1. **In Developer Tools, go to Elements/Inspector tab**

2. **Search for:**
   - `<input id="platter-datetime-attr" name="attributes[Platter Pickup Date]">`
   - `<input id="non-platter-datetime-attr" name="attributes[Other Items Pickup Date]">`

3. **These should be inside `#local_pickup_methods` or the checkout form**

4. **Check their values** - they should contain the cart attribute values

## Step 7: Check Network Requests

1. **In Developer Tools, go to Network tab**

2. **Filter by "JS" or "Script"**

3. **Look for:**
   - `/checkout-script.js` - should load successfully
   - Check response - should be JavaScript code

4. **If blocked or 404:**
   - Verify the route exists: `app/routes/checkout-script.js`
   - Check if app is running: `npm run dev`
   - Verify SHOPIFY_APP_URL is correct

## Step 8: Verify Extension Target

1. **Check `extensions/checkout-ui/shopify.extension.toml`**

2. **Current target:** `purchase.checkout.delivery-address.render-before`

3. **This means the extension should render BEFORE the delivery address section**

4. **If you don't see it there, the extension might not be active**

## Common Issues and Solutions

### Issue: No console logs appear
**Solution:**
- Extension might not be deployed
- Extension might not be enabled in checkout settings
- Check if extension target is correct

### Issue: Script fails to load (404)
**Solution:**
- Make sure `app/routes/checkout-script.js` exists
- Make sure app is running: `npm run dev`
- Check SHOPIFY_APP_URL environment variable
- Verify network_access is enabled in shopify.extension.toml

### Issue: CSS injected but elements still visible
**Solution:**
- Check if selectors match the actual HTML structure
- Verify CSS specificity (might need `!important`)
- Check if elements are added dynamically after CSS injection
- Script should handle dynamic content with MutationObserver

### Issue: Cart attributes not showing
**Solution:**
- Verify attributes are set in cart before checkout
- Check console logs for attribute values
- Verify `applyAttributeChange` is being called
- Check if hidden inputs are being created

### Issue: Extension not appearing in checkout
**Solution:**
- Go to Settings → Checkout → Checkout extensions
- Enable the extension
- Make sure extension is published/deployed
- Check extension target matches where you expect it

## Quick Test Checklist

- [ ] Extension is deployed (`shopify app deploy`)
- [ ] Extension is enabled in checkout settings
- [ ] Console shows extension logs
- [ ] CSS is injected (check `<style id="checkout-custom-css">`)
- [ ] Script is loaded (check Network tab for `/checkout-script.js`)
- [ ] Elements are hidden (check computed styles)
- [ ] Hidden inputs exist (check DOM)
- [ ] No errors in console

## Still Not Working?

1. **Check the terminal** where `npm run dev` is running for errors
2. **Check Shopify Partner Dashboard** for app status
3. **Try rebuilding:** `npm run build` then `shopify app deploy`
4. **Check extension logs** in Shopify admin
5. **Verify API version** matches in shopify.app.toml and shopify.extension.toml

