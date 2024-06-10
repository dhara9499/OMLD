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
        Schema::create('attribute_option', function (Blueprint $table) {
            $table->integerIncrements('optionId')->primary()->unsigned();
            $table->smallInteger('attributeId')->unsigned()->default(0);
            $table->foreign('attributeId')->references('attributeId')->on('attribute');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute_option');
    }
};
