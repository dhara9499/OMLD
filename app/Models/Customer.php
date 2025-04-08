<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $table = 'customer';

    protected $primaryKey = 'customerId';

    public function customerInt()
    {
        return $this->hasMany(CustomerInt::class, 'customerId', 'customerId');
    }

    public function customerVarchar()
    {
        return $this->hasMany(CustomerVarchar::class, 'customerId', 'customerId');
    }

    public function customerText()
    {
        return $this->hasMany(CustomerText::class, 'customerId', 'customerId');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
