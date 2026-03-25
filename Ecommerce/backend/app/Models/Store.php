<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    protected $fillable = ['user_id', 'name', 'status', 'logo', 'slug'];

     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
