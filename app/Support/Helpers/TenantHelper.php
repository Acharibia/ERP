<?php
namespace App\Support\Helpers;

class TenantHelper
{
    /**
     * Run a callback in the context of a given tenant.
     *
     * @param \Stancl\Tenancy\Contracts\Tenant $tenant
     * @param callable $callback
     * @return mixed
     */
    public static function runInTenantContext($tenant, callable $callback)
    {
        tenancy()->initialize($tenant);
        try {
            return $callback();
        } finally {
            tenancy()->end();
        }
    }
}
