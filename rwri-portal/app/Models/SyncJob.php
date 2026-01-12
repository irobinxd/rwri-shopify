<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class SyncJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'shopify_store_id',
        'erp_connection_id',
        'type',
        'direction',
        'status',
        'total_items',
        'processed_items',
        'successful_items',
        'failed_items',
        'skipped_items',
        'started_at',
        'completed_at',
        'duration_seconds',
        'triggered_by',
        'triggered_by_user_id',
        'error_message',
        'error_details',
        'options',
    ];

    protected $casts = [
        'total_items' => 'integer',
        'processed_items' => 'integer',
        'successful_items' => 'integer',
        'failed_items' => 'integer',
        'skipped_items' => 'integer',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'duration_seconds' => 'integer',
        'error_details' => 'array',
        'options' => 'array',
    ];

    // Sync types
    const TYPE_PRODUCTS = 'products';
    const TYPE_INVENTORY = 'inventory';
    const TYPE_PRICES = 'prices';
    const TYPE_CATEGORIES = 'categories';
    const TYPE_FULL = 'full';

    // Directions
    const DIRECTION_ERP_TO_SHOPIFY = 'erp_to_shopify';
    const DIRECTION_SHOPIFY_TO_ERP = 'shopify_to_erp';

    // Statuses
    const STATUS_PENDING = 'pending';
    const STATUS_RUNNING = 'running';
    const STATUS_COMPLETED = 'completed';
    const STATUS_FAILED = 'failed';
    const STATUS_CANCELLED = 'cancelled';

    // Triggers
    const TRIGGER_MANUAL = 'manual';
    const TRIGGER_SCHEDULED = 'scheduled';
    const TRIGGER_WEBHOOK = 'webhook';

    /**
     * Get the Shopify store for this job.
     */
    public function shopifyStore(): BelongsTo
    {
        return $this->belongsTo(ShopifyStore::class);
    }

    /**
     * Get the ERP connection for this job.
     */
    public function erpConnection(): BelongsTo
    {
        return $this->belongsTo(ErpConnection::class);
    }

    /**
     * Get the user who triggered this job.
     */
    public function triggeredByUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'triggered_by_user_id');
    }

    /**
     * Get the logs for this job.
     */
    public function logs(): HasMany
    {
        return $this->hasMany(SyncLog::class);
    }

    /**
     * Get the inventory snapshots created by this job.
     */
    public function inventorySnapshots(): HasMany
    {
        return $this->hasMany(InventorySnapshot::class);
    }

    /**
     * Start the job.
     */
    public function start(): void
    {
        $this->status = self::STATUS_RUNNING;
        $this->started_at = now();
        $this->save();
    }

    /**
     * Complete the job.
     */
    public function complete(): void
    {
        $this->status = self::STATUS_COMPLETED;
        $this->completed_at = now();
        $this->duration_seconds = $this->started_at
            ? $this->completed_at->diffInSeconds($this->started_at)
            : 0;
        $this->save();
    }

    /**
     * Fail the job.
     */
    public function fail(string $message, array $details = null): void
    {
        $this->status = self::STATUS_FAILED;
        $this->completed_at = now();
        $this->duration_seconds = $this->started_at
            ? $this->completed_at->diffInSeconds($this->started_at)
            : 0;
        $this->error_message = $message;
        $this->error_details = $details;
        $this->save();
    }

    /**
     * Cancel the job.
     */
    public function cancel(): void
    {
        $this->status = self::STATUS_CANCELLED;
        $this->completed_at = now();
        $this->save();
    }

    /**
     * Increment processed count.
     */
    public function incrementProcessed(bool $success = true, bool $skipped = false): void
    {
        $this->processed_items++;

        if ($skipped) {
            $this->skipped_items++;
        } elseif ($success) {
            $this->successful_items++;
        } else {
            $this->failed_items++;
        }

        $this->save();
    }

    /**
     * Check if job is running.
     */
    public function isRunning(): bool
    {
        return $this->status === self::STATUS_RUNNING;
    }

    /**
     * Check if job is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === self::STATUS_COMPLETED;
    }

    /**
     * Check if job failed.
     */
    public function isFailed(): bool
    {
        return $this->status === self::STATUS_FAILED;
    }

    /**
     * Get progress percentage.
     */
    public function getProgressAttribute(): float
    {
        if ($this->total_items === 0) {
            return 0;
        }

        return round(($this->processed_items / $this->total_items) * 100, 2);
    }

    /**
     * Scope a query to only include running jobs.
     */
    public function scopeRunning($query)
    {
        return $query->where('status', self::STATUS_RUNNING);
    }

    /**
     * Scope a query to only include pending jobs.
     */
    public function scopePending($query)
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope a query to jobs of a specific type.
     */
    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }
}
