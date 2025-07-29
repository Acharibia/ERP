<?php

namespace App\Tenant\HR\Providers;

use App\Tenant\HR\Console\Commands\GenerateSchedulesCommand;
use Illuminate\Support\ServiceProvider;

class HRServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                GenerateSchedulesCommand::class,
            ]);
        }
    }
}
