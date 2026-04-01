<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = ['user_id', 'name', 'logo', 'slug', 'status'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // product
    public function product()
    {
        return $this->hasMany(Product::class);
    }

    // product
    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // vendor-earnings
    public function earnings()
    {
        return $this->hasMany(Vendor_earnings::class);
    }
}
