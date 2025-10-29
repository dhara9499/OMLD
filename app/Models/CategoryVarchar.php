<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CategoryVarchar extends Model
{
    use HasFactory;

    protected $table = 'catalog_category_varchar';

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attributeId', 'attributeId');
    }
}
