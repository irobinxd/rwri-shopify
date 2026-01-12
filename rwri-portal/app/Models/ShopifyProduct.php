<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ShopifyProduct extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'shopify_product_id',
        'handle',
        'title',
        'body_html',
        'vendor',
        'product_type',
        'status',
        'tags',
        'options',
        'image_url',
        'variants_count',
        'published_at',
        'pulled_at',
    ];

    protected $casts = [
        'tags' => 'array',
        'options' => 'array',
        'variants_count' => 'integer',
        'published_at' => 'datetime',
        'pulled_at' => 'datetime',
    ];

    const STATUS_ACTIVE = 'active';
    const STATUS_ARCHIVED = 'archived';
    const STATUS_DRAFT = 'draft';

    /**
     * Get the Shopify store.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the variants for this product.
     */
    public function variants(): HasMany
    {
        return $this->hasMany(ShopifyVariant::class)->orderBy('position');
    }

    /**
     * Get the product mapping for this product.
     */
    public function productMapping(): HasOne
    {
        return $this->hasOne(ProductMapping::class, 'shopify_product_id', 'shopify_product_id')
            ->where('shopify_store_id', $this->shopify_store_id);
    }

    /**
     * Check if this product is mapped to an ERP product.
     */
    public function isMapped(): bool
    {
        return $this->productMapping()->exists();
    }

    /**
     * Check if this product is active.
     */
    public function isActive(): bool
    {
        return $this->status === self::STATUS_ACTIVE;
    }

    /**
     * Get the Shopify admin URL.
     */
    public function getAdminUrlAttribute(): ?string
    {
        if (!$this->shopifyStore) {
            return null;
        }

        return "https://{$this->shopifyStore->domain}/admin/products/{$this->shopify_product_id}";
    }

    /**
     * Get the storefront URL.
     */
    public function getStorefrontUrlAttribute(): ?string
    {
        if (!$this->shopifyStore) {
            return null;
        }

        $domain = str_replace('.myshopify.com', '', $this->shopifyStore->domain);
        return "https://{$domain}.com/products/{$this->handle}";
    }

    /**
     * Scope to active products.
     */
    public function scopeActive($query)
    {
        return $query->where('status', self::STATUS_ACTIVE);
    }

    /**
     * Scope to unmapped products.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereDoesntHave('productMapping');
    }

    /**
     * Scope by status.
     */
    public function scopeWithStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope by vendor.
     */
    public function scopeByVendor($query, string $vendor)
    {
        return $query->where('vendor', $vendor);
    }

    /**
     * Scope by product type.
     */
    public function scopeByProductType($query, string $type)
    {
        return $query->where('product_type', $type);
    }
}
