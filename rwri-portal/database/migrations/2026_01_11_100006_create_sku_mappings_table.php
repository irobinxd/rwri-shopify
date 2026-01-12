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
        Schema::create('sku_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('erp_connection_id')->constrained()->onDelete('cascade');
            $table->foreignId('product_mapping_id')->nullable()->constrained()->onDelete('cascade');
            
            // ERP/JDA SKU
            $table->string('erp_sku');
            $table->string('erp_barcode')->nullable();
            $table->string('erp_upc')->nullable();
            
            // Shopify variant
            $table->string('shopify_variant_id')->nullable();
            $table->string('shopify_sku')->nullable();
            $table->string('shopify_barcode')->nullable();
            
            // Current data from ERP
            $table->decimal('erp_price', 10, 2)->nullable();
            $table->decimal('erp_compare_price', 10, 2)->nullable();
            $table->integer('erp_inventory_qty')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();
            
            $table->unique(['erp_connection_id', 'erp_sku'], 'unique_erp_sku');
            $table->index(['shopify_store_id', 'shopify_variant_id']);
            $table->index('erp_barcode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sku_mappings');
    }
};
