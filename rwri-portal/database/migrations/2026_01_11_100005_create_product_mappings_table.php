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
        Schema::create('product_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('erp_connection_id')->constrained()->onDelete('cascade');
            $table->foreignId('category_mapping_id')->nullable()->constrained()->onDelete('set null');
            
            // ERP/JDA product
            $table->string('erp_product_code');
            $table->string('erp_product_name')->nullable();
            $table->string('erp_category_code')->nullable();
            
            // Shopify product
            $table->string('shopify_product_id')->nullable();
            $table->string('shopify_product_handle')->nullable();
            $table->string('shopify_product_title')->nullable();
            
            // Sync settings
            $table->boolean('is_active')->default(true);
            $table->boolean('sync_price')->default(true);
            $table->boolean('sync_inventory')->default(true);
            $table->boolean('sync_title')->default(false); // Usually keep Shopify title
            $table->boolean('sync_description')->default(false);
            
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            
            $table->unique(['erp_connection_id', 'erp_product_code'], 'unique_erp_product');
            $table->index(['shopify_store_id', 'shopify_product_id'], 'product_mappings_store_product_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_mappings');
    }
};
