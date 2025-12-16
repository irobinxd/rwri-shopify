# ScriptTag Setup Guide

This guide explains how to use ScriptTags to inject JavaScript into your Shopify checkout.

## What are ScriptTags?

ScriptTags allow you to inject JavaScript files into Shopify storefronts (including checkout pages). They're more reliable than checkout UI extensions for DOM manipulation because they run directly in the checkout context.

## Setup Steps

### 1. Update Scopes

The `shopify.app.toml` has been updated to include `write_script_tags` scope. You'll need to:

1. **Reinstall the app** or **update scopes**:
   - Go to your Shopify Partner Dashboard
   - Navigate to your app
   - Go to "App setup" → "Scopes"
   - Add `write_script_tags` scope
   - Save and reinstall the app in your development store

### 2. Install ScriptTag

1. **Start your app**:
   ```bash
   shopify app dev
   ```

2. **Navigate to Script Tags page**:
   - In your Shopify admin, open the app
   - Click on "Script Tags" in the navigation
   - Or go directly to: `/app/script-tags`

3. **Install the ScriptTag**:
   - Click the "Install Script Tag" button
   - The script will be injected into your checkout pages

### 3. Verify Installation

1. **Check the Script Tags page**:
   - You should see a green "✅ Installed" status
   - The script URL should be displayed

2. **Test in Checkout**:
   - Add items to cart
   - Go to checkout
   - Open browser console (F12)
   - You should see: `✅ Checkout customization script executing...`
   - The elements should be hidden automatically

## How It Works

1. **ScriptTag Creation**: When you click "Install Script Tag", the app creates a ScriptTag resource via GraphQL API
2. **Script Loading**: Shopify automatically loads the script on checkout pages (because `displayScope: "CHECKOUT"`)
3. **Script Execution**: The script runs and:
   - Hides "PICK UP/BOOK YOUR OWN RIDER" text
   - Hides "FREE" text
   - Hides "Usually ready in X hours" text
   - Adds hidden inputs for pickup dates

## Script URL

The script is served from: `/checkout-script.js`

This route is publicly accessible and doesn't require authentication.

## Troubleshooting

### Script Tag Not Loading

1. **Check Script URL**: Make sure the URL is correct and accessible
   - Try opening the URL directly in your browser
   - You should see JavaScript code

2. **Check Console**: Open browser console in checkout
   - Look for errors loading the script
   - Check for CORS errors

3. **Verify Installation**: 
   - Go back to Script Tags page
   - Make sure the script tag is listed
   - Try deleting and reinstalling

### Elements Not Hiding

1. **Check Console Logs**: 
   - Look for `🔍 Looking for local_pickup_methods...`
   - Check if elements are being found

2. **Verify Element IDs**: 
   - The script looks for `#local_pickup_methods`
   - If your checkout uses different IDs, we may need to update the selectors

3. **Timing Issues**:
   - The script runs multiple times (100ms, 500ms, 1s, 2s, 3s, 5s)
   - If content loads very slowly, we may need to increase delays

### Scope Issues

If you get permission errors:

1. **Reinstall the app** with updated scopes
2. **Check Partner Dashboard**: Make sure `write_script_tags` is in your app's scopes
3. **Verify in shopify.app.toml**: The scope should be listed

## Removing ScriptTag

To remove the script tag:

1. Go to Script Tags page
2. Click "Delete Script Tag"
3. Confirm deletion

The script will stop loading on checkout pages immediately.

## Advantages Over Checkout UI Extension

- ✅ Runs directly in checkout context (no iframe limitations)
- ✅ Full DOM access
- ✅ No CORS issues
- ✅ More reliable script loading
- ✅ Works on all checkout pages automatically

## Next Steps

After installing the ScriptTag:

1. Test the checkout to verify elements are hidden
2. Check browser console for any errors
3. Verify hidden inputs are being added
4. Test with different products/cart combinations






