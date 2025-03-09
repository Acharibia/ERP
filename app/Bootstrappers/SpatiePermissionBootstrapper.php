<?php

namespace App\Bootstrappers;

use Illuminate\Contracts\Foundation\Application;
use Spatie\Permission\PermissionRegistrar;
use Stancl\Tenancy\Contracts\TenancyBootstrapper;
use Stancl\Tenancy\Contracts\Tenant;

class SpatiePermissionBootstrapper implements TenancyBootstrapper
{
    protected PermissionRegistrar $permissionRegistrar;

    public function __construct(Application $app)
    {
        $this->permissionRegistrar = $app->make(PermissionRegistrar::class);
    }

    public function bootstrap(Tenant $tenant): void
    {
        // Set tenant-specific cache key
        $this->permissionRegistrar->cacheKey = 'spatie.permission.cache.tenant.' . $tenant->getTenantKey();

        // Clear cache to ensure we're using fresh permissions
        $this->permissionRegistrar->forgetCachedPermissions();
    }

    public function revert(): void
    {
        // Reset to central cache key
        $this->permissionRegistrar->cacheKey = 'spatie.permission.cache';

        // Clear cache again when reverting
        $this->permissionRegistrar->forgetCachedPermissions();
    }
}
