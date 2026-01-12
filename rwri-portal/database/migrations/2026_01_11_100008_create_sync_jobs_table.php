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
        Schema::create('sync_jobs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->foreignId('erp_connection_id')->nullable()->constrained()->onDelete('set null');
            
            $table->string('type'); // 'products', 'inventory', 'prices', 'categories', 'full'
            $table->string('direction')->default('erp_to_shopify'); // 'erp_to_shopify', 'shopify_to_erp'
            $table->string('status')->default('pending'); // 'pending', 'running', 'completed', 'failed', 'cancelled'
            
            // Progress tracking
            $table->integer('total_items')->default(0);
            $table->integer('processed_items')->default(0);
            $table->integer('successful_items')->default(0);
            $table->integer('failed_items')->default(0);
            $table->integer('skipped_items')->default(0);
            
            // Timing
            $table->timestamp('started_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable();
            
            // Trigger info
            $table->string('triggered_by')->default('manual'); // 'manual', 'scheduled', 'webhook'
            $table->foreignId('triggered_by_user_id')->nullable()->constrained('users')->onDelete('set null');
            
            // Error handling
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            
            $table->json('options')->nullable(); // Additional sync options
            $table->timestamps();
            
            $table->index(['shopify_store_id', 'type', 'status']);
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sync_jobs');
    }
};
