<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->unsignedInteger('Countryid')->nullable()->after('Userid');
            $table->foreign('Countryid')->references('Countryid')->on('countries')->onDelete('set null');
        });
    }

    public function down()
    {
        Schema::table('trips', function (Blueprint $table) {
            $table->dropForeign(['Countryid']);
            $table->dropColumn('Countryid');
        });
    }
};

