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
        Schema::create('shopify_stores', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('domain'); // e.g., royalstore.myshopify.com
            $table->string('api_key')->nullable();
            $table->text('api_secret')->nullable(); // encrypted
            $table->text('access_token')->nullable(); // encrypted
            $table->string('api_version')->default('2024-01');
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable(); // Additional store settings
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shopify_stores');
    }
};
