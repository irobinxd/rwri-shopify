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
        Schema::create('erp_connections', function (Blueprint $table) {
            $table->id();
            $table->foreignId('shopify_store_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->string('type'); // 'jda', 'erpnext'
            $table->string('driver')->nullable(); // 'db2', 'api'
            
            // Database connection (for JDA/DB2)
            $table->string('db_host')->nullable();
            $table->string('db_port')->nullable();
            $table->string('db_database')->nullable();
            $table->string('db_username')->nullable();
            $table->text('db_password')->nullable(); // encrypted
            
            // API connection (for ERPNext)
            $table->string('api_url')->nullable();
            $table->text('api_key')->nullable(); // encrypted
            $table->text('api_secret')->nullable(); // encrypted
            
            $table->boolean('is_active')->default(true);
            $table->json('settings')->nullable(); // Additional ERP-specific settings
            $table->timestamp('last_connected_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('erp_connections');
    }
};
