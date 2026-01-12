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
        Schema::create('shopify_collections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            
            // Shopify collection data
            $table->string('shopify_collection_id')->index();
            $table->string('collection_type'); // 'smart' or 'custom'
            $table->string('handle');
            $table->string('title');
            $table->text('body_html')->nullable();
            $table->string('image_url')->nullable();
            $table->boolean('is_published')->default(true);
            $table->string('sort_order')->nullable();
            $table->integer('products_count')->default(0);
            
            $table->timestamp('published_at')->nullable();
            $table->timestamp('pulled_at')->nullable();
            $table->timestamps();
            
            $table->unique(['shopify_store_id', 'shopify_collection_id']);
            $table->index(['shopify_store_id', 'handle']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_collections');
    }
};
