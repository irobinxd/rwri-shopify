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
        Schema::create('category_mappings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('erp_connection_id')->constrained()->onDelete('cascade');
            
            // ERP/JDA category
            $table->string('erp_category_code');
            $table->string('erp_category_name')->nullable();
            $table->string('erp_parent_category_code')->nullable();
            
            // Shopify collection
            $table->string('shopify_collection_id')->nullable();
            $table->string('shopify_collection_handle')->nullable();
            $table->string('shopify_collection_title')->nullable();
            
            $table->boolean('is_active')->default(true);
            $table->boolean('auto_sync')->default(true); // Auto-create products in collection
            
            $table->timestamps();
            
            $table->unique(['erp_connection_id', 'erp_category_code'], 'unique_erp_category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_mappings');
    }
};
