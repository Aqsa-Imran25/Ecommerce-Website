<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment_setting extends Model
{
    protected $table = 'payment_settings';
   protected $fillable = [
    'cod_enabled',
    'commission',
    'currency',
    'store_id',
];
  public function store()
    {
        return $this->belongsTo(Store::class);
    }
}
