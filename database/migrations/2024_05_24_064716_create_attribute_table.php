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
        Schema::create('attribute', function (Blueprint $table) {
            $table->smallIncrements('attributeId')->primary()->unsigned();
            $table->smallInteger('entityTypeId')->unsigned()->default(0);
            $table->foreign('entityTypeId')->references('entityTypeId')->on('entity_type');
            $table->string('attributeCode')->nullable();
            $table->string('backendType', 8)->nullable();
            $table->string('frontendType', 50)->nullable();
            $table->smallInteger('isRequired')->unsigned()->default(0);
            $table->text('defaultValue')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attribute');
    }
};
