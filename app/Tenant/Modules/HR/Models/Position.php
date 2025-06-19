<?php

namespace App\Tenant\Modules\HR\Models;

use App\Tenant\Modules\HR\Enum\EmploymentType;
use App\Tenant\Modules\HR\Enum\PositionLevel;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Position extends Model
{
    protected $fillable = [
        'title',
        'code',
        'description',
        'requirements',
        'responsibilities',
        'department_id',
        'employment_type',
        'position_level',
        'min_salary',
        'max_salary',
        'status',
    ];

    protected $casts = [
        'min_salary' => 'decimal:2',
        'max_salary' => 'decimal:2',
        'employment_type' => EmploymentType::class,
        'position_level' => PositionLevel::class,
        'status' => 'string',
    ];

    protected $appends = [
        'employee_count',
        'salary_range',
    ];

    // Relationships
    public function department(): BelongsTo
    {
        return $this->belongsTo(Department::class);
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    // Computed attributes
    protected function employeeCount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->employees()->where('is_active', true)->count()
        );
    }

    protected function salaryRange(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->min_salary && $this->max_salary) {
                    return '$' . number_format($this->min_salary) . ' - $' . number_format($this->max_salary);
                }
                if ($this->min_salary) {
                    return '$' . number_format($this->min_salary) . '+';
                }
                if ($this->max_salary) {
                    return 'Up to $' . number_format($this->max_salary);
                }
                return 'Not specified';
            }
        );
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    public function scopeByEmploymentType($query, EmploymentType $type)
    {
        return $query->where('employment_type', $type);
    }

    public function scopeByPositionLevel($query, PositionLevel $level)
    {
        return $query->where('position_level', $level);
    }
}
