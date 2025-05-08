<?php

namespace App\Central\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Tenant\Models\User as TenantUser;
use Spatie\Permission\Traits\HasRoles;
use Stancl\Tenancy\Contracts\SyncMaster;
use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Stancl\Tenancy\Database\Concerns\ResourceSyncing;
use Stancl\Tenancy\Database\Models\TenantPivot;
use Str;

class User extends Authenticatable implements SyncMaster
{
    use HasApiTokens, ResourceSyncing, SoftDeletes, HasFactory, Notifiable, HasRoles, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_type',
        'is_super_admin',
        'reseller_id',
        'status',
        'last_login_at',
        'last_login_ip',
        'global_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the tenants that this user belongs to.
     */

    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_users', 'global_user_id', 'tenant_id', 'global_id')
            ->using(TenantPivot::class);
    }

    /**
     * Get the name of the tenant model.
     */
    public function getTenantModelName(): string
    {
        return TenantUser::class;
    }

    /**
     * Get the global identifier key.
     */
    public function getGlobalIdentifierKey()
    {
        return $this->getAttribute($this->getGlobalIdentifierKeyName());
    }

    /**
     * Get the name of the global identifier key.
     */
    public function getGlobalIdentifierKeyName(): string
    {
        return 'global_id';
    }

    /**
     * Get the name of the central model.
     */
    public function getCentralModelName(): string
    {
        return static::class;
    }

    /**
     * Get the attributes that should be synced.
     */
    public function getSyncedAttributeNames(): array
    {
        return [
            'name',
            'email',
            'password',
            'email_verified_at',
            'user_type',
            'status',
            'password_changed_at',
        ];
    }

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_login_at' => 'datetime',
        'is_super_admin' => 'boolean',
    ];

    /**
     * Relationship to user profile
     */
    public function profile(): HasOne
    {
        return $this->hasOne(UserProfile::class);
    }

    /**
     * Get the businesses that belong to the user.
     */
    public function businesses()
    {
        return $this->belongsToMany(Business::class, 'user_businesses')
            ->withPivot('is_primary', 'is_business_admin')
            ->withTimestamps();
    }

    /**
     * Get the primary business for this user
     */
    public function primaryBusiness(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'user_businesses')
            ->using(UserBusiness::class)
            ->wherePivot('is_primary', true)
            ->withTimestamps();
    }

    /**
     * Direct relationship to user business records
     */
    public function userBusinesses(): HasMany
    {
        return $this->hasMany(UserBusiness::class);
    }

    /**
     * Relationship to reseller (if this is a reseller user)
     */
    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    /**
     * Relationship to API keys created by this user
     */
    public function apiKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class);
    }

    /**
     * Relationship to business invitations created by this user
     */
    public function sentInvitations(): HasMany
    {
        return $this->hasMany(BusinessInvitation::class, 'invited_by');
    }

    /**
     * Check if the user is a system administrator
     */
    public function isSystemAdmin(): bool
    {
        return $this->user_type === 'system_admin' || $this->is_super_admin;
    }

    /**
     * Check if the user is a reseller
     */
    public function isReseller(): bool
    {
        return $this->user_type === 'reseller' && $this->reseller_id !== null;
    }

    /**
     * Check if the user is a business user
     */
    public function isBusinessUser(): bool
    {
        return $this->user_type === 'business_user';
    }

    /**
     * Check if the user is an admin for a specific business
     */
    public function isBusinessAdmin(Business $business): bool
    {
        return $this->businesses()
            ->wherePivot('business_id', $business->id)
            ->wherePivot('is_business_admin', true)
            ->exists();
    }

    /**
     * Check if the user has access to a specific business
     */
    public function hasBusinessAccess(int $businessId): bool
    {
        return $this->businesses()
            ->where('businesses.id', $businessId)
            ->exists();
    }

    /**
     * Track user login
     */
    public function trackLogin(string $ipAddress): void
    {
        $this->last_login_at = now();
        $this->last_login_ip = $ipAddress;
        $this->save();
    }

    /**
     * Check if password needs to be changed
     */
    public function passwordNeedsChange(): bool
    {
        // If password was never changed or changed more than 90 days ago
        return !$this->password_changed_at ||
            $this->password_changed_at->addDays(90)->isPast();
    }

    /**
     * Check if the user has reseller access.
     */
    public function hasResellerAccess(): bool
    {
        // Direct reseller access if user_type is 'reseller'
        if ($this->user_type === 'reseller') {
            return true;
        }

        // Check if the user has a reseller_id
        if (!empty($this->reseller_id)) {
            return true;
        }

        return false;
    }

    /**
     * Check if the user has admin access.
     */
    public function hasAdminAccess(): bool
    {
        // Super admins have admin access
        if ($this->is_super_admin) {
            return true;
        }

        // Users with user_type 'system_admin' have admin access
        if ($this->user_type === 'system_admin') {
            return true;
        }

        return false;
    }

    /**
     * Check if user can access a specific module for a business.
     *
     * Note: Actual permission checking should happen within the tenant context
     * This method only checks if the user is a business admin in the central database
     */
    public function canAccessModule(int $moduleId, int $businessId): bool
    {
        // Check if user is a business admin (which grants access to all modules)
        return $this->businesses()
            ->where('businesses.id', $businessId)
            ->wherePivot('is_business_admin', true)
            ->exists();

        // Note: Detailed permission checks should be done in the tenant context
        // using Spatie's permission system after switching to the tenant database
    }


    /**
     * Get the user's notifications.
     */
    public function notifications()
    {
        return $this->hasMany(UserNotification::class, 'user_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->global_id)) {
                $model->global_id = (string) Str::uuid();

                // Or simply use the same ID format as your existing IDs
                // $model->global_user_id = (string) $model->id;
            }
        });
    }
}
