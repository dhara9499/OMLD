<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductInt extends Model
{
    use HasFactory;

    protected $fillable = ['attributeId','productId'];

    protected $table = 'product_int';

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId', 'productId');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attributeId', 'attributeId');
    }
}
