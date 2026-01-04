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
        Schema::create('module_settings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('module_id');
            $table->string('key');
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string, json, encrypted, etc.
            $table->text('description')->nullable();
            $table->boolean('is_encrypted')->default(false);
            $table->timestamps();
            
            $table->foreign('module_id')->references('id')->on('modules')->onDelete('cascade');
            $table->unique(['module_id', 'key'], 'module_setting_unique');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('module_settings');
    }
};


