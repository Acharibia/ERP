<?php

namespace App\Tenant\Modules\HR\Models;

use App\Tenant\Modules\HR\Enum\DepartmentStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Department extends Model
{
    protected $fillable = [
        'name',
        'email',
        'code',
        'description',
        'parent_id',
        'manager_id',
        'budget',
        'cost_center',
        'location',
        'status',
    ];



    protected $casts = [
        'budget' => 'decimal:2',
        'status' => DepartmentStatus::class,
    ];

    protected $appends = [
        'employee_count',
    ];

    // Relationships
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function employees(): HasManyThrough
    {
        return $this->hasManyThrough(
            Employee::class,
            EmployeeEmploymentInfo::class,
            'department_id',
            'id',
            'id',
            'employee_id'
        );
    }

    public function parent(): BelongsTo
    {
        return $this->belongsTo(Department::class, 'parent_id');
    }

    public function children(): HasMany
    {
        return $this->hasMany(Department::class, 'parent_id');
    }

    // Computed attributes
    protected function employeeCount(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->employees()->active()->count()
        );
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', DepartmentStatus::ACTIVE);
    }

    public function scopeSuspended($query)
    {
        return $query->where('status', DepartmentStatus::SUSPENDED);
    }

    public function scopeInactive($query)
    {
        return $query->where('status', DepartmentStatus::INACTIVE);
    }

}
