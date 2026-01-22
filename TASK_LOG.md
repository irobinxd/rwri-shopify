# Task Log

**Last Updated:** January 22, 2026

## December 22, 2025 - Store Selector Initial Implementation
Initial setup and implementation of store selector functionality. Created base store selector modal structure and store selection logic. Set up store configuration system to handle multiple pickup locations.

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/snippets/store-selector-modal.liquid`

**Date Completed:** December 22, 2025

---

## December 23, 2025 - Product Availability Integration
Implemented product availability checking at selected stores. Added API calls to fetch variant availability for each location. Created logic to check if products are available at the selected pickup location before adding to cart.

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/assets/component-pickup-availability.js`

**Date Completed:** December 23, 2025

---

## December 24, 2025 - Console Log Fixes & Performance Optimization
Fixed continuous console logging issue caused by MutationObserver triggering excessive calls. Removed redundant MutationObserver instances. Optimized store selector initialization to prevent multiple simultaneous checks. Improved performance by debouncing store availability checks.

**Files:**
- `jp-home/assets/store-selector.js`

**Date Completed:** December 24, 2025

---

## December 26, 2025 - Add to Cart Button Logic & Message Display Fixes
Fixed "Add to Cart" button not disabling when product unavailable at selected store. Implemented proper state management for button enable/disable based on product availability. Fixed special character display issues by decoding HTML entities in messages. Removed outdated "choose shipping" mentions from store selection messages.

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/snippets/store-header-indicator.liquid`

**Date Completed:** December 26, 2025

---

## December 29, 2025 - Store Matching Logic Refinement
Refined store matching logic to correctly handle different pickup types (in-store vs curbside). Improved location handle matching to prevent false positives between similar store names. Implemented stricter validation for location availability. Shortened product thumbnail warning to "Not Available" and ensured it only displays on product page.

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/snippets/store-header-indicator.liquid`

**Date Completed:** December 29, 2025

---

## December 30, 2025 - Store Selector UI Polish & Testing
Finalized store selector UI improvements. Tested cross-browser compatibility. Verified store selection persistence across page reloads. Completed documentation for store selector functionality.

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/snippets/store-selector-modal.liquid`
- `jp-home/snippets/store-header-indicator.liquid`

**Date Completed:** December 30, 2025

---

## January 2, 2026 - Laravel Project Initial Setup
Started Laravel project setup for rwri-portal. Identified PHP version compatibility issues. Updated PHP requirements to version 8.2. Initialized Laravel project structure and dependencies.

**Files:**
- `rwri-portal/composer.json`
- `rwri-portal/.env`

**Date Completed:** January 2, 2026

---

## January 3, 2026 - Laravel Bootstrap & Environment Configuration
Fixed Laravel bootstrap issues including missing .env configuration and APP_KEY generation. Resolved OPcache clearing issues. Set up proper environment variables and application key. Configured database connections.

**Files:**
- `rwri-portal/.env`
- `rwri-portal/app/Console/Kernel.php`

**Date Completed:** January 3, 2026

---

## January 4, 2026 - Laravel Database & Command Loader Fixes
Fixed MySQL/InnoDB corruption issues. Created custom ContainerCommandLoader to resolve "Call to a member function make() on null" error. Updated database seeders and factories. Ensured proper database migration setup.

**Files:**
- `rwri-portal/app/Console/ContainerCommandLoader.php`
- `rwri-portal/database/seeders/UsersSeeder.php`
- `rwri-portal/database/factories/UserFactory.php`

**Date Completed:** January 4, 2026

---

## January 5, 2026 - Floating Pickup Location Selector
Fixed floating pickup location selector not displaying on mobile devices. Adjusted positioning to be above chat button with proper spacing. Changed icon to pin location icon with tooltip showing selected store on hover. Made modal close automatically after store selection. Fixed z-index issues to prevent interference with chat widget.

**Files:**
- `jp-home/snippets/store-header-indicator.liquid`
- `jp-home/snippets/store-selector-modal.liquid`
- `jp-home/assets/store-selector.js`

**Date Completed:** January 5, 2026

---

## January 6, 2026 - Cart Location Display & Application Branding
Added display of selected pickup location in cart page below "Shopping Cart" title with "Change" button to open store selection modal. Changed Laravel app title from "Laravel" to "RWRI Portal". Updated logo references throughout application to use `Royal-logo.avif`. Fixed route names for modules and menus. Updated sidebar menu to show all menu items for administrators. Changed sidebar color from black to royal blue (#002DC8) to match logo.

**Files:**
- `jp-home/sections/main-cart.liquid`
- `rwri-portal/.env`
- `rwri-portal/public/assets/css/royal-branding.css`
- `rwri-portal/resources/views/layout/partials/sidebar-layout/sidebar/_logo.blade.php`
- `rwri-portal/resources/views/layout/partials/header-layout/_header.blade.php`
- `rwri-portal/resources/views/pages/auth/login.blade.php`
- `rwri-portal/resources/views/layout/partials/sidebar-layout/sidebar/_footer.blade.php`
- `rwri-portal/resources/views/layout/partials/header-layout/_footer.blade.php`
- `rwri-portal/resources/views/layout/partials/sidebar-layout/sidebar/_menu.blade.php`
- `rwri-portal/config/settings.php`

**Date Completed:** January 6, 2026

---

## January 7, 2026 - Cart-Based Location Selection Implementation
Removed location selection modal and pin button from home/product pages. Moved location selection exclusively to cart page. Implemented detection of multiple locations in cart with customer-friendly notifications. Added prompt when selecting location with fewer items (option to remove incompatible items). Ensured only one pickup location can be selected in cart for smooth checkout. Fixed CORS errors by adding `mode: 'same-origin'` and `credentials: 'same-origin'` to fetch requests. Fixed validation logic to correctly check item availability using exact handle matching and class checks (`alert--success` vs `alert--note`). Implemented stricter location matching to prevent false positives (e.g., "curbside" vs "in-store").

**Files:**
- `jp-home/assets/store-selector.js`
- `jp-home/snippets/store-header-indicator.liquid`
- `jp-home/sections/main-cart.liquid`
- `jp-home/assets/component-pickup-availability.js`
- `jp-home/layout/theme.liquid`

**Date Completed:** January 7, 2026

---

---

## January 8, 2026 - Cart Location Conflict Resolution & UI Improvements
Fixed modal display issues when no single location can fulfill all cart items. Simplified conflict logic to only show warning when no single location can fulfill ALL items. Added loading modal during store selection to show "Checking item availability..." status. Implemented loading state on "Remove & Continue" button with spinner and "Removing items..." text. Created user-friendly "Better Location" modal to suggest pickup locations with more available items. Updated modal to consider item quantities (not just distinct item counts) when comparing locations. Made modal buttons take direct action (remove items or switch location) instead of showing additional modals. Removed footer text "You'll only see products available at your selected store..." from store selector modal. Fixed modal z-index to ensure it appears above all other elements. Added loading state to "Select Pickup Location" button. Implemented checkout button control to remain disabled until all location conflicts are resolved.

**Files:**
- `jp-home/sections/main-cart.liquid`
- `jp-home/snippets/store-selector-modal.liquid`

**Date Completed:** January 8, 2026

---

## January 9, 2026 - Order Attributes Fix: Pickup Date from Cart to Order & Email
Fixed issue where pickup date and time attributes were not appearing in Shopify admin order details or customer email notifications after theme update. Restored order attributes display in customer order page by adding Liquid code to iterate through `order.note_attributes` and display pickup date/time information. Fixed cart form submission to ensure attributes are properly saved before checkout redirect. Increased delay from 200ms to 500ms before redirecting to checkout to prevent race condition. Added console logging to verify attributes are successfully saved in API response. Verified attributes appear in order confirmation emails and admin order details.

**Files:**
- `jp-home-current/sections/customers-order.liquid`
- `jp-home-current/snippets/cart-form-page.liquid`

**Date Completed:** January 9, 2026

---

## January 9, 2026 - Standard Operating Procedures (SOP) Documentation
Created comprehensive SOP documentation for troubleshooting common Shopify theme issues. Documented step-by-step procedures with checklists for: Order Attributes Not Appearing in Admin/Email, and Freebie (WellnessBoost Buy 2 Get 1) Not Working. Each SOP includes context, detailed troubleshooting steps, action items, and file locations for quick reference. Documentation serves as a maintenance guide for the support team.

**Files:**
- `SOP_TROUBLESHOOTING.md`

**Date Completed:** January 9, 2026

---

## January 11, 2026 - Web Stores Integration Database Schema & Models
Created comprehensive database schema and Eloquent models for the Royal Store Shopify x JDA integration. Built foundation for modular ERP integration supporting both JDA (IBM DB2 direct queries) and ERPNext (API-based) connections.

**Database Migrations Created (9 tables):**
- `shopify_stores` - Store Shopify API credentials, domain, settings
- `erp_connections` - ERP connection config (supports JDA/DB2 and ERPNext/API)
- `store_location_mappings` - Map Shopify locations to JDA store codes with allocation %
- `category_mappings` - Map JDA categories to Shopify collections
- `product_mappings` - Map JDA products to Shopify products with sync options
- `sku_mappings` - Map JDA SKUs to Shopify variants with price/inventory data
- `inventory_snapshots` - Track inventory levels with allocation percentage
- `sync_jobs` - Track sync job runs with progress and timing
- `sync_logs` - Detailed operation logs for debugging

**Eloquent Models Created (9 models):**
- `ShopifyStore`, `ErpConnection`, `StoreLocationMapping`, `CategoryMapping`
- `ProductMapping`, `SkuMapping`, `InventorySnapshot`, `SyncJob`, `SyncLog`
- All models include proper relationships, scopes, helper methods, and encrypted fields

**Shopify Data Pull Tables (5 tables):**
- `shopify_locations` - Cache pulled Shopify locations for mapping
- `shopify_collections` - Cache pulled Shopify collections (smart/custom)
- `shopify_products` - Cache pulled Shopify products with metadata
- `shopify_variants` - Cache pulled Shopify variants/SKUs with pricing
- `shopify_inventory_levels` - Cache pulled inventory levels by location

**Shopify Data Pull Models (5 models):**
- `ShopifyLocation`, `ShopifyCollection`, `ShopifyProduct`, `ShopifyVariant`, `ShopifyInventoryLevel`
- All with relationships, scopes, and helper methods for mapping workflows

**Module Seeder:**
- Created `WebStoresModuleSeeder` to register Web Stores module and Royal Store sub-module
- Added menu items for Dashboard, Stores, Shopify Pull, Locations, Categories, Products, Inventory, SKU Mappings, Sync Jobs, Sync Logs, Settings

**Timeline Updates:**
- Added notes section about concurrent tasks (Shopify theme maintenance for joelsplace.com and royalstore.com.au)

**Files:**
- `rwri-portal/database/migrations/2026_01_11_100001_create_shopify_stores_table.php`
- `rwri-portal/database/migrations/2026_01_11_100002_create_erp_connections_table.php`
- `rwri-portal/database/migrations/2026_01_11_100003_create_store_location_mappings_table.php`
- `rwri-portal/database/migrations/2026_01_11_100004_create_category_mappings_table.php`
- `rwri-portal/database/migrations/2026_01_11_100005_create_product_mappings_table.php`
- `rwri-portal/database/migrations/2026_01_11_100006_create_sku_mappings_table.php`
- `rwri-portal/database/migrations/2026_01_11_100007_create_inventory_snapshots_table.php`
- `rwri-portal/database/migrations/2026_01_11_100008_create_sync_jobs_table.php`
- `rwri-portal/database/migrations/2026_01_11_100009_create_sync_logs_table.php`
- `rwri-portal/database/migrations/2026_01_11_100010_create_shopify_locations_table.php`
- `rwri-portal/database/migrations/2026_01_11_100011_create_shopify_collections_table.php`
- `rwri-portal/database/migrations/2026_01_11_100012_create_shopify_products_table.php`
- `rwri-portal/database/migrations/2026_01_11_100013_create_shopify_variants_table.php`
- `rwri-portal/database/migrations/2026_01_11_100014_create_shopify_inventory_levels_table.php`
- `rwri-portal/app/Models/ShopifyStore.php`
- `rwri-portal/app/Models/ErpConnection.php`
- `rwri-portal/app/Models/StoreLocationMapping.php`
- `rwri-portal/app/Models/CategoryMapping.php`
- `rwri-portal/app/Models/ProductMapping.php`
- `rwri-portal/app/Models/SkuMapping.php`
- `rwri-portal/app/Models/InventorySnapshot.php`
- `rwri-portal/app/Models/SyncJob.php`
- `rwri-portal/app/Models/SyncLog.php`
- `rwri-portal/app/Models/ShopifyLocation.php`
- `rwri-portal/app/Models/ShopifyCollection.php`
- `rwri-portal/app/Models/ShopifyProduct.php`
- `rwri-portal/app/Models/ShopifyVariant.php`
- `rwri-portal/app/Models/ShopifyInventoryLevel.php`
- `rwri-portal/database/seeders/WebStoresModuleSeeder.php`
- `rwri-portal/database/seeders/DatabaseSeeder.php`
- `TIMELINE_ROYAL_SHOPIFY_JDA_INTEGRATION.md`
- `TIMELINE_ROYAL_SHOPIFY_JDA_INTEGRATION.csv`

**Date Completed:** January 11, 2026

---

## January 12, 2026 - Product Icon Labels Display Fix & Configuration

**Shopify Theme - Product Icon Labels Initial Fix:**
- Investigated product icon labels not displaying on product cards despite correct asset files and metafield setup
- Identified that theme expected metafield references in theme settings, not direct label text
- Fixed `product-item.liquid` to correctly parse metafield references for icon labels
- Updated `product-icon-label.liquid` to load images from Shopify's `Content > Files` with fallback to `assets` folder
- Ensured icon labels display correctly on product cards when metafield is properly configured

**Files:**
- `jp-home/snippets/product-item.liquid`
- `jp-home/snippets/product-icon-label.liquid`

**Date Completed:** January 12, 2026

---

## January 13, 2026 - RWRI Portal: Database Schema Optimization & Product Icon Labels Display Limits

**RWRI Portal - Database Schema Optimization:**
- Reviewed and optimized database migrations for the Shopify x JDA integration
- Added proper index naming conventions to improve query performance and database management
- Updated foreign key constraints and unique indexes across all Shopify data pull tables

**Shopify Theme - Icon Display Limits & Collection Page Integration:**
- Implemented display limit of 3 icon labels on product cards (homepage/collection pages) while showing all 5 on product detail page
- Added icon count logic to prevent displaying more than 3 icons per product card
- Updated collection page template to include `icons` block in product grid
- Updated homepage templates to include `icons` block in featured collections and shop-the-look sections
- Fixed missing icon blocks in `collection.json` and `index.json` templates

**Files:**
- `rwri-portal/database/migrations/2026_01_11_100010_create_shopify_locations_table.php`
- `rwri-portal/database/migrations/2026_01_11_100011_create_shopify_collections_table.php`
- `rwri-portal/database/migrations/2026_01_11_100012_create_shopify_products_table.php`
- `rwri-portal/database/migrations/2026_01_11_100013_create_shopify_variants_table.php`
- `rwri-portal/database/migrations/2026_01_11_100014_create_shopify_inventory_levels_table.php`
- `jp-home/snippets/product-item.liquid`
- `jp-home/templates/collection.json`
- `jp-home/templates/index.json`

**Date Completed:** January 13, 2026

---

## January 14, 2026 - RWRI Portal Module Access, Cart UI Improvements & Product Page Icon Labels

**RWRI Portal - Module Access Control:**
- Updated `WebStoresModuleSeeder` to automatically assign Web Stores and Royal Store modules to all users
- Implemented universal access by setting department_id, location_id, and group_id to null
- Added duplicate check to prevent multiple module assignments per user
- Ensured all administrators have access to the new Web Stores integration features

**Shopify Theme - Cart Modal UI Refinements:**
- Updated cart modal styling for consistent design language across all dialogs
- Changed all modal buttons to pillbox shape (`border-radius: 50px`) for modern appearance
- Implemented Joel's Place green (`#70a062`) color scheme for primary action buttons
- Removed duplicate warning icons (⚠️ emoji) - kept only SVG icons for cleaner, less alarming UI
- Updated button text for better clarity: "Items" → "Item/s", "Remove & Continue" → "Remove and Continue"
- Changed "Remove and Continue" button color to warning red (`rgb(212, 64, 14)`) for better visual hierarchy
- Added hover effects with transform and shadow for improved interactivity
- Implemented consistent button styling across all cart conflict resolution modals

**Shopify Theme - Product Page Icon Labels Repositioning & CSV Template:**
- Moved icon labels list on product view page to appear below price and above quantity/add to cart button
- Changed icon display style to icon-only with tooltips on product page (matching product cards)
- Fixed duplicate price display issue by disabling price in `buy_buttons` block
- Maintained original price size using `text-size--heading` class
- Created CSV template with 5 metafield columns for product icon labels import

**Files:**
- `rwri-portal/database/seeders/WebStoresModuleSeeder.php`
- `jp-home/sections/main-cart.liquid`
- `jp-home/sections/main-product.liquid`
- `jp-home/templates/product.json`
- `jp-home/CSV template with metafields.csv`

**Date Completed:** January 14, 2026

---

## January 15, 2026 - Custom Icon Label Filter Initial Implementation

**Shopify Theme - Custom Collection Filter Development:**
- Created custom client-side JavaScript filter for product icon labels on collection pages
- Built filter that scans products on page to dynamically generate filter options with product counts
- Implemented filter UI matching Shopify's native filter styling with checkboxes and counts
- Added filter to sidebar in `facets.liquid` snippet alongside native Shopify filters
- Filter works independently without requiring Shopify Admin filter configuration

**Files:**
- `jp-home/snippets/custom-icon-filter.liquid`
- `jp-home/snippets/facets.liquid`
- `jp-home/snippets/product-item.liquid` (added `data-icon-labels` attribute)

**Date Completed:** January 15, 2026

---

## January 16, 2026 - Custom Filter Event Handling & State Management

**Shopify Theme - Filter Functionality Improvements:**
- Fixed custom filter checkboxes preventing Shopify's form submission by removing `name` attribute
- Implemented event propagation blocking to prevent conflicts with Shopify's native filters
- Added global state management (`window.customIconFilterState`) to persist filter selections across AJAX updates
- Created MutationObserver to re-apply filters after Shopify's AJAX product grid updates
- Fixed filter state restoration after page reloads and AJAX navigation

**Files:**
- `jp-home/snippets/custom-icon-filter.liquid`
- `jp-home/assets/custom-icon-filter.js` (separated JavaScript logic)

**Date Completed:** January 16, 2026

---

## January 17, 2026 - Active Filter Tags & Styling Refinement

**Shopify Theme - Active Tags Display:**
- Implemented active filter tags display next to "Clear all" button matching Shopify's native filter tags
- Created tags that show selected icon labels as removable pills with × icon
- Styled tags to match Shopify's `active-facets__button` classes exactly
- Fixed font size and icon size to match native filter tags precisely
- Changed filter tag element from `<button>` to `<a>` tag for consistency with Shopify's implementation
- Fixed label clickability by ensuring proper event handling and native label behavior

**Files:**
- `jp-home/assets/custom-icon-filter.js`
- `jp-home/snippets/custom-icon-filter.liquid`

**Date Completed:** January 17, 2026

---

## January 18, 2026 - Filter Blinking Fix & Observer Optimization

**Shopify Theme - Filter Performance & Stability:**
- Fixed blinking issue on hover for custom filter tags caused by MutationObserver triggering recursive updates
- Added `updatingTags` flag to prevent recursive tag updates during DOM changes
- Optimized MutationObserver to ignore changes in `active-facets` containers to prevent infinite update loops
- Wrapped DOM updates in `requestAnimationFrame` to batch updates and prevent visual flashing
- Fixed syntax error (missing closing brace) in `custom-icon-filter.js` that caused filter to disappear
- Removed `updateActiveTags()` from grid observer - tags now only update when labels actually change
- Implemented smart update check to prevent unnecessary tag re-rendering

**Files:**
- `jp-home/assets/custom-icon-filter.js`
- `jp-home/snippets/custom-icon-filter.liquid`

**Date Completed:** January 18, 2026

---

## January 19, 2026 - Users List View & Role Modal Improvements

**RWRI Portal - User Management Module:**
- Created Users list view with DataTable integration for displaying user information
- Fixed sidebar visibility to show "User Management" menu item for all authenticated users
- Removed "Permissions" menu item from sidebar navigation
- Enhanced role selection modal in Roles page with improved layout
- Fixed "Select all" functionality in role modal to properly check/uncheck all permissions
- Resolved "No permissions given" display issue in role list when permissions were assigned
- Updated role modal to display "Menu Access" instead of permissions on the front
- Added "Administrator Access" checkbox that disables all other checkboxes and automatically checks all menus when enabled

**Files:**
- `rwri-portal/resources/views/pages/apps/user-management/users/list.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/roles/list.blade.php`
- `rwri-portal/resources/views/livewire/permission/role-modal.blade.php`
- `rwri-portal/app/Livewire/Permission/RoleModal.php`
- `rwri-portal/resources/views/layout/partials/sidebar-layout/sidebar/_menu.blade.php`

**Date Completed:** January 19, 2026

---

## January 20, 2026 - DataTable Initialization & Asset Loading Fixes

**RWRI Portal - DataTable Implementation:**
- Fixed Users DataTable not initializing by implementing native jQuery DataTable initialization
- Resolved 404 errors for missing asset files (datatables.bundle.css, datatables.bundle.js, widgets.js, chat.js, etc.)
- Fixed empty `datatables.bundle.js` file issue by switching to CDN-hosted DataTables
- Implemented `waitForDataTables` function to ensure DataTables library is loaded before initialization
- Added retry logic for table element availability before DataTable initialization
- Fixed Roles DataTable not triggering/loading by correcting column definitions and AJAX route configuration
- Updated `UsersDataTable.php` to filter users based on `is_super_admin` flag (only show super_admin users to super_admin users)
- Fixed "Store Owner" role not displaying in Roles list by correcting DataTable query

**Files:**
- `rwri-portal/resources/views/pages/apps/user-management/users/list.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/roles/list.blade.php`
- `rwri-portal/app/DataTables/UsersDataTable.php`
- `rwri-portal/app/DataTables/RolesDataTable.php`

**Date Completed:** January 20, 2026

---

## January 21, 2026 - KTSearch Error Fixes & DataTable CDN Implementation

**RWRI Portal - JavaScript Error Resolution:**
- Fixed `scripts.bundle.js:7903 Uncaught TypeError: searchObject.on is not a function` error
- Fixed `scripts.bundle.js:4285 Uncaught TypeError: Cannot read properties of null (reading 'addEventListener')` error
- Implemented JavaScript stub in `master.blade.php` to prevent KTSearch initialization errors
- Created Proxy object to intercept KTSearch property access and prevent null reference errors
- Removed all `data-kt-search-*` attributes from search-related partials to prevent conflicts
- Resolved Git worktree editing confusion by ensuring edits target correct working directory
- Finalized DataTables CDN implementation for both Users and Roles pages

**Files:**
- `rwri-portal/resources/views/layout/master.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/users/list.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/roles/list.blade.php`

**Date Completed:** January 21, 2026

---

## January 22, 2026 - User Edit Functionality & Password Management

**RWRI Portal - User Management Enhancements:**
- Implemented user edit functionality with edit button in users list actions menu
- Added password change capability in edit user modal (optional - leave blank to keep current password)
- Created migration to add `must_change_password` boolean field to users table
- Added "User must change password on next login" switch toggle in user edit modal
- Fixed name field handling to properly split full name into firstname, middlename, lastname
- Implemented Livewire event handling for edit button clicks with proper loading sequence
- Fixed Livewire "not defined" error by implementing wait functions for Livewire availability
- Added DataTable refresh functionality after user updates
- Updated `AddUserModal` component to support both create and edit modes
- Enhanced user edit modal to display "Edit User" title when in edit mode

**Files:**
- `rwri-portal/database/migrations/2026_01_22_052904_add_must_change_password_to_users_table.php`
- `rwri-portal/app/Models/User.php`
- `rwri-portal/app/Livewire/User/AddUserModal.php`
- `rwri-portal/resources/views/livewire/user/add-user-modal.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/users/list.blade.php`
- `rwri-portal/resources/views/pages/apps/user-management/users/columns/_actions.blade.php`
- `rwri-portal/app/DataTables/UsersDataTable.php`

**Date Completed:** January 22, 2026

---

**Note:** This log tracks all major changes and fixes made to the project.
