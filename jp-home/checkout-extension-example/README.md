# Shopify Checkout UI Extension - Pickup Date & Time

This extension adds a date and time picker directly in the Shopify checkout for pickup orders.

## Requirements

- **Shopify Plus** subscription
- Node.js 18+ installed
- Shopify CLI installed

## Setup Instructions

### 1. Install Shopify CLI

```bash
npm install -g @shopify/cli @shopify/app
```

### 2. Create a New App (if you don't have one)

```bash
shopify app init
```

### 3. Generate the Checkout Extension

```bash
cd your-app-directory
shopify app generate extension --type checkout_ui_extension --name pickup-datetime
```

### 4. Replace Extension Code

Copy the `src/Checkout.jsx` content into your generated extension's source file.

Copy the `shopify.extension.toml` configuration.

### 5. Install Dependencies

```bash
cd extensions/pickup-datetime
npm install
```

### 6. Start Development Server

```bash
shopify app dev
```

### 7. Deploy to Production

```bash
shopify app deploy
```

## Features

- **Date Selection**: Shows available pickup dates based on cutoff time (6:30 PM)
- **Time Slots**: 30-minute intervals from 10:00 AM to 8:00 PM
- **Validation**: Blocks checkout until date and time are selected
- **Cart Attributes**: Saves selections as order attributes

## Customization

### Change Cutoff Time

In `Checkout.jsx`, modify:
```javascript
const cutoffHour = 18; // 6:30 PM cutoff
const cutoffMinute = 30;
```

### Change Time Slots

Modify the time slot generation loop:
```javascript
for (let hour = 10; hour < 20; hour++) { // Start hour and end hour
  for (let minute = 0; minute < 60; minute += 30) { // Interval
```

### Add Lead Days for Platters

You can add logic to check cart items and apply different lead times:
```javascript
// Check if cart contains platter items
const hasPlatter = cartLines.some(line => 
  line.merchandise.product.tags.includes('platter')
);
const leadDays = hasPlatter ? 3 : 0;
```

## Extension Targets

This extension uses `purchase.checkout.delivery-address.render-after` to appear after the delivery section.

Other available targets:
- `purchase.checkout.block.render` - Main checkout area
- `purchase.checkout.pickup-point-list.render-before` - Before pickup locations
- `purchase.checkout.pickup-point-list.render-after` - After pickup locations
- `purchase.checkout.shipping-option-list.render-after` - After shipping options

## Support

For issues with Checkout UI Extensions, refer to:
- [Shopify Checkout UI Extensions Docs](https://shopify.dev/docs/api/checkout-ui-extensions)
- [Shopify Partners Forum](https://community.shopify.com/c/shopify-partners/ct-p/partners)



