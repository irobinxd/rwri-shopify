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
        Schema::create('shopify_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('shopify_product_id')->constrained('shopify_products')->onDelete('cascade');
            
            // Shopify variant data
            $table->string('shopify_variant_id')->index('shopify_variants_variant_id_idx');
            $table->string('shopify_inventory_item_id')->nullable();
            $table->string('title')->nullable(); // e.g., "Small / Red"
            $table->string('sku')->nullable();
            $table->string('barcode')->nullable();
            $table->decimal('price', 10, 2)->nullable();
            $table->decimal('compare_at_price', 10, 2)->nullable();
            $table->string('option1')->nullable();
            $table->string('option2')->nullable();
            $table->string('option3')->nullable();
            $table->decimal('weight', 10, 2)->nullable();
            $table->string('weight_unit')->nullable();
            $table->boolean('requires_shipping')->default(true);
            $table->boolean('taxable')->default(true);
            $table->string('inventory_policy')->default('deny'); // deny, continue
            $table->string('inventory_management')->nullable(); // shopify, null
            $table->integer('inventory_quantity')->nullable();
            $table->string('image_url')->nullable();
            $table->integer('position')->default(1);
            
            $table->timestamp('pulled_at')->nullable();
            $table->timestamps();
            
            $table->unique(['shopify_store_id', 'shopify_variant_id'], 'shopify_variants_store_variant_unique');
            $table->index('sku', 'shopify_variants_sku_idx');
            $table->index('barcode', 'shopify_variants_barcode_idx');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_variants');
    }
};
