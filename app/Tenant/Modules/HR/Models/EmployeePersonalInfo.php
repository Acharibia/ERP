<?php

namespace App\Tenant\Modules\HR\Models;

use App\Central\Models\Country;
use App\Central\Models\Gender;
use App\Central\Models\State;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmployeePersonalInfo extends Model
{
    use SoftDeletes;
    protected $table = 'employee_personal_info';

    protected $fillable = [
        'employee_id',
        'name',
        'birth_date',
        'gender_id',
        'marital_status',
        'nationality',
        'national_id',
        'address',
        'city',
        'state_id',
        'postal_code',
        'country_id',
        'work_email',
        'personal_email',
        'work_phone',
        'personal_phone',
        'bio',
    ];

    protected $casts = [
        'birth_date' => 'date',
    ];

    // Relationships

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function gender(): BelongsTo
    {
        return $this->belongsTo(Gender::class, 'gender_id');
    }

    public function country(): BelongsTo
    {
        return $this->belongsTo(Country::class, 'country_id');
    }


    public function state(): BelongsTo
    {
        return $this->belongsTo(State::class, 'state_id');
    }
}
