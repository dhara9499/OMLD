<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AttributeOptionValue extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $primaryKey = 'valueId';

    protected $table = 'attribute_option_value';

    protected $fillable = ['optionId', 'value'];

    public function attribute()
    {
        return $this->belongsTo(AttributeOption::class, 'optionId');
    }
}
