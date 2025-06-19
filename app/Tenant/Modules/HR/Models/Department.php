<?php

namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Casts\Attribute;

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
        'status' => 'string',
    ];

    protected $appends = [
        'employee_count',
    ];

    // Relationships
    public function manager(): BelongsTo
    {
        return $this->belongsTo(Employee::class, 'manager_id');
    }

    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
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
        return $query->where('status', 'active');
    }

}
