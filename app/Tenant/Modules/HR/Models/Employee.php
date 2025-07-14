<?php

namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Central\Models\User as CentralUser;
use App\Tenant\Models\User as TenantUser;

class Employee extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'employee_number',
    ];

    protected $with = ['personalInfo'];


    protected $casts = [
        'deleted_at' => 'datetime',
    ];
    protected $appends = ['name'];


    public function getNameAttribute(): ?string
    {
        return $this->personalInfo?->name;
    }


    // Relationships
    public function user(): BelongsTo
    {
        return $this->belongsTo(TenantUser::class);
    }

    public function personalInfo(): HasOne
    {
        return $this->hasOne(EmployeePersonalInfo::class);
    }

    public function employmentInfo(): HasOne
    {
        return $this->hasOne(EmployeeEmploymentInfo::class);
    }

    public function education(): HasMany
    {
        return $this->hasMany(EmployeeEducation::class);
    }

    public function workExperience(): HasMany
    {
        return $this->hasMany(EmployeeWorkExperience::class);
    }

    public function emergencyContacts(): HasMany
    {
        return $this->hasMany(EmployeeEmergencyContact::class);
    }

    public function manager(): BelongsTo
    {
        return $this->belongsTo(self::class, 'manager_id');
    }

    public function scopeActive($query)
    {
        return $query->whereHas('employmentInfo', function ($q) {
            $q->where('employment_status', 'active');
        });
    }
}
