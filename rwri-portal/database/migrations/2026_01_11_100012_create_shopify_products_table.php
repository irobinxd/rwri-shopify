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
        Schema::create('shopify_products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            
            // Shopify product data
            $table->string('shopify_product_id')->index();
            $table->string('handle');
            $table->string('title');
            $table->text('body_html')->nullable();
            $table->string('vendor')->nullable();
            $table->string('product_type')->nullable();
            $table->string('status')->default('active'); // active, archived, draft
            $table->json('tags')->nullable();
            $table->json('options')->nullable(); // Size, Color, etc.
            $table->string('image_url')->nullable();
            $table->integer('variants_count')->default(0);
            
            $table->timestamp('published_at')->nullable();
            $table->timestamp('pulled_at')->nullable();
            $table->timestamps();
            
            $table->unique(['shopify_store_id', 'shopify_product_id']);
            $table->index(['shopify_store_id', 'handle']);
            $table->index(['shopify_store_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_products');
    }
};
