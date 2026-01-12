<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SkuMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'erp_connection_id',
        'product_mapping_id',
        'erp_sku',
        'erp_barcode',
        'erp_upc',
        'shopify_variant_id',
        'shopify_sku',
        'shopify_barcode',
        'erp_price',
        'erp_compare_price',
        'erp_inventory_qty',
        'is_active',
        'last_synced_at',
    ];

    protected $casts = [
        'erp_price' => 'decimal:2',
        'erp_compare_price' => 'decimal:2',
        'erp_inventory_qty' => 'integer',
        'is_active' => 'boolean',
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
     * Get the product mapping for this SKU.
     */
    public function productMapping(): BelongsTo
    {
        return $this->belongsTo(ProductMapping::class);
    }

    /**
     * Get the inventory snapshots for this SKU.
     */
    public function inventorySnapshots(): HasMany
    {
        return $this->hasMany(InventorySnapshot::class);
    }

    /**
     * Check if mapped to a Shopify variant.
     */
    public function isMapped(): bool
    {
        return !empty($this->shopify_variant_id);
    }

    /**
     * Check if this SKU has a compare price (on sale).
     */
    public function isOnSale(): bool
    {
        return $this->erp_compare_price && $this->erp_compare_price > $this->erp_price;
    }

    /**
     * Scope a query to only include active mappings.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include mapped SKUs.
     */
    public function scopeMapped($query)
    {
        return $query->whereNotNull('shopify_variant_id');
    }

    /**
     * Scope a query to only include unmapped SKUs.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereNull('shopify_variant_id');
    }

    /**
     * Find by barcode or SKU.
     */
    public static function findByIdentifier(int $erpConnectionId, string $identifier): ?self
    {
        return static::where('erp_connection_id', $erpConnectionId)
            ->where(function ($query) use ($identifier) {
                $query->where('erp_sku', $identifier)
                    ->orWhere('erp_barcode', $identifier)
                    ->orWhere('erp_upc', $identifier);
            })
            ->first();
    }

    /**
     * Get the display identifier.
     */
    public function getDisplayIdentifierAttribute(): string
    {
        return $this->erp_sku ?: $this->erp_barcode ?: $this->erp_upc;
    }
}
