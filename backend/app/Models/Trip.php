<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Trip extends Model
{
    use HasFactory;

    protected $primaryKey = 'Tripid';
    public $incrementing = true;

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

    protected $appends = ['liked_by_user'];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'Userid', 'Userid');
    }

    public function comments()
    {
        return $this->hasMany(TripComment::class, 'Tripid', 'Tripid');
    }

    public function photos()
    {
        return $this->hasMany(TripPhoto::class, 'Tripid', 'Tripid');
    }

    public function matches()
    {
        return $this->hasMany(TripMatch::class, 'Tripid', 'Tripid');
    }

    public function country()
    {
        return $this->belongsTo(Country::class, 'Destination_country', 'name');
    }

    public function likes()
    {
        return $this->hasMany(TripLike::class, 'Tripid');
    }

    // Auto-included in JSON
    public function getLikedByUserAttribute()
    {
        if (!auth()->check()) {
            return false;
        }

        return $this->likes()->where('Userid', auth()->id())->exists();
    }

    // Manual check if needed elsewhere
    public function isLikedBy($userId)
    {
        return $this->likes()->where('Userid', $userId)->exists();
    }
}
