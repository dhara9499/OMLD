<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $table = 'category';

    protected $primaryKey = 'categoryId';

    public function children()
    {
        return $this->hasMany(Category::class, 'parentId')->with('children');
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parentId');
    }
}