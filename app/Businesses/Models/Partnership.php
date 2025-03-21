<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Partnership extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'description',
        'partnership_type',
        'start_date',
        'end_date',
        'status',
        'is_multi_party',
        'initiator_business_id',
        'lead_contact_id',
        'terms',
        'created_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_multi_party' => 'boolean',
    ];

    /**
     * Partnership types available in the system.
     */
    const PARTNERSHIP_TYPES = [
        'supplier',
        'distributor',
        'strategic',
        'joint_venture',
        'research',
        'technology',
        'marketing',
        'financial',
        'service',
        'other'
    ];

    /**
     * Possible statuses for a partnership.
     */
    const STATUSES = [
        'pending',
        'active',
        'suspended',
        'negotiating',
        'terminated',
        'completed'
    ];

    /**
     * Get the business that initiated the partnership.
     */
    public function initiatorBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'initiator_business_id');
    }

    /**
     * Get the lead contact for the partnership.
     */
    public function leadContact(): BelongsTo
    {
        return $this->belongsTo(User::class, 'lead_contact_id');
    }

    /**
     * Get the user who created the partnership.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all businesses participating in this partnership.
     */
    public function businesses(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'partnership_businesses')
            ->withPivot([
                'contact_person_id',
                'status',
                'joined_date',
                'exit_date'
            ])
            ->withTimestamps();
    }

    /**
     * Get all partnership-business relationships.
     */
    public function partnershipBusinesses(): HasMany
    {
        return $this->hasMany(PartnershipBusiness::class);
    }

    /**
     * Get active businesses in this partnership.
     */
    public function activeBusinesses(): BelongsToMany
    {
        return $this->businesses()->wherePivot('status', 'active');
    }

    /**
     * Check if the partnership is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get partnership duration in months.
     */
    public function getDurationInMonthsAttribute(): int
    {
        $endDate = $this->end_date ?? now();
        return $this->start_date->diffInMonths($endDate);
    }

    /**
     * Check if the partnership has ended.
     */
    public function hasEnded(): bool
    {
        return $this->status === 'terminated' || $this->status === 'completed' ||
            ($this->end_date && $this->end_date->isPast());
    }

    /**
     * Get the number of active businesses in the partnership.
     */
    public function getActiveBusinessCountAttribute(): int
    {
        return $this->partnershipBusinesses()->where('status', 'active')->count();
    }

    /**
     * Terminate the partnership.
     */
    public function terminate(string $reason = null): bool
    {
        $this->status = 'terminated';
        $this->end_date = $this->end_date ?? now();

        if ($reason) {
            // This assumes you might add a reason field or handle it elsewhere
            // You could store this in a notes field or in a related termination record
        }

        return $this->save();
    }
}
