<?php

namespace App\Shared\Models;

use App\Businesses\Models\Investment;
use App\Businesses\Models\InvestorOffer;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Investor extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'type',
        'name',
        'company_name',
        'email',
        'phone',
        'address',
        'city',
        'state',
        'postal_code',
        'country',
        'tax_id',
        'status',
        'accreditation_status',
        'notes',
    ];

    /**
     * Get the user associated with the investor.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all businesses this investor has invested in.
     */
    public function businesses(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'business_investors')
            ->withPivot([
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
                'contact_person_id'
            ])
            ->withTimestamps();
    }

    /**
     * Get all investments made by this investor.
     */
    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    /**
     * Get all offers made to this investor.
     */
    public function offers(): HasMany
    {
        return $this->hasMany(InvestorOffer::class);
    }

    /**
     * Check if investor is accredited.
     */
    public function isAccredited(): bool
    {
        return $this->accreditation_status === 'accredited';
    }

    /**
     * Get total investment amount across all businesses.
     */
    public function getTotalInvestmentAmount(): float
    {
        return $this->investments()->sum('amount');
    }
}
