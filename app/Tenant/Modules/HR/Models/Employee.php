<?php

namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_id',
        'name',
        'work_email',
        'personal_email',
        'work_phone',
        'personal_phone',
        'birth_date',
        'gender',
        'marital_status',
        'nationality',
        'address',
        'city',
        'state_id',
        'postal_code',
        'country_id',
        'hire_date',
        'termination_date',
        'termination_reason',
        'department_id',
        'position_id',
        'manager_id',
        'employment_status',
        'employment_type',
        'work_location',
        'bio',
        'is_active',
    ];

    protected $casts = [
        'birth_date' => 'date',
        'hire_date' => 'date',
        'termination_date' => 'date',
        'is_active' => 'boolean',
    ];

    // Relationships
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
