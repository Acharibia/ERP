<?php

namespace App\Central\Models;

use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Stancl\Tenancy\Database\Models\Tenant as BaseTenant;
use Stancl\Tenancy\Contracts\TenantWithDatabase;
use Stancl\Tenancy\Database\Concerns\HasDatabase;
use Stancl\Tenancy\Database\Concerns\HasDomains;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Stancl\Tenancy\Database\Models\TenantPivot;
use App\Central\Models\User as CentralUser;

class Tenant extends BaseTenant implements TenantWithDatabase
{
    use HasDatabase, HasDomains, CentralConnection;

    protected $fillable = [
        'id',
        'data',
    ];

    protected $casts = [
        'data' => 'array',
    ];

    /**
     * Get the users that belong to this tenant.
     */
    public function users()
    {
        return $this->belongsToMany(CentralUser::class, 'tenant_users', 'tenant_id', 'global_user_id', 'id', 'global_id')
            ->using(TenantPivot::class);
    }

    /**
     * Get the business associated with this tenant
     */
    public function business(): HasOne
    {
        return $this->hasOne(Business::class, 'tenant_id');
    }

    /**
     * Get business name from data or relationship
     */
    public function getBusinessNameAttribute(): ?string
    {
        return $this->data['business_name'] ?? $this->business?->name;
    }

    /**
     * Get business email from data or relationship
     */
    public function getBusinessEmailAttribute(): ?string
    {
        return $this->data['business_email'] ?? $this->business?->email;
    }
}
