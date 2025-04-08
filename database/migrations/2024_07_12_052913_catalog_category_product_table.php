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
        Schema::create('catalog_category_product', function (Blueprint $table) {
            $table->integer('productId')->unsigned()->default(0);
            $table->integer('categoryId')->unsigned()->default(0);
            $table->primary(['productId', 'categoryId']);
            $table->foreign('productId')->references('productId')->on('product');
            $table->foreign('categoryId')->references('categoryId')->on('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_category_product');
    }
};
