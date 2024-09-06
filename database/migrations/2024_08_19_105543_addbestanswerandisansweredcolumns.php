<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddBestAnswerAndIsAnsweredColumns extends Migration
{
    public function up()
    {
        Schema::table('pulses', function (Blueprint $table) {
            $table->boolean('is_answered')->default(false)->after('text');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->boolean('is_best_answer')->default(false)->after('text');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropColumn('is_answered');
        });

        Schema::table('comments', function (Blueprint $table) {
            $table->dropColumn('is_best_answer');
        });
    }
}

