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
        Schema::create('catalog_category_text', function (Blueprint $table) {
            $table->integerIncrements('valueId')->primary()->unsigned();
            $table->smallInteger('entityTypeId')->unsigned()->default(0);
            $table->foreign('entityTypeId')->references('entityTypeId')->on('entity_type');
            $table->smallInteger('attributeId')->unsigned()->default(0);
            $table->foreign('attributeId')->references('attributeId')->on('attribute');
            $table->integer('categoryId')->unsigned()->default(0);
            $table->foreign('categoryId')->references('categoryId')->on('category');
            $table->text('value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('catalog_category_product_text');
    }
};
