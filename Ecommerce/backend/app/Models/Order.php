<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'user_id',
        'sub_total',
        'shipping',
        'grand_total',
        'discount',
        'status',
        'phone_num',
        'city',
        'state',
        'zip',
    ];


    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

      public function payment()
    {
        return $this->hasOne(Payment::class);
    }
}
