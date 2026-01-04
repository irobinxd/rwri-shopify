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
        Schema::table('users', function (Blueprint $table) {
            // Remove old fields
            $table->dropColumn(['name', 'avatar']);
            
            // Add new fields
            $table->string('firstname')->after('id');
            $table->string('middlename')->nullable()->after('firstname');
            $table->string('lastname')->after('middlename');
            $table->unsignedBigInteger('department_id')->nullable()->after('email');
            $table->unsignedBigInteger('location_id')->nullable()->after('department_id');
            $table->unsignedBigInteger('group_id')->nullable()->after('location_id');
            $table->boolean('is_active')->default(true)->after('group_id');
            $table->unsignedBigInteger('created_by')->nullable()->after('is_active');
            $table->unsignedBigInteger('updated_by')->nullable()->after('created_by');
            
            // Add foreign keys
            $table->foreign('created_by')->references('id')->on('users')->onDelete('set null');
            $table->foreign('updated_by')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['created_by']);
            $table->dropForeign(['updated_by']);
            
            $table->dropColumn([
                'firstname',
                'middlename',
                'lastname',
                'department_id',
                'location_id',
                'group_id',
                'is_active',
                'created_by',
                'updated_by'
            ]);
            
            $table->string('name')->after('id');
            $table->string('avatar')->nullable()->after('email');
        });
    }
};


