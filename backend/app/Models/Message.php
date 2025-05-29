<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $primaryKey = 'messagesid';

    protected $fillable = [
        'sender_id',
        'receiver_id',
        'message',
        'read_at',
    ];

    protected $casts = [
        'read_at' => 'datetime',
    ];

    public $timestamps = true; // or false if not used

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id', 'Userid');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id', 'Userid');
    }
}
