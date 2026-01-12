<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'erp_connection_id',
        'category_mapping_id',
        'erp_product_code',
        'erp_product_name',
        'erp_category_code',
        'shopify_product_id',
        'shopify_product_handle',
        'shopify_product_title',
        'is_active',
        'sync_price',
        'sync_inventory',
        'sync_title',
        'sync_description',
        'last_synced_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'sync_price' => 'boolean',
        'sync_inventory' => 'boolean',
        'sync_title' => 'boolean',
        'sync_description' => 'boolean',
        'last_synced_at' => 'datetime',
    ];

    /**
     * Get the Shopify store for this mapping.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the ERP connection for this mapping.
     */
    public function erpConnection(): BelongsTo
    {
        return $this->belongsTo(ErpConnection::class);
    }

    /**
     * Get the category mapping for this product.
     */
    public function categoryMapping(): BelongsTo
    {
        return $this->belongsTo(CategoryMapping::class);
    }

    /**
     * Get the SKU mappings (variants) for this product.
     */
    public function skuMappings(): HasMany
    {
        return $this->hasMany(SkuMapping::class);
    }

    /**
     * Check if mapped to a Shopify product.
     */
    public function isMapped(): bool
    {
        return !empty($this->shopify_product_id);
    }

    /**
     * Check if this product needs syncing.
     */
    public function needsSync(): bool
    {
        return $this->is_active && $this->isMapped();
    }

    /**
     * Scope a query to only include active mappings.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include mapped products.
     */
    public function scopeMapped($query)
    {
        return $query->whereNotNull('shopify_product_id');
    }

    /**
     * Scope a query to only include unmapped products.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereNull('shopify_product_id');
    }

    /**
     * Scope a query to products that need price sync.
     */
    public function scopeSyncPrice($query)
    {
        return $query->where('sync_price', true);
    }

    /**
     * Scope a query to products that need inventory sync.
     */
    public function scopeSyncInventory($query)
    {
        return $query->where('sync_inventory', true);
    }

    /**
     * Get the display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->shopify_product_title ?: $this->erp_product_name ?: $this->erp_product_code;
    }

    /**
     * Get the Shopify product URL.
     */
    public function getShopifyUrlAttribute(): ?string
    {
        if (!$this->shopify_product_id || !$this->shopifyStore) {
            return null;
        }

        return "https://{$this->shopifyStore->domain}/admin/products/{$this->shopify_product_id}";
    }
}
