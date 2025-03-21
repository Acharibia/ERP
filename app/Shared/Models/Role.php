<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

use Spatie\Permission\Models\Role as SpatieRole;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class Role extends SpatieRole
{
    use HasFactory, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
        'scope_type',
        'scope_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The permissions that belong to the role.
     */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(
            Permission::class,
            'role_has_permissions',
            'role_id',
            'permission_id'
        );
    }

    /**
     * The business invitations that reference this role.
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(BusinessInvitation::class);
    }

    /**
     * Check if the role is a system-level role.
     */
    public function isSystemRole(): bool
    {
        return $this->scope_type === 'system';
    }

    /**
     * Check if the role is a reseller-level role.
     */
    public function isResellerRole(): bool
    {
        return $this->scope_type === 'reseller';
    }

    /**
     * Check if the role is a business-level role.
     */
    public function isBusinessRole(): bool
    {
        return $this->scope_type === 'business';
    }

    /**
     * Check if the role is a global role.
     */
    public function isGlobalRole(): bool
    {
        return $this->scope_type === null;
    }

    /**
     * Assign permissions to the role.
     */
    public function assignPermissions(array $permissionIds): self
    {
        $this->permissions()->sync($permissionIds, false);

        return $this;
    }

    /**
     * Revoke permissions from the role.
     */
    public function revokePermissions(array $permissionIds): self
    {
        $this->permissions()->detach($permissionIds);

        return $this;
    }
}
