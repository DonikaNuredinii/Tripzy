<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TripLike extends Model
{
    protected $table = 'trip_likes';

    protected $fillable = ['Tripid', 'Userid'];

    public $timestamps = true;

    public function trip()
    {
        return $this->belongsTo(Trip::class, 'Tripid');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'Userid');
    }
}
