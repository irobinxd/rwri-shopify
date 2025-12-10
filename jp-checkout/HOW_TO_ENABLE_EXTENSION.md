# How to Enable Your Checkout Extension

## Method 1: Using Shopify CLI Dev Mode (Easiest for Development)

If you're running `shopify app dev`, the extension should automatically be active in your development store.

1. **Make sure your app is running:**
   ```bash
   shopify app dev
   ```

2. **The extension will be automatically enabled** when you access the checkout

3. **No need to manually enable it** - it's active in dev mode

## Method 2: Enable via Shopify Admin

### Step 1: Install/Open the App
1. Go to your Shopify admin: `https://joel-dev-3.myshopify.com/admin`
2. Navigate to **Apps** (left sidebar)
3. Find **"jp-checkout"** app
4. Click on it to open

### Step 2: Enable Extension
Once in the app, look for:
- **"Extensions"** tab or section
- **"Checkout Extension"** settings
- **"Enable Extension"** button or toggle

### Alternative: Checkout Profile Settings
1. Go to **Settings → Checkout**
2. Scroll down to find:
   - **"Checkout extensions"** section
   - **"App extensions"** section
   - Or look for your app name "jp-checkout"

## Method 3: Verify Extension is Active

Even if you don't see the settings, the extension might already be active. To verify:

1. **Add items to cart** on your store
2. **Go to checkout**
3. **Open browser Developer Tools** (F12)
4. **Check Console tab** for messages starting with:
   - `Checkout Extension - Cart attributes`
   - `🚀 Checkout Extension: Starting customization injection...`

If you see these messages, **the extension is already active!**

## Method 4: Check via Partner Dashboard

1. Go to [Shopify Partner Dashboard](https://partners.shopify.com)
2. Navigate to your app: **jp-checkout**
3. Go to **Extensions** section
4. Check if **checkout-ui** extension is listed
5. Verify it's **published/active**

## Troubleshooting

### If you still can't find it:

1. **Make sure you're in the correct store:**
   - Your dev store is: `joel-dev-3.myshopify.com`
   - Make sure you're logged into this store's admin

2. **Check if checkout extensibility is enabled:**
   - Your store needs to have checkout extensibility enabled
   - This is usually enabled by default in development stores

3. **Try accessing the app directly:**
   - Go to: `https://joel-dev-3.myshopify.com/admin/apps/jp-checkout`
   - Or search for "jp-checkout" in the Apps section

4. **Verify the extension is deployed:**
   ```bash
   shopify app info
   ```
   Should show `checkout-ui` under `ui_extension`

## Quick Test Without Admin Access

You can test if the extension is working without finding the settings:

1. **Run your app in dev mode:**
   ```bash
   shopify app dev
   ```

2. **Add items to cart and go to checkout**

3. **Open browser console (F12)**

4. **Look for extension logs** - if you see them, it's working!

5. **Check if elements are hidden:**
   - Inspect `#local_pickup_methods`
   - Look for `<strong>` with "PICK UP/BOOK YOUR OWN RIDER"
   - Check if it has `display: none` style

## Still Can't Find It?

The extension might be working even if you can't find the settings. The best way to verify is to:

1. **Test on checkout page** (add to cart → checkout)
2. **Check browser console** for extension logs
3. **Inspect elements** to see if CSS/script is injected

If the extension logs appear in console, **it's working!** You don't need to find the settings page.

