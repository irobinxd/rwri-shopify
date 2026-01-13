<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inventory_snapshots', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('sku_mapping_id')->constrained()->onDelete('cascade');
            $table->foreignId('store_location_mapping_id')->constrained()->onDelete('cascade');
            
            // ERP inventory data
            $table->integer('erp_quantity'); // Raw quantity from ERP
            $table->decimal('allocation_percentage', 5, 2); // Snapshot of allocation at time of sync
            $table->integer('allocated_quantity'); // Calculated: erp_quantity * allocation_percentage
            
            // Shopify inventory data
            $table->string('shopify_inventory_item_id')->nullable();
            $table->integer('shopify_quantity')->nullable(); // Current quantity in Shopify
            
            // Sync tracking
            $table->boolean('sync_required')->default(false);
            $table->timestamp('synced_at')->nullable();
            $table->unsignedBigInteger('sync_job_id')->nullable();
            
            $table->timestamps();
            
            $table->index(['sku_mapping_id', 'store_location_mapping_id'], 'inventory_sku_location_idx');
            $table->index('sync_required', 'inventory_snapshots_sync_required_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_snapshots');
    }
};
