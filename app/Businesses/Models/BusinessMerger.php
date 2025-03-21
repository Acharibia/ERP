<?php

namespace App\Businesses\Models;

use App\Shared\Models\Business;
use App\Shared\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BusinessMerger extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'acquiring_business_id',
        'target_business_id',
        'merger_type',
        'status',
        'transaction_value',
        'agreement_date',
        'completion_date',
        'terms',
        'initiated_by',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'agreement_date' => 'date',
        'completion_date' => 'date',
        'transaction_value' => 'decimal:2',
    ];

    /**
     * Merger types available in the system.
     */
    const MERGER_TYPES = [
        'horizontal',
        'vertical',
        'conglomerate',
        'market_extension',
        'product_extension',
        'acquisition',
        'consolidation',
        'reverse',
        'strategic'
    ];

    /**
     * Possible statuses for a merger process.
     */
    const STATUSES = [
        'pending',
        'due_diligence',
        'negotiation',
        'approved',
        'completed',
        'terminated'
    ];

    /**
     * Get the acquiring business.
     */
    public function acquiringBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'acquiring_business_id');
    }

    /**
     * Get the target business.
     */
    public function targetBusiness(): BelongsTo
    {
        return $this->belongsTo(Business::class, 'target_business_id');
    }

    /**
     * Get the user who initiated the merger.
     */
    public function initiator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'initiated_by');
    }

    /**
     * Check if the merger is completed.
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if the merger is active (in progress).
     */
    public function isActive(): bool
    {
        return in_array($this->status, ['pending', 'due_diligence', 'negotiation', 'approved']);
    }

    /**
     * Get all the businesses involved in the merger.
     */
    public function getInvolvedBusinessesAttribute(): array
    {
        return [$this->acquiringBusiness, $this->targetBusiness];
    }

    /**
     * Calculate days since merger initiation.
     */
    public function getDaysSinceInitiationAttribute(): int
    {
        return $this->created_at->diffInDays(now());
    }

    /**
     * Advance the merger to the next status.
     */
    public function advanceStatus(): bool
    {
        $currentIndex = array_search($this->status, self::STATUSES);

        if ($currentIndex === false || $currentIndex >= count(self::STATUSES) - 2) {
            return false;
        }

        $this->status = self::STATUSES[$currentIndex + 1];
        return $this->save();
    }
}
