<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class ShopifyCollection extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'shopify_collection_id',
        'collection_type',
        'handle',
        'title',
        'body_html',
        'image_url',
        'is_published',
        'sort_order',
        'products_count',
        'published_at',
        'pulled_at',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'products_count' => 'integer',
        'published_at' => 'datetime',
        'pulled_at' => 'datetime',
    ];

    const TYPE_SMART = 'smart';
    const TYPE_CUSTOM = 'custom';

    /**
     * Get the Shopify store.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the category mapping for this collection.
     */
    public function categoryMapping(): HasOne
    {
        return $this->hasOne(CategoryMapping::class, 'shopify_collection_id', 'shopify_collection_id')
            ->where('shopify_store_id', $this->shopify_store_id);
    }

    /**
     * Check if this collection is mapped to an ERP category.
     */
    public function isMapped(): bool
    {
        return $this->categoryMapping()->exists();
    }

    /**
     * Check if this is a smart collection.
     */
    public function isSmartCollection(): bool
    {
        return $this->collection_type === self::TYPE_SMART;
    }

    /**
     * Check if this is a custom collection.
     */
    public function isCustomCollection(): bool
    {
        return $this->collection_type === self::TYPE_CUSTOM;
    }

    /**
     * Scope to published collections.
     */
    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    /**
     * Scope to unmapped collections.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereDoesntHave('categoryMapping');
    }

    /**
     * Scope by collection type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('collection_type', $type);
    }
}
