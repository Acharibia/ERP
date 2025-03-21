<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PartnershipBusiness extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'partnership_businesses';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'partnership_id',
        'business_id',
        'contact_person_id',
        'status',
        'joined_date',
        'exit_date',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'joined_date' => 'date',
        'exit_date' => 'date',
    ];

    /**
     * Possible statuses for a business in a partnership.
     */
    const STATUSES = [
        'pending',
        'active',
        'suspended',
        'negotiating',
        'exited',
        'terminated'
    ];

    /**
     * Get the partnership that this relationship belongs to.
     */
    public function partnership(): BelongsTo
    {
        return $this->belongsTo(Partnership::class);
    }

    /**
     * Get the business in this relationship.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the contact person for this business in the partnership.
     */
    public function contactPerson(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contact_person_id');
    }

    /**
     * Check if the business is active in the partnership.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the business has exited the partnership.
     */
    public function hasExited(): bool
    {
        return in_array($this->status, ['exited', 'terminated']) ||
            ($this->exit_date && $this->exit_date->isPast());
    }

    /**
     * Get the duration of participation in months.
     */
    public function getParticipationDurationAttribute(): int
    {
        if (!$this->joined_date) {
            return 0;
        }

        $endDate = $this->exit_date ?? now();
        return $this->joined_date->diffInMonths($endDate);
    }

    /**
     * Activate a pending business in the partnership.
     */
    public function activate(): bool
    {
        if ($this->status === 'pending' || $this->status === 'suspended' || $this->status === 'negotiating') {
            $this->status = 'active';
            $this->joined_date = $this->joined_date ?? now();
            return $this->save();
        }

        return false;
    }

    /**
     * Suspend a business's participation in the partnership.
     */
    public function suspend(string $reason = null): bool
    {
        if ($this->status === 'active') {
            $this->status = 'suspended';
            // You might want to track the reason in a related record or notes field
            return $this->save();
        }

        return false;
    }

    /**
     * Mark a business as having exited the partnership.
     */
    public function exit(string $reason = null): bool
    {
        $this->status = 'exited';
        $this->exit_date = now();
        // You might want to track the reason in a related record or notes field
        return $this->save();
    }
}
