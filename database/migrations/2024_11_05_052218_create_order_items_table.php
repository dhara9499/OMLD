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
        Schema::create('order_items', function (Blueprint $table) {
            $table->integerIncrements('itemId')->primary()->unsigned();
            $table->integer('productId')->unsigned();
            $table->integer('orderId')->unsigned();
            $table->decimal('qty', 12, 4)->default(0);
            $table->string('sku')->nullable();
            $table->string('name')->nullable();
            $table->decimal('productCost', 12, 4)->default(0);
            $table->decimal('productTax', 12, 4)->default(0);
            $table->decimal('productTotal',12,4)->default(0);
            $table->decimal('rowCost', 12, 4)->default(0);
            $table->decimal('rowTax', 12, 4)->default(0);
            $table->decimal('rowTotal',12,4)->default(0);
            $table->foreign('productId')->references('productId')->on('product');
            $table->foreign('orderId')->references('orderId')->on('orders');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
