<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    protected $table = 'orders';

    protected $primaryKey = 'orderId';

    protected $fillable = [
        'grandTotal', 'customerId', 'subTotal', 'TaxAmount', 'shippingAddressId', 'discount', 'discountType'  
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItems::class, 'orderId', 'orderId');
    }

}
