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
        Schema::create('countries', function (Blueprint $table) {
            $table->increments('Countryid');
           $table->unsignedBigInteger('Tripid');

            $table->string('Name');
            $table->string('Image_path')->nullable();

            $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');
        });
    }



    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('countries');
    }
};
