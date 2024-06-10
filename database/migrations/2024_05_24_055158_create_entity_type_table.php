<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('entity_type', function (Blueprint $table) {
            $table->smallIncrements('entityTypeId')->unsigned();
            $table->string('entityTypeCode', 50)->unique();
        });
        
        //insert table rows
        DB::table('entity_type')->insert([
            ['entityTypeCode' => 'customer'],
            ['entityTypeCode' => 'customer_address'],
            ['entityTypeCode' => 'category'],
            ['entityTypeCode' => 'product'],
            ['entityTypeCode' => 'order'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('entity_type');
    }
};
