<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StoreLocationMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'erp_connection_id',
        'shopify_location_id',
        'shopify_location_name',
        'erp_store_code',
        'erp_store_name',
        'allocation_percentage',
        'is_active',
    ];

    protected $casts = [
        'allocation_percentage' => 'decimal:2',
        'is_active' => 'boolean',
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
     * Get the inventory snapshots for this location.
     */
    public function inventorySnapshots(): HasMany
    {
        return $this->hasMany(InventorySnapshot::class);
    }

    /**
     * Calculate allocated quantity based on ERP quantity and allocation percentage.
     */
    public function calculateAllocatedQuantity(int $erpQuantity): int
    {
        return (int) floor($erpQuantity * ($this->allocation_percentage / 100));
    }

    /**
     * Scope a query to only include active mappings.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the display name (Shopify name or ERP name).
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->shopify_location_name ?: $this->erp_store_name ?: $this->erp_store_code;
    }
}
