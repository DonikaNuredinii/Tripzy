<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->bigIncrements('Userid'); // Custom PK from ERD
            $table->string('Name');
            $table->string('Lastname');
            $table->string('Email')->unique();
            $table->string('Password');
            $table->text('Bio')->nullable();
            $table->string('Profile_photo')->nullable();
            $table->date('Birthdate')->nullable();
            $table->string('Gender')->nullable();
            $table->string('Country')->nullable();
            $table->boolean('Verified')->default(false);
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken(); // adds `remember_token`
            $table->timestamps(); // adds `created_at` and `updated_at`
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
