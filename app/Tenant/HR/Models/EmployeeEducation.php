<?php

namespace App\Tenant\HR\Models;

use App\Central\Models\Country;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeEducation extends Model
{
    protected $table = 'employee_education';

    protected $fillable = [
        'employee_id',
        'institution',
        'country_id',
        'degree_type',
        'field_of_study',
        'start_date',
        'end_date',
        'graduation_date',
        'is_completed',
        'is_current',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'graduation_date' => 'date',
        'is_completed' => 'boolean',
        'is_current' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }

}
