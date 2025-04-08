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
        Schema::create('customer_address_int', function (Blueprint $table) {
            $table->integerIncrements('valueId')->primary()->unsigned();
            $table->smallInteger('entityTypeId')->unsigned()->default(0);
            $table->foreign('entityTypeId')->references('entityTypeId')->on('entity_type');
            $table->smallInteger('attributeId')->unsigned()->default(0);
            $table->foreign('attributeId')->references('attributeId')->on('attribute');
            $table->integer('addressId')->unsigned()->default(0);
            $table->foreign('addressId')->references('addressId')->on('customer_address');
            $table->integer('value')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_address_int');
    }
};
