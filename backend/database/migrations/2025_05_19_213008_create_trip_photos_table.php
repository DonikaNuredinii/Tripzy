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
        Schema::create('trip_photos', function (Blueprint $table) {
            $table->increments('Tripphotosid');
            $table->unsignedBigInteger('Tripid');

            $table->string('image_path');
            $table->string('caption')->nullable();
            $table->dateTime('created_at')->default(DB::raw('GETDATE()'));

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
        Schema::dropIfExists('trip_photos');
    }
};
