# How to Install the App in Your Store

The 401 Unauthorized error means the app is not installed in your development store. Follow these steps:

## Step 1: Start the App in Dev Mode

Run this command in your terminal:

```bash
shopify app dev
```

## Step 2: Install the App

When `shopify app dev` starts, it will:

1. **Show you a URL** - Look for a message like:
   ```
   Press P to open the URL to your app
   ```
   Or it will show a URL directly.

2. **Press `P`** in the terminal, or **copy the URL** and open it in your browser

3. **You'll be redirected to Shopify** to install the app

4. **Click "Install"** or "Install app" button

5. **Authorize the app** - Grant the requested permissions:
   - `write_products`
   - `write_checkout_branding_settings`

## Step 3: Verify Installation

After installation:

1. **Go to your Shopify admin**: `https://joel-dev-3.myshopify.com/admin`

2. **Navigate to Apps** (left sidebar)

3. **You should see "jp-checkout"** in your apps list

4. **Click on it** to open the app

## Step 4: Test the Extension

Once installed:

1. **Add items to cart** on your store
2. **Go to checkout**
3. **Open browser console** (F12)
4. **Look for extension logs**:
   - `Checkout Extension - Cart attributes: [...]`
   - `🚀 Checkout Extension: Starting customization injection...`

## Alternative: Install via Partner Dashboard

If the dev mode doesn't work:

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to your app: **jp-checkout**
3. Go to **Test on development store**
4. Select your store: **joel-dev-3**
5. Click **Install**

## Troubleshooting

### If you get "App not found" error:
- Make sure you're running `shopify app dev` in the project directory
- Check that `shopify.app.toml` has the correct `client_id`

### If installation page doesn't load:
- Make sure the dev server is running (`shopify app dev`)
- Check the terminal for any errors
- Try stopping and restarting: `Ctrl+C` then `shopify app dev` again

### If you see permission errors:
- Make sure your store has checkout extensibility enabled
- Verify you're using a development store (not a regular store)

## Quick Command Reference

```bash
# Start development server (this will show install URL)
shopify app dev

# Deploy extension (after installation)
shopify app deploy

# Check app status
shopify app info
```

## After Installation

Once the app is installed, the checkout extension should automatically be active. You don't need to manually enable it - it will work automatically when:
- The app is installed
- You're in dev mode (`shopify app dev`)
- Or the extension is deployed (`shopify app deploy`)

