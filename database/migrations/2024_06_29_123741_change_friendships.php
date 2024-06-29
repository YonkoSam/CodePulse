<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('friendships', function (Blueprint $table) {
            $table->foreignId('blocked_initiator')->nullable()->constrained('users')->onDelete('cascade');

        });
    }

    public function down(): void
    {
        Schema::table('friendships', function (Blueprint $table) {
            //
        });
    }
};
