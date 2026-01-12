---
name: Shopify JDA/ERPNext Integration - 3-4 Month Plan
overview: Create an extensible ERP integration system in rwri-portal connecting Shopify stores with JDA (Royal Store - direct DB2 queries) and ERPNext (Joel's Place - API-based, future). Includes Products module (collection/category mapping, prices), Inventory module (allocation percentage, location mapping), Store Locations module, User Registration module (Employee/RPC Member validation), and Shopify theme modifications for both stores. Architecture designed to support both direct database queries (JDA) and API-based integrations (ERPNext).
todos:
  - id: phase1-migrations
    content: Create database migrations for stores, ERP connections, location mappings, SKU mappings, product mappings, inventory snapshots, sync jobs, and sync logs
    status: pending
  - id: phase1-models
    content: "Create Eloquent models: ShopifyStore, ErpConnection, StoreLocationMapping, SkuMapping, ProductMapping, InventorySnapshot, SyncJob, SyncLog"
    status: pending
    dependencies:
      - phase1-migrations
  - id: phase1-module-seeder
    content: Create WebStoresModuleSeeder to register Web Stores module and Royal Store sub-module in database with menus
    status: pending
    dependencies:
      - phase1-migrations
  - id: phase2-db2-driver
    content: Install and configure IBM DB2 driver/PDO support in Laravel database configuration
    status: pending
  - id: phase2-erp-interface
    content: Create ErpServiceInterface abstract contract with methods for products, inventory, and locations
    status: pending
  - id: phase2-jda-service
    content: Implement JdaErpService class implementing ErpServiceInterface with DB2 direct queries
    status: pending
    dependencies:
      - phase2-db2-driver
      - phase2-erp-interface
  - id: phase2-shopify-client
    content: Create ShopifyApiClient and service classes (ProductService, InventoryService) for Admin API integration
    status: pending
  - id: phase3-location-controller
    content: Create StoreLocationsController with CRUD operations for location mappings
    status: pending
    dependencies:
      - phase1-models
      - phase2-jda-service
      - phase2-shopify-client
  - id: phase3-location-service
    content: Create StoreLocationMappingService to handle Shopify location fetch, JDA store code fetch, and mapping logic
    status: pending
    dependencies:
      - phase2-jda-service
      - phase2-shopify-client
  - id: phase3-location-views
    content: Create Blade views for location mapping interface (index, create, edit) with mapping UI
    status: pending
    dependencies:
      - phase3-location-controller
  - id: phase4-category-mapping
    content: Create CategoryMappingsController and CategoryMappingService for manual JDA category to Shopify collection mapping
    status: pending
    dependencies:
      - phase2-jda-service
      - phase2-shopify-client
  - id: phase4-collection-mapping
    content: Create CollectionMappingsController and CollectionMappingService for manual product-to-collection assignments
    status: pending
    dependencies:
      - phase2-jda-service
      - phase2-shopify-client
  - id: phase4-product-sync
    content: Create ProductSyncService and SyncProductsJob to fetch products from JDA and create/update in Shopify
    status: pending
    dependencies:
      - phase4-category-mapping
      - phase4-collection-mapping
  - id: phase4-price-sync
    content: Create PriceSyncService and SyncPricesJob to sync prices from JDA to Shopify
    status: pending
    dependencies:
      - phase2-jda-service
      - phase4-product-sync
  - id: phase5-inventory-allocation
    content: Create InventoryAllocationController and service for configuring allocation percentages per product/location
    status: pending
    dependencies:
      - phase1-models
  - id: phase5-inventory-sync
    content: Create InventorySyncService and SyncInventoryJob to fetch JDA inventory, apply allocation percentage, and update Shopify by location
    status: pending
    dependencies:
      - phase3-location-service
      - phase5-inventory-allocation
  - id: phase5-sku-mapping
    content: Create SKU mapping interface for mapping JDA SKUs to Shopify variant IDs with auto-mapping support
    status: pending
    dependencies:
      - phase2-jda-service
      - phase2-shopify-client
  - id: phase6-royal-theme
    content: Modify Shopify theme files for Royal Store to display location-specific inventory and synced prices
    status: pending
    dependencies:
      - phase5-inventory-sync
      - phase4-price-sync
  - id: phase7-queue-setup
    content: Configure Laravel queue system (database driver) and create sync job classes with retry logic
    status: pending
    dependencies:
      - phase4-product-sync
      - phase5-inventory-sync
  - id: phase7-sync-dashboard
    content: Create SyncDashboardController and views showing sync status, statistics, and logs
    status: pending
    dependencies:
      - phase7-queue-setup
  - id: phase8-erpnext-prep
    content: Create ErpNextService skeleton and ErpServiceFactory for future ERPNext API integration, create Joel Place module structure
    status: pending
    dependencies:
      - phase2-erp-interface
  - id: phase9-joels-theme
    content: Modify Shopify theme files for Joels Place store with similar inventory and price display updates
    status: pending
    dependencies:
      - phase8-erpnext-prep
  - id: phase10-testing
    content: Write unit and integration tests for services, sync operations, and controllers
    status: pending
    dependencies:
      - phase7-sync-dashboard
  - id: phase10-documentation
    content: Create user guide, admin setup guide, API documentation, and troubleshooting guide
    status: pending
    dependencies:
      - phase10-testing
  - id: phase6-user-migrations
    content: Create database migrations for employees table (synced from HR), rpc_members table, and shopify_customers mapping table
    status: pending
    dependencies:
      - phase1-migrations
  - id: phase6-user-models
    content: "Create Eloquent models: Employee, RpcMember, ShopifyCustomer with relationships"
    status: pending
    dependencies:
      - phase6-user-migrations
  - id: phase6-hr-integration
    content: Create HrApiService to fetch/sync employee list from HR system for validation
    status: pending
    dependencies:
      - phase6-user-models
  - id: phase6-rpc-member-crud
    content: Create RpcMemberController with CRUD operations for store staff to create/manage RPC members in RWRI Portal
    status: pending
    dependencies:
      - phase6-user-models
  - id: phase6-shopify-customer-service
    content: Create ShopifyCustomerService to auto-create Shopify customers via Admin API and send email invitations
    status: pending
    dependencies:
      - phase2-shopify-client
      - phase6-user-models
  - id: phase6-validation-api
    content: Create API endpoint for Shopify theme to validate Employee ID or RPC membership before allowing signup
    status: pending
    dependencies:
      - phase6-hr-integration
      - phase6-rpc-member-crud
  - id: phase6-theme-signup
    content: Modify Royal Shopify theme signup page to require Employee ID or RPC validation via RWRI Portal API
    status: pending
    dependencies:
      - phase6-validation-api
---

# Shopify x JDA/ERPNext Integration - 3-4 Month Implementation Plan

## Overview

This plan implements a modular ERP integration system for connecting Shopify stores with ERPs, starting with Royal Store (JDA - IBM DB2 direct queries) and designed to be extensible for Joel's Place (ERPNext - API-based). Includes Shopify theme modifications for both stores.

**Timeline:** 12-16 weeks (3-4 months)

**Start Date:** January 10, 2026

**Target Completion:** April 10 - May 7, 2026

## Architecture Design

### Extensible ERP Integration Pattern

```
ERP Integration Service Layer
├── ErpServiceInterface (abstract contract)
├── JdaErpService (implements via DB2 direct queries)
└── ErpNextService (implements via REST API - future)
```

### Module Structure

```
rwri-portal/
└── Modules/
    └── Web Stores (parent module)
        ├── Royal Store (JDA)
        │   ├── Store Locations
        │   ├── Products
        │   └── Inventory
        └── Joel's Place (ERPNext) [Future Phase]
```

## Phase Breakdown

### **Phase 1: Foundation & Module Setup (Weeks 1-2)**

**Goal:** Set up module structure, database schema, and base architecture

#### Database Schema

1. **Shopify Stores Table**

   - Store configuration (shop domain, API credentials)
   - Store type (Royal Store, Joel's Place)

2. **ERP Connections Table**

   - Connection type (jda_db2, erpnext_api)
   - JDA: DB2 connection config (encrypted)
   - ERPNext: API endpoint, credentials (encrypted)

3. **Store Location Mappings Table**

   - Shopify location ID ↔ ERP store code
   - Location type (fulfillment, pickup, both)

4. **SKU Mappings Table**

   - ERP SKU ↔ Shopify Variant ID
   - Bidirectional mapping

5. **Product Mappings Table**

   - Category mappings (ERP category → Shopify collection)
   - Collection mappings (manual selection)

6. **Inventory Snapshots Table**

   - Cached inventory levels
   - Sync history

7. **Sync Jobs & Logs Tables**

   - Queue management
   - Sync history and errors

#### Module Setup

- Create "Web Stores" parent module in `modules` table
- Create "Royal Store" sub-module
- Set up menu structure in `menus` table
- Create module settings for store configuration

**Files to Create:**

- `database/migrations/xxxx_create_shopify_stores_table.php`
- `database/migrations/xxxx_create_erp_connections_table.php`
- `database/migrations/xxxx_create_store_location_mappings_table.php`
- `database/migrations/xxxx_create_sku_mappings_table.php`
- `database/migrations/xxxx_create_product_mappings_table.php`
- `database/migrations/xxxx_create_inventory_snapshots_table.php`
- `database/migrations/xxxx_create_sync_jobs_table.php`
- `database/migrations/xxxx_create_sync_logs_table.php`
- `app/Models/ShopifyStore.php`
- `app/Models/ErpConnection.php`
- `app/Models/StoreLocationMapping.php`
- `app/Models/SkuMapping.php`
- `app/Models/ProductMapping.php`
- `app/Models/InventorySnapshot.php`
- `app/Models/SyncJob.php`
- `app/Models/SyncLog.php`

**Database Seeder:**

- `database/seeders/WebStoresModuleSeeder.php` - Creates module and initial menus

---

### **Phase 2: JDA DB2 Connection & Base Service Layer (Weeks 3-4)**

**Goal:** Establish DB2 connection and create extensible service architecture

#### JDA DB2 Connection

1. **Install DB2 Driver**

   - Add `ibm/db2` or PDO DB2 support
   - Configure connection in `config/database.php`

2. **Connection Manager**

   - Secure credential storage
   - Connection pooling
   - Error handling

3. **Query Builder Service**

   - Abstracted query interface
   - Prepared statements
   - Result mapping

#### Service Layer Architecture

1. **Base ERP Service Interface**

   - Abstract methods for Products, Inventory, Locations
   - Extensible for ERPNext API implementation

2. **JDA ERP Service Implementation**

   - DB2 queries for products
   - DB2 queries for inventory
   - DB2 queries for locations/store codes

3. **Shopify API Client**

   - Admin API wrapper
   - OAuth token management
   - Rate limiting

**Files to Create:**

- `app/Services/Erp/Contracts/ErpServiceInterface.php`
- `app/Services/Erp/Jda/JdaErpService.php`
- `app/Services/Erp/Jda/JdaConnectionManager.php`
- `app/Services/Erp/Jda/JdaQueryBuilder.php`
- `app/Services/Shopify/ShopifyApiClient.php`
- `app/Services/Shopify/ShopifyProductService.php`
- `app/Services/Shopify/ShopifyInventoryService.php`
- `config/database.php` (add DB2 config)
- `config/erp.php` (ERP connection configs)

---

### **Phase 3: Store Locations Module (Weeks 5-6)**

**Goal:** Location mapping interface and sync functionality

#### Features

1. **Location Mapping Interface**

   - List all Shopify locations
   - List all JDA store codes
   - Manual mapping interface (drag-drop or select)
   - Location type selection (fulfillment/pickup/both)

2. **Location Sync**

   - Fetch Shopify locations via API
   - Fetch JDA store codes from DB2
   - Bidirectional mapping display

3. **Location Management UI**

   - CRUD interface
   - Bulk import/export
   - Validation (prevent duplicates)

**Files to Create:**

- `app/Http/Controllers/WebStores/StoreLocationsController.php`
- `app/Services/StoreLocationMappingService.php`
- `resources/views/pages/web-stores/royal-store/locations/index.blade.php`
- `resources/views/pages/web-stores/royal-store/locations/create.blade.php`
- `resources/views/pages/web-stores/royal-store/locations/edit.blade.php`

---

### **Phase 4: Products Module - Collection & Category Mapping (Weeks 7-9)**

**Goal:** Product sync with collection and category mapping

#### Features

1. **Category Mapping Interface**

   - List JDA categories from DB2
   - List Shopify collections
   - Manual mapping interface
   - Bulk mapping support

2. **Collection Mapping Interface**

   - Map JDA products to Shopify collections
   - Manual product-to-collection assignment
   - Rule-based mapping (optional future enhancement)

3. **Product Sync Service**

   - Fetch products from JDA (via DB2)
   - Create/update products in Shopify
   - Handle product variants
   - Sync product metadata

4. **Price Sync**

   - Fetch prices from JDA
   - Update Shopify product/variant prices
   - Price change tracking

**Files to Create:**

- `app/Http/Controllers/WebStores/ProductsController.php`
- `app/Http/Controllers/WebStores/CategoryMappingsController.php`
- `app/Http/Controllers/WebStores/CollectionMappingsController.php`
- `app/Services/ProductSyncService.php`
- `app/Services/CategoryMappingService.php`
- `app/Services/CollectionMappingService.php`
- `app/Services/PriceSyncService.php`
- `app/Jobs/SyncProductsJob.php`
- `app/Jobs/SyncPricesJob.php`
- `resources/views/pages/web-stores/royal-store/products/` (views)
- `resources/views/pages/web-stores/royal-store/category-mappings/` (views)
- `resources/views/pages/web-stores/royal-store/collection-mappings/` (views)

---

### **Phase 5: Inventory Module - Allocation & Location Sync (Weeks 10-12)**

**Goal:** Inventory synchronization with allocation percentage and location mapping

#### Features

1. **Allocation Percentage Configuration**

   - Per-product allocation percentage
   - Per-location allocation rules
   - Default allocation settings

2. **Inventory Sync Service**

   - Fetch inventory from JDA (by store code/location)
   - Apply allocation percentage
   - Update Shopify inventory (by location ID)
   - Handle multi-location inventory

3. **Inventory Sync UI**

   - Dashboard showing sync status
   - Manual sync triggers
   - Allocation configuration interface
   - Inventory comparison view (JDA vs Shopify)

4. **SKU Mapping Management**

   - Map JDA SKUs to Shopify variants
   - Auto-mapping by barcode/SKU
   - Bulk import/export

**Files to Create:**

- `app/Http/Controllers/WebStores/InventoryController.php`
- `app/Http/Controllers/WebStores/InventoryAllocationController.php`
- `app/Services/InventorySyncService.php`
- `app/Services/InventoryAllocationService.php`
- `app/Jobs/SyncInventoryJob.php`
- `resources/views/pages/web-stores/royal-store/inventory/` (views)
- `resources/views/pages/web-stores/royal-store/inventory/allocation/` (views)

---

### **Phase 6: User Registration & Validation Module (Weeks 13-14)**

**Goal:** Ensure only employees and RPC members can create Royal Shopify accounts

#### Database Schema

1. **Employees Table**

   - Employee ID (unique identifier from HR)
   - Name, email
   - Status (active/inactive)
   - Synced from HR system

2. **RPC Members Table**

   - Member ID (unique identifier)
   - Name, email, phone
   - Membership details
   - Created by store staff
   - Status (active/inactive)

3. **Shopify Customers Mapping Table**

   - Link to Employee or RPC Member
   - Shopify Customer ID
   - Email verification status
   - Created timestamp

#### Features

1. **HR Employee Integration**

   - API or import to sync employee list from HR
   - Employee ID validation endpoint
   - Auto-sync schedule (optional)

2. **RPC Member Management (RWRI Portal)**

   - Store staff login to RWRI Portal
   - Create/edit/delete RPC members
   - Search and filter members
   - Export functionality

3. **Shopify Customer Creation**

   - Auto-create Shopify customer via Admin API
   - Send email invitation for password setup
   - Track customer status

4. **Validation API**

   - Endpoint: `/api/validate-user`
   - Accepts Employee ID or email
   - Returns validation status
   - Rate limiting for security

#### User Registration Flows

**Employee Flow:**

```
Employee → Royal Shopify → Enter Employee ID + Email → 
RWRI Portal API validates → If valid → Create Shopify Customer → 
Email verification sent
```

**RPC Member Flow:**

```
Store Staff → RWRI Portal → Create RPC Member → 
Auto-create Shopify Customer (API) → 
Email invitation sent to RPC Member → 
RPC Member sets password
```

**Files to Create:**

- `database/migrations/xxxx_create_employees_table.php`
- `database/migrations/xxxx_create_rpc_members_table.php`
- `database/migrations/xxxx_create_shopify_customers_table.php`
- `app/Models/Employee.php`
- `app/Models/RpcMember.php`
- `app/Models/ShopifyCustomer.php`
- `app/Http/Controllers/WebStores/EmployeesController.php`
- `app/Http/Controllers/WebStores/RpcMembersController.php`
- `app/Http/Controllers/Api/UserValidationController.php`
- `app/Services/HrApiService.php`
- `app/Services/ShopifyCustomerService.php`
- `app/Jobs/SyncEmployeesJob.php`
- `app/Jobs/CreateShopifyCustomerJob.php`
- `resources/views/pages/web-stores/royal-store/employees/` (views)
- `resources/views/pages/web-stores/royal-store/rpc-members/` (views)
- `routes/api.php` (validation endpoints)

---

### **Phase 7: Shopify Theme Modifications - Royal Store (Week 15)**

**Goal:** Theme updates to support integrated inventory/price display and custom signup

#### Theme Modifications

1. **Real-time Inventory Display**

   - Show location-specific inventory
   - Display allocation-aware quantities

2. **Price Display Updates**

   - Sync price changes automatically reflected

3. **Collection Filtering**

   - Display products based on mapped collections

4. **Custom Signup Flow**

   - Modified signup page with Employee ID / RPC validation
   - API call to RWRI Portal for validation
   - Error messages for invalid users

**Files to Modify:**

- `jp-home/snippets/product-item.liquid` (if exists)
- `jp-home/sections/product-form.liquid` (if exists)
- Custom Liquid snippets for inventory display
- `jp-home/templates/customers/register.liquid` (custom signup)
- `jp-home/assets/signup-validation.js` (validation script)

---

### **Phase 8: Sync Management & Queue System (Week 16)**

**Goal:** Queue system, scheduling, and monitoring

#### Features

1. **Laravel Queue Setup**

   - Database queue driver
   - Sync job classes
   - Retry logic

2. **Sync Dashboard**

   - Overview of sync operations
   - Success/failure statistics
   - Last sync timestamps

3. **Sync Logs & Error Handling**

   - Detailed logs
   - Error notifications
   - Retry failed syncs

**Files to Create:**

- `app/Http/Controllers/WebStores/SyncDashboardController.php`
- `app/Http/Controllers/WebStores/SyncLogController.php`
- `app/Listeners/SyncFailedListener.php`
- `resources/views/pages/web-stores/royal-store/dashboard/` (views)
- `routes/web.php` (sync API endpoints)

---

### **Phase 9: ERPNext API Architecture Preparation (Week 17)**

**Goal:** Prepare architecture for ERPNext integration (not full implementation)

#### Tasks

1. **ERPNext Service Interface Implementation**

   - Create `ErpNextService` class implementing `ErpServiceInterface`
   - API client structure (HTTP client setup)
   - Configuration structure

2. **Service Factory Pattern**

   - Factory to instantiate correct service (JDA vs ERPNext)
   - Configuration-based selection

3. **Module Structure for Joel's Place**

   - Create "Joel's Place" sub-module in database
   - Menu structure (placeholder)
   - Settings structure

**Files to Create:**

- `app/Services/Erp/ErpNext/ErpNextService.php` (skeleton)
- `app/Services/Erp/ErpNext/ErpNextApiClient.php` (skeleton)
- `app/Services/Erp/ErpServiceFactory.php`
- Database seeder updates for Joel's Place module

---

### **Phase 10: Shopify Theme Modifications - Joel's Place (Week 18)**

**Goal:** Theme updates for Joel's Place store

#### Theme Modifications

1. **Similar updates as Royal Store**

   - Inventory display
   - Price sync display
   - Collection mapping display

**Files to Modify:**

- `jp-home/snippets/` (relevant snippets)
- `jp-home/sections/` (relevant sections)

---

### **Phase 11: Testing, Documentation & Deployment (Weeks 19-20 - Buffer)**

**Goal:** Comprehensive testing, documentation, and production deployment

#### Tasks

1. **Testing**

   - Unit tests for services
   - Integration tests for sync operations
   - UAT with Royal Store test environment

2. **Documentation**

   - User guide for module
   - Admin setup guide
   - API documentation (if applicable)
   - Troubleshooting guide

3. **Production Deployment**

   - Environment configuration
   - Queue worker setup
   - Monitoring setup

**Files to Create:**

- `tests/Unit/Services/` (test files)
- `tests/Feature/WebStores/` (feature tests)
- `docs/web-stores-module-guide.md`
- `docs/setup-guide.md`

---

## Timeline Summary

**Total Duration:** 14-20 weeks (3.5-5 months)

- **Weeks 1-2:** Foundation & Module Setup
- **Weeks 3-4:** JDA DB2 Connection & Service Layer
- **Weeks 5-6:** Store Locations Module
- **Weeks 7-9:** Products Module (Collection/Category Mapping, Prices)
- **Weeks 10-12:** Inventory Module (Allocation, Location Sync)
- **Weeks 13-14:** User Registration & Validation Module (Employee/RPC)
- **Week 15:** Shopify Theme - Royal Store (with custom signup)
- **Week 16:** Sync Management & Queue System
- **Week 17:** ERPNext Architecture Preparation
- **Week 18:** Shopify Theme - Joel's Place
- **Weeks 19-20:** Testing, Documentation & Deployment (Buffer)

## Key Architecture Decisions

1. **Service Interface Pattern:** All ERP operations go through `ErpServiceInterface`, allowing easy swapping between JDA (DB2) and ERPNext (API)

2. **Module System:** Leverages existing `Module` and `ModuleSetting` models for configuration

3. **Allocation Logic:** Inventory allocation percentage calculated before syncing to Shopify (e.g., JDA has 100 units, 50% allocation = sync 50 to Shopify)

4. **Location Mapping:** Supports both fulfillment and pickup locations, mapped via `StoreLocationMapping` model

5. **Manual Mapping Interfaces:** Collection and category mappings are manual admin selections for maximum control

## Dependencies & Prerequisites

1. **JDA DB2 Access:**

   - DB2 connection credentials
   - Database schema documentation
   - Network access to DB2 server

2. **Shopify Admin API:**

   - OAuth apps created for Royal Store and Joel's Place
   - Admin API access tokens
   - Required scopes: `read_products`, `write_products`, `read_inventory`, `write_inventory`, `read_customers`, `write_customers`

3. **Shopify Locations:**

   - Existing locations configured in Shopify
   - Location IDs documented

4. **HR System Integration (for Employee Validation):**

   - HR API access or employee list export capability
   - Employee ID format documentation
   - Sync frequency requirements

5. **ERPNext (Future):**

   - API credentials (when ready for Phase 2)
   - API documentation

## Success Criteria

1. ✅ Products sync from JDA to Shopify with collection/category mappings
2. ✅ Inventory syncs with allocation percentage applied
3. ✅ Store locations mapped between Shopify and JDA
4. ✅ Manual mapping interfaces functional
5. ✅ Queue system handles sync operations reliably
6. ✅ Architecture ready for ERPNext integration
7. ✅ Shopify themes updated for both stores
8. ✅ Only validated employees and RPC members can register on Royal Shopify
9. ✅ Store staff can create RPC members in RWRI Portal
10. ✅ Comprehensive documentation complete