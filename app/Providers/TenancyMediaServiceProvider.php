<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Spatie\MediaLibrary\MediaCollections\Models\Media;
use Stancl\Tenancy\Events;
use Illuminate\Support\Facades\DB;

class TenancyMediaServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Register events for handling media in tenant and central contexts
        $this->app['events']->listen(Events\TenancyBootstrapped::class, function (Events\TenancyBootstrapped $event) {
            // Set tenant-specific disk name for media library
            config(['media-library.disk_name' => 'tenant-media']);

            // Set path prefix for current tenant to isolate media files
            config(['filesystems.disks.tenant-media.root' => storage_path('app/tenant-' . $event->tenant->id . '/media')]);

            // Set media domain for tenant
            if (isset($event->tenant->domains[0])) {
                config(['media-library.domain' => $event->tenant->domains[0]]);
            }
        });

        $this->app['events']->listen(Events\TenancyEnded::class, function (Events\TenancyEnded $event) {
            // Reset back to central media configuration
            config(['media-library.disk_name' => 'central-media']);
            config(['filesystems.disks.central-media.root' => storage_path('app/central/media')]);
            config(['media-library.domain' => null]);
        });
    }
}
