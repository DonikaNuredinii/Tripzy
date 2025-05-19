<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    protected $primaryKey = 'Tripid';

    protected $fillable = [
        'Userid',
        'title',
        'Description',
        'Destination_country',
        'Destination_city',
        'Departuredate',
        'Return_date',
        'Travel_STYLE',
        'Budget_estimated',
        'Looking_for',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'Userid');
    }

    public function comments()
    {
        return $this->hasMany(TripComment::class, 'Tripid');
    }

    public function photos()
    {
        return $this->hasMany(TripPhoto::class, 'Tripid');
    }

    public function matches()
    {
        return $this->hasMany(TripMatch::class, 'Tripid');
    }

    public function country()
    {
        return $this->hasOne(Country::class, 'Tripid');
    }
}