<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trip_comments', function (Blueprint $table) {
            $table->increments('Tripcommentsid');
            $table->unsignedInteger('Tripid');
            $table->unsignedBigInteger('Userid');
            $table->text('Comment');
            $table->dateTime('Created_at')->default(DB::raw('GETDATE()'));

            $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');

            // përdor NO ACTION për MSSQL
            $table->foreign('Userid')->references('Userid')->on('users')->onDelete('NO ACTION');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trip_comments');
    }
};
