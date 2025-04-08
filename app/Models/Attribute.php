<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attribute extends Model
{
    use HasFactory;

    protected $table = 'attribute';

    protected $primaryKey = 'attributeId';

    public function attributeOptions()
    {
        return $this->hasMany(AttributeOption::class, 'attribute_id');
    }

    public function productInt()
    {
        return $this->hasMany(ProductInt::class, 'attributeId', 'attributeId');
    }

    public function productDecimal()
    {
        return $this->hasMany(ProductDecimal::class, 'attributeId', 'attributeId');
    }

    public function productVarchar()
    {
        return $this->hasMany(ProductVarchar::class, 'attributeId', 'attributeId');
    }

    public function productText()
    {
        return $this->hasMany(ProductText::class, 'attributeId', 'attributeId');
    }

    public function customerInt()
    {
        return $this->hasMany(CustomerInt::class, 'attributeId', 'attributeId');
    }

    public function customerVarchar()
    {
        return $this->hasMany(CustomerVarchar::class, 'attributeId', 'attributeId');
    }

    public function customerText()
    {
        return $this->hasMany(CustomerText::class, 'attributeId', 'attributeId');
    }
}
