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
        Schema::create('sync_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sync_job_id')->constrained()->onDelete('cascade');
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            
            // Entity being synced
            $table->string('entity_type'); // 'product', 'variant', 'inventory', 'price', 'category'
            $table->string('erp_identifier')->nullable(); // ERP product code, SKU, category code
            $table->string('shopify_identifier')->nullable(); // Shopify product ID, variant ID, collection ID
            
            // Operation details
            $table->string('operation'); // 'create', 'update', 'delete', 'skip'
            $table->string('status'); // 'success', 'failed', 'skipped'
            $table->string('level')->default('info'); // 'info', 'warning', 'error'
            
            // Data changes
            $table->json('old_data')->nullable(); // Previous values
            $table->json('new_data')->nullable(); // New values
            $table->json('changes')->nullable(); // Summary of changes made
            
            // Messages
            $table->string('message')->nullable(); // Human-readable message
            $table->text('error_message')->nullable(); // Error details if failed
            $table->json('error_trace')->nullable(); // Stack trace for debugging
            
            // API response data
            $table->integer('api_response_code')->nullable();
            $table->json('api_response_body')->nullable();
            
            $table->timestamps();
            
            $table->index(['sync_job_id', 'status']);
            $table->index(['entity_type', 'erp_identifier']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sync_logs');
    }
};
