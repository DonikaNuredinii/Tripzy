<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        if (Schema::hasColumn('countries', 'Tripid')) {
            Schema::table('countries', function (Blueprint $table) {
                $table->dropForeign(['Tripid']); // nëse ka foreign key
                $table->dropColumn('Tripid');
            });
        }
    }

    public function down()
    {
        Schema::table('countries', function (Blueprint $table) {
            $table->unsignedBigInteger('Tripid')->nullable();
            $table->foreign('Tripid')->references('Tripid')->on('trips')->onDelete('cascade');
        });
    }
};

