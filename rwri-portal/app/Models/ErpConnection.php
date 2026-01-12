<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ErpConnection extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'name',
        'type',
        'driver',
        'db_host',
        'db_port',
        'db_database',
        'db_username',
        'db_password',
        'api_url',
        'api_key',
        'api_secret',
        'is_active',
        'settings',
        'last_connected_at',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'settings' => 'array',
        'db_password' => 'encrypted',
        'api_key' => 'encrypted',
        'api_secret' => 'encrypted',
        'last_connected_at' => 'datetime',
    ];

    protected $hidden = [
        'db_password',
        'api_key',
        'api_secret',
    ];

    const TYPE_JDA = 'jda';
    const TYPE_ERPNEXT = 'erpnext';

    const DRIVER_DB2 = 'db2';
    const DRIVER_API = 'api';

    /**
     * Get the Shopify store that owns this connection.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the location mappings for this ERP connection.
     */
    public function locationMappings(): HasMany
    {
        return $this->hasMany(StoreLocationMapping::class);
    }

    /**
     * Get the category mappings for this ERP connection.
     */
    public function categoryMappings(): HasMany
    {
        return $this->hasMany(CategoryMapping::class);
    }

    /**
     * Get the product mappings for this ERP connection.
     */
    public function productMappings(): HasMany
    {
        return $this->hasMany(ProductMapping::class);
    }

    /**
     * Get the SKU mappings for this ERP connection.
     */
    public function skuMappings(): HasMany
    {
        return $this->hasMany(SkuMapping::class);
    }

    /**
     * Get the sync jobs for this ERP connection.
     */
    public function syncJobs(): HasMany
    {
        return $this->hasMany(SyncJob::class);
    }

    /**
     * Check if this is a JDA connection.
     */
    public function isJda(): bool
    {
        return $this->type === self::TYPE_JDA;
    }

    /**
     * Check if this is an ERPNext connection.
     */
    public function isErpNext(): bool
    {
        return $this->type === self::TYPE_ERPNEXT;
    }

    /**
     * Check if this uses direct database queries.
     */
    public function usesDatabase(): bool
    {
        return $this->driver === self::DRIVER_DB2;
    }

    /**
     * Check if this uses API calls.
     */
    public function usesApi(): bool
    {
        return $this->driver === self::DRIVER_API;
    }

    /**
     * Scope a query to only include active connections.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include JDA connections.
     */
    public function scopeJda($query)
    {
        return $query->where('type', self::TYPE_JDA);
    }

    /**
     * Scope a query to only include ERPNext connections.
     */
    public function scopeErpNext($query)
    {
        return $query->where('type', self::TYPE_ERPNEXT);
    }
}
