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
        Schema::create('product', function (Blueprint $table) {
            $table->integerIncrements('productId')->primary()->unsigned();
            $table->string('productType', 32)->default('simple');
            $table->string('sku')->nullable();
            $table->smallInteger('entityTypeId')->unsigned()->default(0);
            $table->foreign('entityTypeId')->references('entityTypeId')->on('entity_type');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product');
    }
};
