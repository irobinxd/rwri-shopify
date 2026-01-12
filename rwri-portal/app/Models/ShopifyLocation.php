<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ShopifyLocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'shopify_location_id',
        'name',
        'address1',
        'address2',
        'city',
        'province',
        'province_code',
        'country',
        'country_code',
        'zip',
        'phone',
        'is_active',
        'is_primary',
        'fulfills_online_orders',
        'pulled_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_primary' => 'boolean',
        'fulfills_online_orders' => 'boolean',
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
     * Get the inventory levels at this location.
     */
    public function inventoryLevels(): HasMany
    {
        return $this->hasMany(ShopifyInventoryLevel::class);
    }

    /**
     * Get the store location mapping for this Shopify location.
     */
    public function locationMapping(): HasOne
    {
        return $this->hasOne(StoreLocationMapping::class, 'shopify_location_id', 'shopify_location_id')
            ->where('shopify_store_id', $this->shopify_store_id);
    }

    /**
     * Check if this location is mapped to an ERP store.
     */
    public function isMapped(): bool
    {
        return $this->locationMapping()->exists();
    }

    /**
     * Get full address.
     */
    public function getFullAddressAttribute(): string
    {
        $parts = array_filter([
            $this->address1,
            $this->address2,
            $this->city,
            $this->province,
            $this->zip,
            $this->country,
        ]);

        return implode(', ', $parts);
    }

    /**
     * Scope to active locations.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to unmapped locations.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereDoesntHave('locationMapping');
    }
}
