<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\Investor;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Investment extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'business_id',
        'investor_id',
        'investment_round_id',
        'investor_offer_id',
        'amount',
        'currency',
        'investment_date',
        'payment_method',
        'transaction_id',
        'status',
        'notes',
        'instrument_type',
        'share_price',
        'shares_acquired',
        'processed_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'investment_date' => 'date',
        'amount' => 'decimal:2',
        'share_price' => 'decimal:4',
        'shares_acquired' => 'integer',
    ];

    /**
     * Get the business associated with the investment.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the investor associated with the investment.
     */
    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }

    /**
     * Get the investment round associated with the investment.
     */
    public function investmentRound(): BelongsTo
    {
        return $this->belongsTo(InvestmentRound::class);
    }

    /**
     * Get the offer associated with the investment.
     */
    public function investorOffer(): BelongsTo
    {
        return $this->belongsTo(InvestorOffer::class);
    }

    /**
     * Get the user who processed the investment.
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Check if investment is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Calculate value in USD (for multicurrency support).
     */
    public function getUsdValueAttribute(): float
    {
        // In a full implementation, this would use a currency conversion service
        // For now, assume USD if currency is USD, otherwise conversion would happen here
        if ($this->currency === 'USD') {
            return $this->amount;
        }

        // Placeholder for conversion logic
        return $this->amount;
    }

    /**
     * Get the total equity value based on share price and shares acquired.
     */
    public function getEquityValueAttribute(): float
    {
        if (!$this->share_price || !$this->shares_acquired) {
            return 0;
        }

        return $this->share_price * $this->shares_acquired;
    }
}
