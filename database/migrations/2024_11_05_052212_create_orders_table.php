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
        Schema::create('orders', function (Blueprint $table) {
            $table->integerIncrements('orderId')->primary()->unsigned();
            $table->integer('customerId')->unsigned();
            $table->decimal('grandTotal', 12, 4)->nullable();
            $table->decimal('subTotal', 12, 4)->nullable();
            $table->decimal('taxAmount', 12, 4)->nullable();
            $table->integer('shippingAddressId')->nullable();
            $table->decimal('discount', 12, 4);
            $table->smallInteger('discountType')->default(1);
            $table->foreign('customerId')->references('customerId')->on('customer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
