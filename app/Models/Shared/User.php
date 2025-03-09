<?php

namespace App\Models\Shared;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

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
        'profile_photo_path',
        'last_login_at',
        'last_login_ip',
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
     * Relationship to businesses this user belongs to
     */
    public function businesses(): BelongsToMany
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
            ->wherePivot('is_primary', true)
            ->withTimestamps();
    }

    /**
     * Relationship to reseller (if this is a reseller user)
     */
    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    /**
     * Relationship to business role assignments
     */
    public function businessRoles(): HasMany
    {
        return $this->hasMany(BusinessRoleUser::class);
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
}
