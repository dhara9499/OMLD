<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OrderItems extends Model
{
    use HasFactory;

    protected $table = 'order_items';

    protected $primaryKey = 'itemId';

    protected $fillable = [
        'orderId', 'productId', 'qty', 'sku', 'name', 'productCost', 'productTax', 'productTotal', 'rowCost', 'rowTax', 'rowTotal'  
    ];

    public function order()
    {
        return $this->belongsTo(Order::class, 'orderId', 'orderId');
    }
}
