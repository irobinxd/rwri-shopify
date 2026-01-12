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
        Schema::create('store_location_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('erp_connection_id')->constrained()->onDelete('cascade');
            
            // Shopify location
            $table->string('shopify_location_id');
            $table->string('shopify_location_name');
            
            // ERP/JDA store code
            $table->string('erp_store_code');
            $table->string('erp_store_name')->nullable();
            
            // Inventory allocation settings
            $table->decimal('allocation_percentage', 5, 2)->default(100.00); // % of ERP inventory to show
            $table->boolean('is_active')->default(true);
            
            $table->timestamps();
            
            $table->unique(['shopify_store_id', 'shopify_location_id'], 'unique_shopify_location');
            $table->unique(['erp_connection_id', 'erp_store_code'], 'unique_erp_store');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('store_location_mappings');
    }
};
