<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'product';

    protected $primaryKey = 'productId';

    public function productInt()
    {
        return $this->hasMany(ProductInt::class, 'productId', 'productId');
    }

    public function productDecimal()
    {
        return $this->hasMany(ProductDecimal::class, 'productId', 'productId');
    }

    public function productVarchar()
    {
        return $this->hasMany(ProductVarchar::class, 'productId', 'productId');
    }

    public function productText()
    {
        return $this->hasMany(ProductText::class, 'productId', 'productId');
    }

}
