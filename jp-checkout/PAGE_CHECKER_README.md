# Shopify Page & Link Checker

A standalone Python tool to check for **active pages** (About, Contact, Blog, etc.) and dead links in any Shopify store.

## Quick Start

1. **Install Python packages:**
   ```bash
   pip install requests beautifulsoup4
   ```

2. **Run the script:**
   ```bash
   python shopify_product_checker.py https://yourstore.myshopify.com
   ```

   Or with a custom domain:
   ```bash
   python shopify_product_checker.py https://yourstore.com
   ```

## What It Checks

✅ **Active Pages** - All published pages that are live on your store  
❌ **Unpublished Pages** - Draft pages that aren't public  
🔗 **Links** - All links found in page content  
💀 **Dead Links** - Links that return errors or don't work  

## Example Output

```
🚀 Starting Shopify Page & Link Checker
📍 Store: https://mystore.myshopify.com

📄 Fetched 15 pages so far...
🔍 Analyzing pages...

🔍 Found 25 links. Check them for dead links? (y/n): y

================================================================================
📊 SHOPIFY PAGE & LINK CHECKER REPORT
================================================================================

📄 PAGE SUMMARY
  Total Pages: 15
  ✅ Published (Live): 12
  ❌ Unpublished/Draft: 3

🔗 LINK SUMMARY
  Total Links Found: 25
  Links Checked: 25
  ✅ Working Links: 23
  ❌ Dead Links: 2

✅ PUBLISHED (LIVE) PAGES (12)
  • About Us
    URL: https://mystore.myshopify.com/pages/about-us
  • Contact
    URL: https://mystore.myshopify.com/pages/contact
  ...
```

## Report File

The tool automatically saves a JSON report file (`shopify_pages_report_<timestamp>.json`) with all the details.

## Notes

- Uses the public Storefront API (no authentication needed)
- Only shows published pages that are live
- Link checking is optional (can be slow for many links)
- Works with both `.myshopify.com` and custom domains




