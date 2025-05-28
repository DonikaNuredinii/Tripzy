<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\TripMatch;
use Carbon\Carbon;

class DeleteOldRejectedMatches extends Command
{
    protected $signature = 'matches:cleanup';

    protected $description = 'Delete rejected trip matches after 24 hours';

    public function handle()
    {
        TripMatch::where('Status', 'rejected')
            ->where('updated_at', '<=', now()->subDay())
            ->delete();

        $this->info('✅ Old rejected matches deleted successfully.');
    }
}
