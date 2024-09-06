<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_user_message_reads', function (Blueprint $table) {
            $table->id();
            $table->foreignId('message_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('seen_at')->nullable();
            $table->index(['message_id', 'user_id','seen_at']);
            $table->unique(['message_id', 'user_id']);
        });

    }

    public function down(): void
    {
        Schema::dropIfExists('team_user_message_reads');
    }
};
