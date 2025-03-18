<?php

namespace App\Models\Shared;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Business extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'registration_number',
        'email',
        'phone',
        'website',
        'address_line_1',
        'address_line_2',
        'city',
        'state',
        'postal_code',
        'country',
        'industry_id',
        'reseller_id',
        'subscription_status', // active, trial, suspended, cancelled
        'environment',         // production, staging, development
        'notes',
    ];

    protected $casts = [
        'settings' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the tenant associated with this business
     */
    public function tenant(): HasOne
    {
        return $this->hasOne(Tenant::class);
    }

    /**
     * Relationship to the reseller
     */
    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    /**
     * Relationship to users who belong to this business
     */
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'user_businesses')
            ->withPivot('is_primary', 'is_business_admin')
            ->withTimestamps();
    }

    /**
     * Relationship to the current active subscription
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)->where('status', 'active')->latest();
    }

    /**
     * Relationship to all subscriptions
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Relationship to invoices
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Relationship to business invitations
     */
    public function invitations(): HasMany
    {
        return $this->hasMany(BusinessInvitation::class);
    }

    /**
     * Get active modules for this business through the subscription
     */
    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'business_modules')
            ->withPivot('is_active', 'version')
            ->withTimestamps();
    }

    /**
     * Create a business and its associated tenant
     *
     * @param array $businessData
     * @param string|null $domain
     * @return self
     */
    public static function createWithTenant(array $businessData, ?string $domain = null): self
    {
        $business = static::create($businessData);

        // Create a tenant for this business
        Tenant::createForBusiness($business, $domain);

        return $business;
    }

    /**
     * Check if this business has access to a specific module
     *
     * @param string $moduleCode
     * @return bool
     */
    public function hasModule(string $moduleCode): bool
    {
        return $this->modules()
            ->where('code', $moduleCode)
            ->wherePivot('is_active', true)
            ->exists();
    }

    /**
     * Check if this business is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return $this->subscription_status === 'active';
    }
}
