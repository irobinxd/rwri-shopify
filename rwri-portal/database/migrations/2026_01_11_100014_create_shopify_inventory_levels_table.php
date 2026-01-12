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
        Schema::create('shopify_inventory_levels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('shopify_location_id')->constrained('shopify_locations')->onDelete('cascade');
            $table->foreignId('shopify_variant_id')->constrained('shopify_variants')->onDelete('cascade');
            
            // Inventory level data
            $table->string('inventory_item_id');
            $table->integer('available')->default(0);
            $table->integer('on_hand')->nullable();
            $table->integer('committed')->nullable();
            $table->integer('incoming')->nullable();
            $table->integer('reserved')->nullable();
            
            $table->timestamp('pulled_at')->nullable();
            $table->timestamps();
            
            $table->unique(['shopify_location_id', 'shopify_variant_id'], 'unique_location_variant');
            $table->index('inventory_item_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_inventory_levels');
    }
};
