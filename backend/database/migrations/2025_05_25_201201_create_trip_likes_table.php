<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('trip_likes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('Tripid');
            $table->unsignedBigInteger('Userid');
            $table->timestamps();

            // ✅ Cascade only on Trip deletion (safe)
            $table->foreign('Tripid')
                ->references('Tripid')
                ->on('trips')
                ->onDelete('cascade');

            // ✅ Avoid ON DELETE CASCADE for SQL Server conflict
            $table->foreign('Userid')
                ->references('Userid')
                ->on('users'); // No cascade here

            $table->unique(['Tripid', 'Userid']); // Prevent duplicate likes
        });
    }

    public function down()
    {
        Schema::dropIfExists('trip_likes');
    }
};
