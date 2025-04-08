<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeOption extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $table = 'attribute_option';

    protected $primaryKey = 'optionId';

    protected $fillable = ['attributeId'];


    public function attributeOptionValue()
    {
        return $this->hasMany(AttributeOptionValue::class, 'optionId');
    }

    public function attribute()
    {
        return $this->belongsTo(Attribute::class, 'attributeId');
    }
}
