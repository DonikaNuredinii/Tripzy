<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Country extends Model
{
    protected $primaryKey = 'Countryid';
    public $timestamps = false;

    protected $fillable = [
        'Tripid',
        'Name',
        'Image_path',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'Tripid');
    }
}