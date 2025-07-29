<?php
namespace App\Tenant\HR\Models;

use App\Tenant\Core\Models\User as TenantUser;
use App\Tenant\HR\Enum\LeaveRequestStatus;
use App\Tenant\HR\Enum\LeavePriority;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LeaveRequest extends Model
{
    protected $fillable = [
        'employee_id',
        'leave_type_id',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'priority',
        'status',
        'reviewed_by',
        'reviewed_at',
        'comment',
    ];

    protected $casts = [
        'total_days' => 'decimal:1',
        'start_date' => 'date',
        'end_date' => 'date',
        'reviewed_at' => 'datetime',
        'status' => LeaveRequestStatus::class,
        'priority' => LeavePriority::class,
    ];

    /*
    |--------------------------------------------------------------------------
    | Relationships
    |--------------------------------------------------------------------------
    */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function leaveType(): BelongsTo
    {
        return $this->belongsTo(LeaveType::class);
    }

    public function approver(): BelongsTo
    {
        return $this->belongsTo(TenantUser::class, 'reviewed_by');
    }

    /*
    |--------------------------------------------------------------------------
    | Scopes
    |--------------------------------------------------------------------------
    */
    public function scopePending($query)
    {
        return $query->where('status', LeaveRequestStatus::PENDING);
    }

    public function scopeApproved($query)
    {
        return $query->where('status', LeaveRequestStatus::APPROVED);
    }

    public function scopeRejected($query)
    {
        return $query->where('status', LeaveRequestStatus::REJECTED);
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', LeaveRequestStatus::CANCELLED);
    }
}
