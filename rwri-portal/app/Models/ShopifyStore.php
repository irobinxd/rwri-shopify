<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ShopifyStore extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'domain',
        'api_key',
        'api_secret',
        'access_token',
        'api_version',
        'is_active',
        'settings',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
        'api_secret' => 'encrypted',
        'access_token' => 'encrypted',
    ];

    protected $hidden = [
        'api_key',
        'api_secret',
        'access_token',
    ];

    /**
     * Get the ERP connection for this store.
     */
    public function erpConnection(): HasOne
    {
        return $this->hasOne(ErpConnection::class);
    }

    /**
     * Get the location mappings for this store.
     */
    public function locationMappings(): HasMany
    {
        return $this->hasMany(StoreLocationMapping::class);
    }

    /**
     * Get the category mappings for this store.
     */
    public function categoryMappings(): HasMany
    {
        return $this->hasMany(CategoryMapping::class);
    }

    /**
     * Get the product mappings for this store.
     */
    public function productMappings(): HasMany
    {
        return $this->hasMany(ProductMapping::class);
    }

    /**
     * Get the SKU mappings for this store.
     */
    public function skuMappings(): HasMany
    {
        return $this->hasMany(SkuMapping::class);
    }

    /**
     * Get the inventory snapshots for this store.
     */
    public function inventorySnapshots(): HasMany
    {
        return $this->hasMany(InventorySnapshot::class);
    }

    /**
     * Get the sync jobs for this store.
     */
    public function syncJobs(): HasMany
    {
        return $this->hasMany(SyncJob::class);
    }

    /**
     * Get the sync logs for this store.
     */
    public function syncLogs(): HasMany
    {
        return $this->hasMany(SyncLog::class);
    }

    /**
     * Get the Shopify locations (pulled from Shopify).
     */
    public function shopifyLocations(): HasMany
    {
        return $this->hasMany(ShopifyLocation::class);
    }

    /**
     * Get the Shopify collections (pulled from Shopify).
     */
    public function shopifyCollections(): HasMany
    {
        return $this->hasMany(ShopifyCollection::class);
    }

    /**
     * Get the Shopify products (pulled from Shopify).
     */
    public function shopifyProducts(): HasMany
    {
        return $this->hasMany(ShopifyProduct::class);
    }

    /**
     * Get the Shopify variants (pulled from Shopify).
     */
    public function shopifyVariants(): HasMany
    {
        return $this->hasMany(ShopifyVariant::class);
    }

    /**
     * Get the Shopify inventory levels (pulled from Shopify).
     */
    public function shopifyInventoryLevels(): HasMany
    {
        return $this->hasMany(ShopifyInventoryLevel::class);
    }

    /**
     * Scope a query to only include active stores.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the full Shopify admin URL.
     */
    public function getAdminUrlAttribute(): string
    {
        return "https://{$this->domain}/admin";
    }
}
