<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShopifyInventoryLevel extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'shopify_location_id',
        'shopify_variant_id',
        'inventory_item_id',
        'available',
        'on_hand',
        'committed',
        'incoming',
        'reserved',
        'pulled_at',
    ];

    protected $casts = [
        'available' => 'integer',
        'on_hand' => 'integer',
        'committed' => 'integer',
        'incoming' => 'integer',
        'reserved' => 'integer',
        'pulled_at' => 'datetime',
    ];

    /**
     * Get the Shopify store.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the location.
     */
    public function location(): BelongsTo
    {
        return $this->belongsTo(ShopifyLocation::class, 'shopify_location_id');
    }

    /**
     * Get the variant.
     */
    public function variant(): BelongsTo
    {
        return $this->belongsTo(ShopifyVariant::class, 'shopify_variant_id');
    }

    /**
     * Check if item is in stock.
     */
    public function isInStock(): bool
    {
        return $this->available > 0;
    }

    /**
     * Check if item is out of stock.
     */
    public function isOutOfStock(): bool
    {
        return $this->available <= 0;
    }

    /**
     * Check if item is low stock (configurable threshold).
     */
    public function isLowStock(int $threshold = 5): bool
    {
        return $this->available > 0 && $this->available <= $threshold;
    }

    /**
     * Scope to items in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('available', '>', 0);
    }

    /**
     * Scope to items out of stock.
     */
    public function scopeOutOfStock($query)
    {
        return $query->where('available', '<=', 0);
    }

    /**
     * Scope to items at specific location.
     */
    public function scopeAtLocation($query, int $locationId)
    {
        return $query->where('shopify_location_id', $locationId);
    }

    /**
     * Get total available across all locations for a variant.
     */
    public static function totalAvailableForVariant(int $variantId): int
    {
        return static::where('shopify_variant_id', $variantId)->sum('available');
    }
}
