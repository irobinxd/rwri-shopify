<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CategoryMapping extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'erp_connection_id',
        'erp_category_code',
        'erp_category_name',
        'erp_parent_category_code',
        'shopify_collection_id',
        'shopify_collection_handle',
        'shopify_collection_title',
        'is_active',
        'auto_sync',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'auto_sync' => 'boolean',
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
     * Get the product mappings in this category.
     */
    public function productMappings(): HasMany
    {
        return $this->hasMany(ProductMapping::class);
    }

    /**
     * Get the parent category mapping.
     */
    public function parent(): BelongsTo
    {
        return $this->belongsTo(CategoryMapping::class, 'erp_parent_category_code', 'erp_category_code')
            ->where('erp_connection_id', $this->erp_connection_id);
    }

    /**
     * Get the child category mappings.
     */
    public function children(): HasMany
    {
        return $this->hasMany(CategoryMapping::class, 'erp_parent_category_code', 'erp_category_code')
            ->where('erp_connection_id', $this->erp_connection_id);
    }

    /**
     * Check if mapped to a Shopify collection.
     */
    public function isMapped(): bool
    {
        return !empty($this->shopify_collection_id);
    }

    /**
     * Scope a query to only include active mappings.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include mapped categories.
     */
    public function scopeMapped($query)
    {
        return $query->whereNotNull('shopify_collection_id');
    }

    /**
     * Scope a query to only include unmapped categories.
     */
    public function scopeUnmapped($query)
    {
        return $query->whereNull('shopify_collection_id');
    }

    /**
     * Get the display name.
     */
    public function getDisplayNameAttribute(): string
    {
        return $this->erp_category_name ?: $this->erp_category_code;
    }
}
