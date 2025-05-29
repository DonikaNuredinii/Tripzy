<?php

namespace App\Providers;

use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Broadcast;

class EventServiceProvider extends ServiceProvider
{
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
    ];

    public function boot(): void
    {
        // ✅ Registers the /broadcasting/auth route
        Broadcast::routes(['middleware' => ['auth:sanctum']]);

        // ✅ Loads route/channel authorization logic
        require base_path('routes/channels.php');
    }

    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
