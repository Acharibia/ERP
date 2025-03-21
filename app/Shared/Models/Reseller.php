<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Reseller extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'company_name',
        'contact_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'status',
        'verification_status',
        'commission_rate',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'commission_rate' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get businesses managed by this reseller
     */
    public function businesses(): HasMany
    {
        return $this->hasMany(Business::class);
    }

    /**
     * Get users associated with this reseller
     */
    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }

    /**
     * Get invoices issued by this reseller
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }


    /**
     * Get API keys for this reseller
     */
    public function apiKeys(): HasMany
    {
        return $this->hasMany(ApiKey::class);
    }

    /**
     * Check if the reseller is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the reseller is verified
     */
    public function isVerified(): bool
    {
        return $this->verification_status === 'verified';
    }

    /**
     * Get active businesses count
     */
    public function getActiveBusinessesCountAttribute(): int
    {
        return $this->businesses()->where('subscription_status', 'active')->count();
    }

    /**
     * Get the total number of active subscriptions across all businesses
     */
    public function getActiveSubscriptionsCountAttribute(): int
    {
        $businessIds = $this->businesses()->pluck('id');
        return Subscription::whereIn('business_id', $businessIds)
            ->where('status', 'active')
            ->count();
    }

    /**
     * Get the total revenue from this reseller's businesses
     */
    public function getTotalRevenueAttribute(): float
    {
        $businessIds = $this->businesses()->pluck('id');
        return Invoice::whereIn('business_id', $businessIds)
            ->where('status', 'paid')
            ->sum('total_amount');
    }
}
