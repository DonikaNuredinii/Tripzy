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
  Schema::create('trip_likes', function (Blueprint $table) {
    $table->id();
    $table->unsignedBigInteger('Tripid');
    $table->unsignedBigInteger('Userid');
    $table->timestamps();

    $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');
    $table->foreign('Userid')->references('Userid')->on('users');
    $table->unique(['Tripid', 'Userid']);
});

}

public function down()
{
    Schema::table('countries', function (Blueprint $table) {
        $table->unsignedBigInteger('Tripid')->nullable();
        $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');
    });
}

};
