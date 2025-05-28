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
        'sender_id', 
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
    public function sender()
{
    return $this->belongsTo(User::class, 'sender_id');
}

}