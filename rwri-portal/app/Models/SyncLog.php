<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SyncLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'sync_job_id',
        'shopify_store_id',
        'entity_type',
        'erp_identifier',
        'shopify_identifier',
        'operation',
        'status',
        'level',
        'old_data',
        'new_data',
        'changes',
        'message',
        'error_message',
        'error_trace',
        'api_response_code',
        'api_response_body',
    ];

    protected $casts = [
        'old_data' => 'array',
        'new_data' => 'array',
        'changes' => 'array',
        'error_trace' => 'array',
        'api_response_code' => 'integer',
        'api_response_body' => 'array',
    ];

    // Entity types
    const ENTITY_PRODUCT = 'product';
    const ENTITY_VARIANT = 'variant';
    const ENTITY_INVENTORY = 'inventory';
    const ENTITY_PRICE = 'price';
    const ENTITY_CATEGORY = 'category';

    // Operations
    const OPERATION_CREATE = 'create';
    const OPERATION_UPDATE = 'update';
    const OPERATION_DELETE = 'delete';
    const OPERATION_SKIP = 'skip';

    // Statuses
    const STATUS_SUCCESS = 'success';
    const STATUS_FAILED = 'failed';
    const STATUS_SKIPPED = 'skipped';

    // Levels
    const LEVEL_INFO = 'info';
    const LEVEL_WARNING = 'warning';
    const LEVEL_ERROR = 'error';

    /**
     * Get the sync job for this log.
     */
    public function syncJob(): BelongsTo
    {
        return $this->belongsTo(SyncJob::class);
    }

    /**
     * Get the Shopify store for this log.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Create a success log.
     */
    public static function success(
        SyncJob $job,
        string $entityType,
        string $operation,
        string $erpIdentifier = null,
        string $shopifyIdentifier = null,
        string $message = null,
        array $changes = null
    ): self {
        return static::create([
            'sync_job_id' => $job->id,
            'shopify_store_id' => $job->shopify_store_id,
            'entity_type' => $entityType,
            'erp_identifier' => $erpIdentifier,
            'shopify_identifier' => $shopifyIdentifier,
            'operation' => $operation,
            'status' => self::STATUS_SUCCESS,
            'level' => self::LEVEL_INFO,
            'message' => $message,
            'changes' => $changes,
        ]);
    }

    /**
     * Create an error log.
     */
    public static function error(
        SyncJob $job,
        string $entityType,
        string $operation,
        string $errorMessage,
        string $erpIdentifier = null,
        string $shopifyIdentifier = null,
        array $errorTrace = null,
        int $apiResponseCode = null,
        array $apiResponseBody = null
    ): self {
        return static::create([
            'sync_job_id' => $job->id,
            'shopify_store_id' => $job->shopify_store_id,
            'entity_type' => $entityType,
            'erp_identifier' => $erpIdentifier,
            'shopify_identifier' => $shopifyIdentifier,
            'operation' => $operation,
            'status' => self::STATUS_FAILED,
            'level' => self::LEVEL_ERROR,
            'error_message' => $errorMessage,
            'error_trace' => $errorTrace,
            'api_response_code' => $apiResponseCode,
            'api_response_body' => $apiResponseBody,
        ]);
    }

    /**
     * Create a warning log.
     */
    public static function warning(
        SyncJob $job,
        string $entityType,
        string $message,
        string $erpIdentifier = null,
        string $shopifyIdentifier = null
    ): self {
        return static::create([
            'sync_job_id' => $job->id,
            'shopify_store_id' => $job->shopify_store_id,
            'entity_type' => $entityType,
            'erp_identifier' => $erpIdentifier,
            'shopify_identifier' => $shopifyIdentifier,
            'operation' => self::OPERATION_SKIP,
            'status' => self::STATUS_SKIPPED,
            'level' => self::LEVEL_WARNING,
            'message' => $message,
        ]);
    }

    /**
     * Check if this is an error log.
     */
    public function isError(): bool
    {
        return $this->level === self::LEVEL_ERROR;
    }

    /**
     * Check if this is a warning log.
     */
    public function isWarning(): bool
    {
        return $this->level === self::LEVEL_WARNING;
    }

    /**
     * Scope a query to only include error logs.
     */
    public function scopeErrors($query)
    {
        return $query->where('level', self::LEVEL_ERROR);
    }

    /**
     * Scope a query to only include warning logs.
     */
    public function scopeWarnings($query)
    {
        return $query->where('level', self::LEVEL_WARNING);
    }

    /**
     * Scope a query to logs for a specific entity type.
     */
    public function scopeForEntity($query, string $entityType)
    {
        return $query->where('entity_type', $entityType);
    }

    /**
     * Get the identifier display string.
     */
    public function getIdentifierAttribute(): string
    {
        if ($this->erp_identifier && $this->shopify_identifier) {
            return "{$this->erp_identifier} → {$this->shopify_identifier}";
        }

        return $this->erp_identifier ?: $this->shopify_identifier ?: 'N/A';
    }
}
