<?php

namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEmploymentInfo extends Model
{
    protected $table = 'employee_employment_info';

    protected $fillable = [
        'employee_id',
        'department_id',
        'position_id',
        'manager_id',
        'hire_date',
        'termination_date',
        'termination_reason',
        'employment_status',
        'employment_type',
        'work_location',
        'probation_start_date',
        'probation_end_date',
        'contract_start_date',
        'contract_end_date',
    ];

    protected $casts = [
        'hire_date' => 'date',
        'termination_date' => 'date',
        'probation_start_date' => 'date',
        'probation_end_date' => 'date',
        'contract_start_date' => 'date',
        'contract_end_date' => 'date',
    ];

    protected $appends = ['profile_picture'];

    public function getProfilePictureAttribute(): ?string
    {
        return optional($this->employee?->user)->profile_picture;
    }

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }
}
