<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerInt extends Model
{
    use HasFactory;

    protected $table = 'customer_int';

    protected $fillable = ['attributeId','customerId'];

    public function customer()
    {
        return $this->belongsTo(Customer::class, 'customerId', 'customerId');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attributeId', 'attributeId');
    }
}
