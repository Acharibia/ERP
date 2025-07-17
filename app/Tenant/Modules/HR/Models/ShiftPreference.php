<?php
namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ShiftPreference extends Model
{
    protected $fillable = [
        'employee_id',
        'shift_id',
        'is_available',
        'preference_level',
        'is_mandatory',
        'day_of_week',
    ];

    protected $casts = [
        'is_available' => 'boolean',
        'is_mandatory' => 'boolean',
    ];

    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    public function shift(): BelongsTo
    {
        return $this->belongsTo(Shift::class);
    }
}
