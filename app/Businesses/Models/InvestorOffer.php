<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\Investor;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InvestorOffer extends Model
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
        'amount',
        'currency',
        'equity_percentage',
        'offer_date',
        'expiry_date',
        'status',
        'instrument_type',
        'share_price',
        'number_of_shares',
        'terms',
        'board_seat_offered',
        'special_rights',
        'created_by',
        'response_date',
        'response_notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'offer_date' => 'date',
        'expiry_date' => 'date',
        'response_date' => 'date',
        'amount' => 'decimal:2',
        'equity_percentage' => 'decimal:2',
        'share_price' => 'decimal:4',
        'number_of_shares' => 'integer',
        'board_seat_offered' => 'boolean',
        'terms' => 'json',
        'special_rights' => 'json',
    ];

    /**
     * Get the business associated with the offer.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the investor associated with the offer.
     */
    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }

    /**
     * Get the investment round associated with the offer.
     */
    public function investmentRound(): BelongsTo
    {
        return $this->belongsTo(InvestmentRound::class);
    }

    /**
     * Get the user who created the offer.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the investments resulting from this offer.
     */
    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    /**
     * Get the business investor relationship resulting from this offer.
     */
    public function businessInvestor(): HasMany
    {
        return $this->hasMany(BusinessInvestor::class);
    }

    /**
     * Check if offer is expired.
     */
    public function isExpired(): bool
    {
        return $this->expiry_date && now()->greaterThan($this->expiry_date);
    }

    /**
     * Check if offer is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if offer was accepted.
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Accept the offer and update status.
     */
    public function accept(string $notes = null): bool
    {
        $this->status = 'accepted';
        $this->response_date = now();

        if ($notes) {
            $this->response_notes = $notes;
        }

        return $this->save();
    }

    /**
     * Reject the offer and update status.
     */
    public function reject(string $notes = null): bool
    {
        $this->status = 'rejected';
        $this->response_date = now();

        if ($notes) {
            $this->response_notes = $notes;
        }

        return $this->save();
    }
}
