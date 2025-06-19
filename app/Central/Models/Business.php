<?php

namespace App\Central\Models;

use App\Businesses\Models\BusinessInvestor;
use App\Businesses\Models\BusinessMerger;
use App\Businesses\Models\Investment;
use App\Businesses\Models\InvestmentRound;
use App\Businesses\Models\InvestorOffer;
use App\Businesses\Models\Partnership;
use App\Businesses\Models\PartnershipBusiness;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Stancl\Tenancy\Database\Concerns\CentralConnection;
use Illuminate\Support\Str;

class Business extends Model
{
    use HasFactory, CentralConnection;

    protected $fillable = [
        'tenant_id',
        'name',
        'registration_number',
        'email',
        'phone',
        'website',
        'address_line_1',
        'address_line_2',
        'city',
        'state_id',
        'postal_code',
        'country_id',
        'industry_id',
        'reseller_id',
        'subscription_status',
        'environment',
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
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class, 'tenant_id');
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
     * Relationship to the current active or trial subscription
     */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->where(function ($query) {
                $query->where('status', 'active')
                    ->orWhere('status', 'trial');
            })
            ->latest();
    }

    /**
     * Relationship to all subscriptions
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Get the trial subscription if exists
     */
    public function trialSubscription(): HasOne
    {
        return $this->hasOne(Subscription::class)
            ->where('status', 'trial')
            ->whereNotNull('trial_ends_at')
            ->where('trial_ends_at', '>', now())
            ->latest();
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
     * Get all modules for this business
     */
    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'business_modules')
            ->withPivot('is_active', 'version', 'trial_only')
            ->withTimestamps();
    }

    /**
     * Get active modules for this business
     */
    public function activeModules(): BelongsToMany
    {
        return $this->modules()->wherePivot('is_active', true);
    }

    /**
     * Get only modules available in the subscription package (not trial-only)
     */
    public function packageModules(): BelongsToMany
    {
        return $this->modules()
            ->wherePivot('is_active', true)
            ->wherePivot('trial_only', false);
    }

    /**
     * Get trial-only modules
     */
    public function trialModules(): BelongsToMany
    {
        return $this->modules()
            ->wherePivot('is_active', true)
            ->wherePivot('trial_only', true);
    }

    /************************************************************
     * INVESTMENT, MERGER & PARTNERSHIP RELATIONSHIPS
     ************************************************************/

    /**
     * Get all investments received by this business.
     */
    public function investments(): HasMany
    {
        return $this->hasMany(Investment::class);
    }

    /**
     * Get all investment rounds for this business.
     */
    public function investmentRounds(): HasMany
    {
        return $this->hasMany(InvestmentRound::class);
    }

    /**
     * Get all investors associated with this business.
     */
    public function investors(): BelongsToMany
    {
        return $this->belongsToMany(Investor::class, 'business_investors')
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
     * Get all business-investor relationships.
     */
    public function businessInvestors(): HasMany
    {
        return $this->hasMany(BusinessInvestor::class);
    }

    /**
     * Get all offers made to investors.
     */
    public function investorOffers(): HasMany
    {
        return $this->hasMany(InvestorOffer::class);
    }

    /**
     * Get mergers where this business is the acquirer.
     */
    public function acquisitions(): HasMany
    {
        return $this->hasMany(BusinessMerger::class, 'acquiring_business_id');
    }

    /**
     * Get mergers where this business is the target.
     */
    public function acquisitionTargets(): HasMany
    {
        return $this->hasMany(BusinessMerger::class, 'target_business_id');
    }

    /**
     * Get all mergers this business is involved in (both as acquirer and target).
     */
    public function getAllMergersAttribute()
    {
        return $this->acquisitions->merge($this->acquisitionTargets);
    }

    /**
     * Get all partnerships that this business has initiated.
     */
    public function initiatedPartnerships(): HasMany
    {
        return $this->hasMany(Partnership::class, 'initiator_business_id');
    }

    /**
     * Get all partnerships that this business is participating in.
     */
    public function partnerships(): BelongsToMany
    {
        return $this->belongsToMany(Partnership::class, 'partnership_businesses')
            ->withPivot([
                'contact_person_id',
                'status',
                'joined_date',
                'exit_date'
            ])
            ->withTimestamps();
    }

    /**
     * Get all partnership business relationships.
     */
    public function partnershipBusinesses(): HasMany
    {
        return $this->hasMany(PartnershipBusiness::class);
    }

    /**
     * Get active partnerships for this business.
     */
    public function activePartnerships(): BelongsToMany
    {
        return $this->partnerships()->wherePivot('status', 'active');
    }

    /************************************************************
     * BUSINESS METHODS
     ************************************************************/

    /**
     * Create a business and its associated tenant
     *
     * @param array $businessData
     * @param string|null $domain
     * @return self
     */
    public static function createWithTenant(array $businessData, ?string $domain = null): self
    {
        // Step 1: Create tenant first
        $tenantId = Str::slug($businessData['name']) . '-' . Str::random(6);

        $tenant = Tenant::create([
            'id' => $tenantId,
            'data' => [
                'business_name' => $businessData['name'],
                'business_email' => $businessData['email'],
            ]
        ]);

        // Step 2: Create business with tenant_id
        $businessData['tenant_id'] = $tenant->id;
        $business = static::create($businessData);

        // Step 3: Create domain if provided
        if ($domain) {
            $tenant->domains()->create(['domain' => $domain]);
        }

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

    /**
     * Check if this business is on trial
     *
     * @return bool
     */
    public function isOnTrial(): bool
    {
        return $this->subscription_status === 'trial' &&
            $this->trialSubscription()->exists();
    }

    /**
     * Get days remaining in trial
     *
     * @return int|null
     */
    public function trialDaysRemaining(): ?int
    {
        $trialSubscription = $this->trialSubscription;

        if (!$trialSubscription || !$trialSubscription->trial_ends_at) {
            return null;
        }

        return now()->diffInDays($trialSubscription->trial_ends_at, false);
    }

    /**
     * Check if this business will lose access to modules after trial
     *
     * @return bool
     */
    public function willLoseModulesAfterTrial(): bool
    {
        if (!$this->isOnTrial()) {
            return false;
        }

        return $this->trialModules()->exists();
    }

    /**
     * Get modules that will be lost after trial
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function modulesToLoseAfterTrial()
    {
        if (!$this->isOnTrial()) {
            return collect([]);
        }

        return $this->trialModules()->get();
    }

    /**
     * Get total invested amount from all investors.
     */
    public function getTotalInvestedAmount(): float
    {
        return $this->investments()->where('status', 'completed')->sum('amount');
    }

    /**
     * Get active investment round if any.
     */
    public function getActiveInvestmentRound()
    {
        return $this->investmentRounds()->where('status', 'active')->latest()->first();
    }

    /**
     * Check if business is currently involved in any active mergers
     */
    public function hasActiveMergers(): bool
    {
        return $this->acquisitions()->whereIn('status', ['pending', 'due_diligence', 'negotiation', 'approved'])->exists()
            || $this->acquisitionTargets()->whereIn('status', ['pending', 'due_diligence', 'negotiation', 'approved'])->exists();
    }

    /**
     * Check if business is currently involved in any active partnerships
     */
    public function hasActivePartnerships(): bool
    {
        return $this->partnershipBusinesses()->where('status', 'active')->exists();
    }

    /**
     * Get the count of active partnerships
     */
    public function getActivePartnershipsCountAttribute(): int
    {
        return $this->partnershipBusinesses()->where('status', 'active')->count();
    }
}
