<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'title',
        'description',
        'short_description',
        'price',
        'compare_price',
        'image',
        'category_id',
        'brand_id',
        'size_id',
        'qty',
        'sku',
        'status',
        'barcode',
        'is_Featured',
        'is_approved',
        'store_id',
    ];

    // vendor
    public function vendor()
    {
        return $this->belongsTo(Store::class, 'store_id');
    }

    protected $appends = ['image_url'];

    public function product_images()
    {
        return $this->hasMany(ProductImg::class);
    }

    public function product_sizes()
    {
        return $this->belongsToMany(Size::class, 'product_sizes', 'product_id', 'size_id');
    }
    // img-url
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }
        return asset('storage/product/' . $this->image);
    }

    public function order_items()
    {
        return $this->hasMany(OrderItem::class);
    }

    // comments
    public function comments()
    {
        return $this->hasMany(Comment::class);
    }
    // ratings
    public function ratings()
    {
        return $this->hasMany(Review::class);
    }
    // likes
    public function likes()
    {
        return $this->morphMany(Like::class, 'likeable');
    }
}
