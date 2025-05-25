<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Support\Facades\Hash;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'Userid';
    public $incrementing = true;

    public const CREATED_AT = 'Created_At';
    public const UPDATED_AT = 'Updated_At';

    protected $fillable = [
        'Name',
        'Lastname',
        'Email',
        'Password',
        'Bio',
        'Profile_photo',
        'Birthdate',
        'Gender',
        'Country',
        'Verified',
        'Created_At',
        'Updated_At',
        'Roleid',
    ];

    protected $hidden = [
        'Password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'Birthdate'         => 'date',
        'Verified'          => 'boolean',
        'Created_At'        => 'datetime',
        'Updated_At'        => 'datetime',
    ];

    // Automatically hash password
    public function setPasswordAttribute($value)
    {
        if (!empty($value)) {
            $this->attributes['Password'] = Hash::needsRehash($value) ? Hash::make($value) : $value;
        }
    }

    // Relationships

    

    public function documents()
    {
        return $this->hasMany(UserIdDocument::class, 'Userid');
    }

    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'sender_id');
    }

    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'receiver_id');
    }

    public function trips()
    {
        return $this->hasMany(Trip::class, 'Userid');
    }

    public function tripComments()
    {
        return $this->hasMany(TripComment::class, 'Userid');
    }

    public function tripMatches()
    {
        return $this->hasMany(TripMatch::class, 'Userid');
    }

 public function role()
{
    return $this->belongsTo(Role::class, 'Roleid', 'Roleid');
}



}
