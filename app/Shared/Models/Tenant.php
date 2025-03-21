<?php

namespace App\Shared\Models;

use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Str;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    protected $fillable = [
        'id',
        'business_id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    use HasDatabase, HasDomains;

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
        $tenant = static::create([
            'id' => Str::slug($business->name) . '-' . uniqid(),
            'business_id' => $business->id,
        ]);

        if ($domain) {
            $tenant->domains()->create(['domain' => $domain]);
        }

        return $tenant;
    }
}
