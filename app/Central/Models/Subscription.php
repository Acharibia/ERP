<?php

namespace App\Central\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class Subscription extends Model
{
    use HasFactory, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'package_id',
        'status',
        'start_date',
        'end_date',
        'trial_ends_at',
        'is_auto_renew',
        'price_override',
        'billing_cycle',
        'user_limit_override',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'trial_ends_at' => 'date',
        'is_auto_renew' => 'boolean',
        'price_override' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the business that owns the subscription
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the package for this subscription
     */
    public function package(): BelongsTo
    {
        return $this->belongsTo(Package::class);
    }

    /**
     * Get invoices for this subscription
     */
    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    /**
     * Check if subscription is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if subscription is in trial period
     */
    public function isOnTrial(): bool
    {
        return $this->trial_ends_at !== null && now()->lt($this->trial_ends_at);
    }

    /**
     * Check if subscription has expired
     */
    public function hasExpired(): bool
    {
        return now()->gt($this->end_date);
    }

    /**
     * Check if subscription will expire soon (within 14 days)
     */
    public function willExpireSoon(): bool
    {
        return now()->diffInDays($this->end_date) <= 14;
    }

    /**
     * Get the effective price (either the package price or the override)
     */
    public function getEffectivePriceAttribute(): float
    {
        return $this->price_override ?? $this->package->base_price;
    }

    /**
     * Get the effective user limit (either the package limit or the override)
     */
    public function getEffectiveUserLimitAttribute(): ?int
    {
        return $this->user_limit_override ?? $this->package->user_limit;
    }
}
