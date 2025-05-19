<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TripMatch extends Model
{
    protected $primaryKey = 'trip_matchesid';

    protected $fillable = [
        'Tripid',
        'Userid',
        'Status',
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