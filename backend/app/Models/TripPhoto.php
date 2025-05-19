<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripPhoto extends Model
{
    protected $primaryKey = 'Tripphotosid';
    public $timestamps = false;

    protected $fillable = [
        'Tripid',
        'image_path',
        'caption',
        'created_at',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'Tripid');
    }
}