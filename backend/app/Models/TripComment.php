<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripComment extends Model
{
    protected $primaryKey = 'Tripcommentsid';
    public $timestamps = false;

    protected $fillable = [
        'Tripid',
        'Userid',
        'Comment',
        'Created_at',
    ];

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'Tripid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'Userid');
    }
}