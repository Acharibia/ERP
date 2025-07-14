<?php

namespace App\Central\Models;

use App\Central\Models\Business;
use App\Central\Models\Investor;
use App\Central\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class InvestmentRound extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'business_id',
        'name',
        'type',
        'target_amount',
        'minimum_investment',
        'raised_amount',
        'start_date',
        'end_date',
        'status',
        'description',
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
        'terms' => 'json',
        'target_amount' => 'decimal:2',
        'minimum_investment' => 'decimal:2',
        'raised_amount' => 'decimal:2',
    ];

    /**
     * Get the business that owns the investment round.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the user who created the investment round.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get all investments in this round.
     */
    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    /**
     * Get all investors participating in this round.
     */
    public function investors(): BelongsToMany
    {
        return $this->belongsToMany(Investor::class, 'business_investors')
            ->withPivot([
                'status',
                'investment_date',
                'total_investment',
                'equity_percentage'
            ])
            ->withTimestamps();
    }

    /**
     * Get all offers made in this investment round.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(InvestorOffer::class);
    }

    /**
     * Check if investment round is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Calculate remaining funding needed to reach target.
     */
    public function getRemainingFundingAttribute(): float
    {
        return max(0, $this->target_amount - $this->raised_amount);
    }

    /**
     * Calculate the percentage of funding achieved.
     */
    public function getFundingProgressAttribute(): float
    {
        if ($this->target_amount <= 0) {
            return 0;
        }

        return min(100, ($this->raised_amount / $this->target_amount) * 100);
    }
}
