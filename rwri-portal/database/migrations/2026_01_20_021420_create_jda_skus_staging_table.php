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
        Schema::create('jda_skus_staging', function (Blueprint $table) {
            $table->id();
            
            // SKU Information
            $table->string('sku')->index()->comment('SKU from JDA');
            $table->string('product_name')->nullable()->comment('Product Name/Title');
            $table->text('description')->nullable();
            
            // Pricing
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->string('currency', 3)->default('USD');
            
            // Inventory
            $table->integer('inventory_quantity')->default(0);
            $table->string('inventory_policy')->default('deny')->comment('deny, continue');
            $table->string('inventory_management')->nullable()->comment('shopify, null');
            
            // Variant Options
            $table->string('option1_name')->nullable()->comment('e.g., Size');
            $table->string('option1_value')->nullable();
            $table->string('option2_name')->nullable()->comment('e.g., Color');
            $table->string('option2_value')->nullable();
            $table->string('option3_name')->nullable();
            $table->string('option3_value')->nullable();
            
            // Product Information
            $table->string('vendor')->nullable();
            $table->string('product_type')->nullable();
            $table->text('tags')->nullable()->comment('Comma-separated tags');
            $table->string('barcode')->nullable();
            $table->decimal('weight', 8, 2)->nullable();
            $table->string('weight_unit', 10)->default('kg');
            
            // Images
            $table->string('image_url')->nullable();
            
            // Status
            $table->string('status')->default('pending')->comment('pending, processed, error');
            $table->text('error_message')->nullable();
            
            // Shopify Integration
            $table->string('shopify_product_id')->nullable()->index();
            $table->string('shopify_variant_id')->nullable()->index();
            
            // Metadata
            $table->json('raw_data')->nullable()->comment('Store full Excel row data as JSON');
            $table->timestamp('processed_at')->nullable();
            $table->timestamps();
            
            $table->index(['sku', 'status'], 'jda_skus_staging_sku_status_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('jda_skus_staging');
    }
};
