<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Role extends Model
{
    use HasFactory;

    protected $primaryKey = 'Roleid';

    protected $fillable = [
        'Userid',
        'Name',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'Userid');
    }
}
