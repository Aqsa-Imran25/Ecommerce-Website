<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment_setting extends Model
{
    protected $table = 'payment_settings';
    protected $fillable = [
        'website_fee',
        'total_price',
        'methods_cod',
        'currency',
        'store_id',
    ];
}
