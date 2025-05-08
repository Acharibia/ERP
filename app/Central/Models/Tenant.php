<?php

namespace App\Central\Models;

use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Stancl\Tenancy\Database\Models\TenantPivot;
use App\Central\Models\User as CentralUser;
use Str;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, CentralConnection;
    protected $fillable = [
        'id',
        'business_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];


    public function users()
    {
        return $this->belongsToMany(CentralUser::class, 'tenant_users', 'tenant_id', 'global_user_id', 'id', 'global_id')
            ->using(TenantPivot::class);
    }

    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Create a tenant for the given business
     *
     * @param Business $business
     * @param string|null $domain
     * @return self
     */
    public static function createForBusiness(Business $business, ?string $domain = null): self
    {
        // Create a more unique tenant ID
        $tenantId = Str::slug($business->name);

        // Use updateOrCreate to ensure unique tenant creation
        $tenant = static::updateOrCreate(
            ['id' => $tenantId],
            [
                'id' => $tenantId,
                'business_id' => $business->id,
                'business_name' => $business->name,
            ]
        );

        if ($domain) {
            // Check if the domain already exists for this tenant
            if (!$tenant->domains()->where('domain', $domain)->exists()) {
                $tenant->domains()->create(['domain' => $domain]);
            }
        }

        return $tenant;
    }
}
