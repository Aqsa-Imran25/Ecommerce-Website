<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('sub_total', 10, 2);
            $table->decimal('shipping', 10, 2);
            $table->decimal('grand_total', 10, 2);
            $table->decimal('discount', 10, 2);
            $table->enum('status', ['pending', 'delivered', 'shipped', 'cancelled'])->default('pending');
            $table->string('phone_num');
            $table->string('city');
            $table->string('state');
            $table->string('zip');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
