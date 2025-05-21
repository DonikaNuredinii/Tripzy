<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('messages', function (Blueprint $table) {
            $table->id('messagesid');

            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('receiver_id');

            $table->text('message')->nullable();
            $table->timestamp('read_at')->nullable();
            $table->timestamps(); 

            $table->foreign('sender_id')
                ->references('Userid')
                ->on('users')
                ->onDelete('cascade');

            $table->foreign('receiver_id')
                ->references('Userid')
                ->on('users')
                ->onDelete('NO ACTION'); 
        });
    }

    public function down(): void {
        Schema::dropIfExists('messages');
    }
};
