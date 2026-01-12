<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventorySnapshot extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'sku_mapping_id',
        'store_location_mapping_id',
        'erp_quantity',
        'allocation_percentage',
        'allocated_quantity',
        'shopify_inventory_item_id',
        'shopify_quantity',
        'sync_required',
        'synced_at',
        'sync_job_id',
    ];

    protected $casts = [
        'erp_quantity' => 'integer',
        'allocation_percentage' => 'decimal:2',
        'allocated_quantity' => 'integer',
        'shopify_quantity' => 'integer',
        'sync_required' => 'boolean',
        'synced_at' => 'datetime',
    ];

    /**
     * Get the Shopify store for this snapshot.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the SKU mapping for this snapshot.
     */
    public function skuMapping(): BelongsTo
    {
        return $this->belongsTo(SkuMapping::class);
    }

    /**
     * Get the location mapping for this snapshot.
     */
    public function storeLocationMapping(): BelongsTo
    {
        return $this->belongsTo(StoreLocationMapping::class);
    }

    /**
     * Get the sync job that created this snapshot.
     */
    public function syncJob(): BelongsTo
    {
        return $this->belongsTo(SyncJob::class);
    }

    /**
     * Calculate and set the allocated quantity.
     */
    public function calculateAllocatedQuantity(): int
    {
        $this->allocated_quantity = (int) floor($this->erp_quantity * ($this->allocation_percentage / 100));
        return $this->allocated_quantity;
    }

    /**
     * Check if sync is needed (allocated differs from Shopify).
     */
    public function needsSync(): bool
    {
        return $this->allocated_quantity !== $this->shopify_quantity;
    }

    /**
     * Mark as synced.
     */
    public function markAsSynced(int $shopifyQuantity = null): void
    {
        $this->shopify_quantity = $shopifyQuantity ?? $this->allocated_quantity;
        $this->sync_required = false;
        $this->synced_at = now();
        $this->save();
    }

    /**
     * Scope a query to only include snapshots that need syncing.
     */
    public function scopeNeedsSync($query)
    {
        return $query->where('sync_required', true);
    }

    /**
     * Scope a query to snapshots for a specific location.
     */
    public function scopeForLocation($query, int $locationMappingId)
    {
        return $query->where('store_location_mapping_id', $locationMappingId);
    }

    /**
     * Get the difference between allocated and Shopify quantity.
     */
    public function getQuantityDifferenceAttribute(): int
    {
        return $this->allocated_quantity - ($this->shopify_quantity ?? 0);
    }
}
