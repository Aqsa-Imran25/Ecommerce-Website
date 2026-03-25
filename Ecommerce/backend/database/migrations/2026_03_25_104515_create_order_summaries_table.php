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
        Schema::create('order_summaries', function (Blueprint $table) {
            $table->id();
            $table->string('total_orders');
            $table->integer('total_price');
            $table->integer('fees');
            $table->integer('total_receiveable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_summaries');
    }
};
