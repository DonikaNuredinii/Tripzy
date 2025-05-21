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
    Schema::table('users', function ($table) {
        $table->unsignedBigInteger('Roleid')->nullable()->after('Verified');

        $table->foreign('Roleid')
              ->references('Roleid')
              ->on('roles')
              ->onDelete('no action');
    });
}

public function down()
{
    Schema::table('users', function ($table) {
        $table->dropForeign(['Roleid']);
        $table->dropColumn('Roleid');
    });
}

};
