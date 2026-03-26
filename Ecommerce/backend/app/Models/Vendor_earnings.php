<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor_earnings extends Model
{
    protected $fillable = ['store_id', 'order_id', 'amount', 'commission', 'net_amount'];

    public function store()
    {
        return $this->hasMany(Store::class);
    }
}
