<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Dom\Comment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;



class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens, HasRoles;
    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
   
    public function order()
    {
        return $this->hasMany(Order::class);
    }

    // profile
    public function profile()
    {
        return $this->hasOne(Profile::class);
    }

    // comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    // rating
    public function reviews()
    {
        return $this->hasMany(Review::class)->where('status', 'active');
    }

    // totalRating
    public function totalRatings()
    {
        return $this->reviews()->count();
    }

    // averagerating
    public function averageRatings()
    {
        return $this->reviews()->avg('rate');
    }

    // likes
    public function likes()
    {
        return $this->hasMany(Like::class);
    }
    // chat_messages
     public function chat_messages()
    {
        return $this->hasMany(Chat_message::class);
    }

    // store
     public function stores()
    {
        return $this->hasMany(Store::class);
    }
}
