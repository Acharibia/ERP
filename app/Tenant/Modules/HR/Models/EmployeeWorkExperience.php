<?php

namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EmployeeWorkExperience extends Model
{
    protected $table = 'employee_work_experience';

    protected $fillable = [
        'employee_id',
        'company_name',
        'job_title',
        'start_date',
        'end_date',
        'is_current',
        'responsibilities',
        'achievements',
        'company_location',
        'reference_name',
        'reference_contact',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'is_current' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
