<?php

namespace App\Tenant\Modules\HR\Models;

use App\Tenant\Modules\HR\Enum\LeaveTypeStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LeaveType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
        'description',
        'default_days',
        'requires_approval',
        'is_paid',
        'can_carry_forward',
        'max_carry_forward_days',
        'carry_forward_expiry_months',
        'status',
        'created_by',
    ];

    protected $casts = [
        'default_days' => 'decimal:1',
        'requires_approval' => 'boolean',
        'is_paid' => 'boolean',
        'can_carry_forward' => 'boolean',
        'max_carry_forward_days' => 'decimal:1',
        'status' => LeaveTypeStatus::class,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */

    public function leaveRequests(): HasMany
    {
        return $this->hasMany(LeaveRequest::class);
    }

    public function leaveBalances(): HasMany
    {
        return $this->hasMany(LeaveBalance::class);
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */

    public function scopeActive($query)
    {
        return $query->where('status', LeaveTypeStatus::ACTIVE);
    }

    public function scopeInactive($query)
    {
        return $query->where('status', LeaveTypeStatus::INACTIVE);
    }
}
