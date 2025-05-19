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
        Schema::create('trips', function (Blueprint $table) {
            $table->increments('Tripid');
            $table->unsignedBigInteger('Userid');
            $table->string('title');
            $table->text('Description');
            $table->string('Destination_country');
            $table->string('Destination_city');
            $table->date('Departuredate');
            $table->date('Return_date');
            $table->string('Travel_STYLE');
            $table->decimal('Budget_estimated', 10, 2);
            $table->string('Looking_for');
            $table->dateTime('created_at')->default(DB::raw('GETDATE()'));
            $table->dateTime('updated_at')->nullable();

            $table->foreign('Userid')->references('id')->on('users')->onDelete('cascade');
        });
    }


    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('trips');
    }
};
