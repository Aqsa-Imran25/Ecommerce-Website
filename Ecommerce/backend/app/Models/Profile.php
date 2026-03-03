<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    protected $fillable = [
        'user_id',
        'phone_num',
        'city',
        'state',
        'zip',
    ];
    // user
     public function user()
    {
        return $this->belongsTo(User::class);
    }
}
