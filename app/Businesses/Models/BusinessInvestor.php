<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\Investor;
use App\Shared\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessInvestor extends Model
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
        'role_id',
        'status',
        'investment_date',
        'total_investment',
        'equity_percentage',
        'initial_contact_date',
        'investor_type',
        'investment_terms',
        'additional_details',
        'contact_person_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'investment_date' => 'date',
        'initial_contact_date' => 'date',
        'total_investment' => 'decimal:2',
        'equity_percentage' => 'decimal:2',
        'additional_details' => 'json',
    ];

    /**
     * Get the business this relationship belongs to.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the investor in this relationship.
     */
    public function investor(): BelongsTo
    {
        return $this->belongsTo(Investor::class);
    }

    /**
     * Get the investment round associated with this relationship.
     */
    public function investmentRound(): BelongsTo
    {
        return $this->belongsTo(InvestmentRound::class);
    }

    /**
     * Get the offer associated with this relationship.
     */
    public function investorOffer(): BelongsTo
    {
        return $this->belongsTo(InvestorOffer::class);
    }

    /**
     * Get the role assigned to this investor.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the contact person for this investor relationship.
     */
    public function contactPerson(): BelongsTo
    {
        return $this->belongsTo(User::class, 'contact_person_id');
    }

    /**
     * Check if the relationship is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if the investor has a board role.
     */
    public function hasBoardRole(): bool
    {
        if (!$this->role) {
            return false;
        }

        return $this->role->name === 'Board Member' ||
            $this->role->name === 'Board Advisor' ||
            $this->role->name === 'Board Observer';
    }
}
