<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderDetail extends Model
{
    protected $table = 'order_details';
     protected $fillable = [
        'product_id',
        'initial_price',
        'discount',
        'fee',
        'total_fee',
    ];

}
