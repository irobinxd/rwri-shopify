<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ShopifyVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'shopify_product_id',
        'shopify_variant_id',
        'shopify_inventory_item_id',
        'title',
        'sku',
        'barcode',
        'price',
        'compare_at_price',
        'option1',
        'option2',
        'option3',
        'weight',
        'weight_unit',
        'requires_shipping',
        'taxable',
        'inventory_policy',
        'inventory_management',
        'inventory_quantity',
        'image_url',
        'position',
        'pulled_at',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'compare_at_price' => 'decimal:2',
        'weight' => 'decimal:2',
        'requires_shipping' => 'boolean',
        'taxable' => 'boolean',
        'inventory_quantity' => 'integer',
        'position' => 'integer',
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
     * Get the product this variant belongs to.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(ShopifyProduct::class, 'shopify_product_id');
    }

    /**
     * Get the inventory levels for this variant.
     */
    public function inventoryLevels(): HasMany
    {
        return $this->hasMany(ShopifyInventoryLevel::class);
    }

    /**
     * Get the SKU mapping for this variant.
     */
    public function skuMapping(): HasOne
    {
        return $this->hasOne(SkuMapping::class, 'shopify_variant_id', 'shopify_variant_id')
            ->where('shopify_store_id', $this->shopify_store_id);
    }

    /**
     * Check if this variant is mapped to an ERP SKU.
     */
    public function isMapped(): bool
    {
        return $this->skuMapping()->exists();
    }

    /**
     * Check if this variant has a compare price (on sale).
     */
    public function isOnSale(): bool
    {
        return $this->compare_at_price && $this->compare_at_price > $this->price;
    }

    /**
     * Get the discount percentage if on sale.
     */
    public function getDiscountPercentageAttribute(): ?float
    {
        if (!$this->isOnSale()) {
            return null;
        }

        return round((($this->compare_at_price - $this->price) / $this->compare_at_price) * 100, 2);
    }

    /**
     * Get the option values as array.
     */
    public function getOptionsAttribute(): array
    {
        return array_filter([
            $this->option1,
            $this->option2,
            $this->option3,
        ]);
    }

    /**
     * Get display title (SKU or variant title).
     */
    public function getDisplayTitleAttribute(): string
    {
        return $this->sku ?: $this->title ?: "Variant #{$this->shopify_variant_id}";
    }

    /**
     * Scope to variants with SKU.
     */
    public function scopeWithSku($query)
    {
        return $query->whereNotNull('sku')->where('sku', '!=', '');
    }

    /**
     * Scope to variants with barcode.
     */
    public function scopeWithBarcode($query)
    {
        return $query->whereNotNull('barcode')->where('barcode', '!=', '');
    }

    /**
     * Scope to unmapped variants.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereDoesntHave('skuMapping');
    }

    /**
     * Find by SKU or barcode.
     */
    public static function findByIdentifier(int $storeId, string $identifier): ?self
    {
        return static::where('shopify_store_id', $storeId)
            ->where(function ($query) use ($identifier) {
                $query->where('sku', $identifier)
                    ->orWhere('barcode', $identifier);
            })
            ->first();
    }
}
