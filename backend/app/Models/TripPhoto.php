<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripPhoto extends Model
{
    use HasFactory;

    protected $primaryKey = 'Tripphotosid';
    public $incrementing = true;
    public $timestamps = false; 

    protected $fillable = [
        'Tripid',
        'image_path',
        'caption',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'Tripid');
    }
}
