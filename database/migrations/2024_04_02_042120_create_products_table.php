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
        Schema::create('products', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 255);
            $table->string('unique_number', 255)->unique();
            $table->integer('qty')->default(0);
            $table->decimal('land_price', 10, 2)->default(0);
            $table->decimal('selling_price', 10, 2)->default(0);
            $table->smallInteger('discount_type')->comment('0 - amount, 1 - percentage')->default(0);
            $table->double('discount')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
