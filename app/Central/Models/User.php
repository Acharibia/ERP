<?php
namespace App\Central\Models;

use App\Support\Helpers\TenantHelper;
use App\Tenant\Core\Models\User as TenantUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Permission\Traits\HasRoles;
use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Stancl\Tenancy\Database\Models\TenantPivot;

class User extends Authenticatable implements HasMedia
{
    use HasApiTokens, SoftDeletes, HasFactory, Notifiable, HasRoles, CentralConnection, InteractsWithMedia;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'global_id',
        'name',
        'email',
        'password',
        'email_verified_at',
        'status',
        'last_login_at',
        'last_login_ip',
        'password_changed_at',
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
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at'   => 'datetime',
        'password'            => 'hashed',
        'last_login_at'       => 'datetime',
        'password_changed_at' => 'datetime',
    ];

    public function getProfilePictureUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('profile_picture') ?: null;
    }

    /**
     * Get the tenants that this user belongs to.
     */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'tenant_users', 'global_user_id', 'tenant_id', 'global_id')
            ->using(TenantPivot::class);
    }

    /**
     * Get the businesses that belong to the user.
     */
    public function businesses(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'user_businesses')
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
        return $this->hasRole('system_admin', 'central');
    }

    /**
     * Check if the user is a reseller
     */
    public function isReseller(): bool
    {
        return $this->hasRole('reseller', 'central');
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
        return ! $this->password_changed_at ||
        $this->password_changed_at->addDays(90)->isPast();
    }

    /**
     * Get the user's notifications.
     */
    public function notifications(): HasMany
    {
        return $this->hasMany(UserNotification::class, 'user_id');
    }

    /**
     * Create a user in both the central and tenant DBs.
     *
     * @param array $userData
     * @param \App\Central\Models\Business $business
     * @return self
     */
    public static function createInCentralAndTenant(array $userData, \App\Central\Models\Business $business): self
    {
        $centralUser = self::firstOrCreate(
            ['email' => $userData['email']],
            [
                'name'              => $userData['name'],
                'password'          => bcrypt($userData['password']),
                'status'            => 'active',
                'email_verified_at' => now(),
            ]
        );

        if ($business->tenant) {
            TenantHelper::runInTenantContext($business->tenant, function () use ($centralUser) {
                TenantUser::firstOrCreate(
                    ['email' => $centralUser->email],
                    [
                        'global_id'         => $centralUser->global_id,
                        'name'              => $centralUser->name,
                        'password'          => $centralUser->password, // already hashed
                        'email_verified_at' => $centralUser->email_verified_at,
                        'status'            => 'active',
                    ]
                );
            });
        }

        return $centralUser;
    }

    /**
     * Check if the user has admin access (system_admin or admin role).
     */
    public function hasAdminAccess(): bool
    {
        return $this->hasRole('system_admin', 'central') || $this->hasRole('admin', 'central');
    }

    /**
     * Check if the user has reseller access (reseller role).
     */
    public function hasResellerAccess(): bool
    {
        return $this->hasRole('reseller', 'central');
    }

    /**
     * Get the corresponding tenant user for a given business/tenant.
     *
     * @param \App\Central\Models\Business $business
     * @return \App\Tenant\Core\Models\User|null
     */
    public function tenantUser(Business $business)
    {
        if (! $business->tenant) {
            return null;
        }
        return TenantHelper::runInTenantContext($business->tenant, function () {
            return TenantUser::where('global_id', $this->global_id)->first();
        });
    }

    /**
     * Get all tenant users for this central user across all tenants.
     * This method returns a collection of tenant users from different tenants.
     *
     * @return \Illuminate\Support\Collection
     */
    public function getAllTenantUsers()
    {
        $tenantUsers = collect();

        foreach ($this->tenants as $tenant) {
            $tenantUser = TenantHelper::runInTenantContext($tenant, function () {
                return TenantUser::where('global_id', $this->global_id)->first();
            });

            if ($tenantUser) {
                $tenantUsers->push($tenantUser);
            }
        }

        return $tenantUsers;
    }

    /**
     * Check if the user is an admin for a specific business/tenant.
     *
     * @param Business $business
     * @return bool
     */
    public function isBusinessAdmin(Business $business): bool
    {
        if (! $business->tenant) {
            return false;
        }
        return TenantHelper::runInTenantContext($business->tenant, function () {
            $tenantUser = TenantUser::where('global_id', $this->global_id)->first();
            return $tenantUser ? ($tenantUser->hasRole('OWNER') || $tenantUser->hasRole('ADMINISTRATOR')) : false;
        });
    }

    /**
     * Check if the user can access a specific module in a business/tenant.
     *
     * @param Business $business
     * @param string $moduleCode (e.g., 'core', 'hr')
     * @return bool
     */
    public function canAccessModule(Business $business, string $moduleCode): bool
    {
        if (! $business->tenant) {
            return false;
        }
        $permission = strtoupper($moduleCode) . '_ACCESS';
        return TenantHelper::runInTenantContext($business->tenant, function () use ($permission) {
            $tenantUser = TenantUser::where('global_id', $this->global_id)->first();
            return $tenantUser ? $tenantUser->can($permission) : false;
        });
    }

    /**
     * Boot method to auto-generate global_id
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->global_id)) {
                $model->global_id = (string) Str::uuid();
            }
        });
    }
}
