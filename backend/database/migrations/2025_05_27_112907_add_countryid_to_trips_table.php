<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up()
{
    Schema::table('trips', function (Blueprint $table) {
        if (!Schema::hasColumn('trips', 'Destination_country')) {
            $table->unsignedBigInteger('Destination_country')->nullable();
            $table->foreign('Destination_country')->references('Countryid')->on('countries')->onDelete('set null');
        }
    });
}


    public function down()
{
    Schema::table('trips', function (Blueprint $table) {
        // Safe FK drop
        DB::statement("
            IF EXISTS (
                SELECT * FROM sys.foreign_keys 
                WHERE name = 'trips_destination_country_foreign'
            )
            ALTER TABLE trips DROP CONSTRAINT trips_destination_country_foreign
        ");

        if (Schema::hasColumn('trips', 'Destination_country')) {
            $table->dropColumn('Destination_country');
        }
    });
}

};

