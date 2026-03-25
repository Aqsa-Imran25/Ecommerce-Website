<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderSummary extends Model
{
    protected $table='order_summaries';

      protected $fillable = [
        'total_orders',
        'total_price',
        'fees',
        'total_receiveable',
    ];
}
