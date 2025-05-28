<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
  public function index()
{
    return Notification::where('user_id', auth()->id())
        ->orderByDesc('created_at')
        ->get();
}

}
