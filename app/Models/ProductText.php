<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductText extends Model
{
    use HasFactory;

    protected $table = 'product_text';

    protected $fillable = ['attributeId','productId'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId', 'productId');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attributeId', 'attributeId');
    }
}
