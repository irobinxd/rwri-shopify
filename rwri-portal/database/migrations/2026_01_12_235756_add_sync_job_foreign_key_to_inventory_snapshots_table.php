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
        Schema::table('inventory_snapshots', function (Blueprint $table) {
            $table->foreign('sync_job_id')
                  ->references('id')
                  ->on('sync_jobs')
                  ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('inventory_snapshots', function (Blueprint $table) {
            $table->dropForeign(['sync_job_id']);
        });
    }
};
