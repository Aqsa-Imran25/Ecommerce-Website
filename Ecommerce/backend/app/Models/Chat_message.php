<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Chat_message extends Model
{
    protected $fillable = ['user_id', 'message', 'response'];

    // user
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
