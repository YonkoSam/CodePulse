<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('pulses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->string('text');
            $table->json('code')->nullable();
            $table->foreignId('team_id')->nullable();
            $table->foreign('team_id')
                ->references('id')
                ->on(Config::get('teamwork.teams_table'))
                ->onDelete('cascade');
            $table->timestamps();
        });

        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('pulse_id')->constrained()->onDelete('cascade');
            $table->string('text');
            $table->json('code')->nullable();

            $table->timestamps();
        });
        Schema::create('likes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('pulse_id')->nullable()->constrained()->onDelete('cascade');
            $table->foreignId('comment_id')->nullable()->constrained()->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('pulses');
        Schema::dropIfExists('likes');
        Schema::dropIfExists('comments');
    }

};
