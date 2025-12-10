# Shopify Product & Link Checker

A standalone Python tool to check for active products and dead links in any Shopify store.

## Features

- ✅ **No Authentication Required** - Uses public Storefront API
- 📦 **Product Analysis** - Checks active vs unavailable products
- 🔗 **Link Detection** - Extracts all links from product descriptions
- ❌ **Dead Link Detection** - Checks if links are working
- 📊 **Comprehensive Report** - Generates detailed JSON report
- 🚀 **Easy to Use** - Just paste your store URL

## Installation

1. **Install Python 3.7+** (if not already installed)

2. **Install required packages:**
   ```bash
   pip install -r requirements.txt
   ```

   Or install manually:
   ```bash
   pip install requests beautifulsoup4
   ```

## Usage

### Basic Usage (Store URL only)

```bash
python shopify_product_checker.py https://yourstore.myshopify.com
```

Or with a custom domain:
```bash
python shopify_product_checker.py https://yourstore.com
```

### What It Does

1. **Fetches all products** from your store using the Storefront API
2. **Analyzes product status** (active, unavailable, etc.)
3. **Extracts links** from product descriptions
4. **Optionally checks links** to see if they're dead
5. **Generates a report** in the console and saves a JSON file

### Example Output

```
🚀 Starting Shopify Product & Link Checker
📍 Store: https://mystore.myshopify.com

📦 Fetched 25 products so far...
🔍 Analyzing products...

🔍 Found 15 links. Check them for dead links? (y/n): y

🔍 Checking 15 links...
  [15/15] Checking: https://example.com/product...

================================================================================
📊 SHOPIFY PRODUCT & LINK CHECKER REPORT
================================================================================

📦 PRODUCT SUMMARY
  Total Products: 25
  ✅ Active: 20
  ❌ Unavailable: 5

🔗 LINK SUMMARY
  Total Links Found: 15
  Links Checked: 15
  ✅ Working Links: 13
  ❌ Dead Links: 2
  🏠 Internal Links: 8
  🌐 External Links: 7

❌ DEAD LINKS (2)
  • https://broken-link.com
    Error: Connection Error
  • https://another-broken.com
    Status: 404

💾 Full report saved to: shopify_report_1234567890.json
================================================================================
```

## Report File

The tool generates a JSON report file (`shopify_report_<timestamp>.json`) with:
- Product summary statistics
- Full product list with status
- All links found
- Dead links with error details

## Limitations

1. **Storefront API Only**: This uses the public Storefront API, which means:
   - ✅ No authentication needed
   - ⚠️ Can't see draft/archived products
   - ⚠️ Limited product details compared to Admin API

2. **Link Checking**:
   - Some sites block automated requests (CORS, rate limiting)
   - Internal Shopify links may not be fully verifiable
   - Timeout is set to 10 seconds per link

3. **Rate Limiting**:
   - The tool includes delays to respect Shopify's rate limits
   - For very large stores, it may take several minutes

## Advanced Usage (Admin API)

If you need to check draft/archived products, you can use the Admin API:

1. Create a private app in Shopify Admin
2. Get the Admin API access token
3. Use it with the script (future enhancement)

## Troubleshooting

**Error: "No products found"**
- Make sure your store URL is correct
- Check if your store has products
- Some stores may have restrictions on the Storefront API

**Error: "Connection Error"**
- Check your internet connection
- The store might be temporarily unavailable

**Slow Performance**
- Large stores (1000+ products) will take time
- Link checking adds additional time (optional)

## Notes

- The tool respects rate limits with built-in delays
- Link checking is optional to save time
- Reports are saved automatically for later review
- All links are checked with a 10-second timeout




