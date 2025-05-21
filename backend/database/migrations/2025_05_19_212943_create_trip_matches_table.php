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
        Schema::create('trip_matches', function (Blueprint $table) {
            $table->increments('trip_matchesid');

            // Lidhje me tabelën trips
            $table->unsignedInteger('Tripid');
            $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');

            // Lidhje me tabelën users, por pa cascade për të shmangur "multiple cascade paths"
            $table->unsignedBigInteger('Userid');
            $table->foreign('Userid')->references('Userid')->on('users')->onDelete('NO ACTION');


            $table->string('Status');
            $table->dateTime('created_at')->default(DB::raw('GETDATE()'));
            $table->dateTime('updated_at')->nullable();
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trip_matches');
    }
};
