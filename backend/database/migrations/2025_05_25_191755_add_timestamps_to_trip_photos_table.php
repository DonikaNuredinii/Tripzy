<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::table('trip_photos', function (Blueprint $table) {
            if (!Schema::hasColumn('trip_photos', 'created_at') &&
                !Schema::hasColumn('trip_photos', 'updated_at')) {
                $table->timestamps();
            }
        });
    }

    public function down()
    {
        Schema::table('trip_photos', function (Blueprint $table) {
            if (Schema::hasColumn('trip_photos', 'created_at')) {
                $table->dropColumn('created_at');
            }

            if (Schema::hasColumn('trip_photos', 'updated_at')) {
                $table->dropColumn('updated_at');
            }
        });
    }
};
