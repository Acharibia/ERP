<?php
namespace App\Tenant\Modules\HR\Models;

use App\Tenant\Modules\HR\Enum\EmployeeShiftRotationStatus;
use App\Tenant\Modules\HR\Enum\ShiftRotationFrequency;
use App\Tenant\Modules\HR\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeShiftRotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'start_date',
        'frequency',
        'interval',
        'status',
    ];

    protected $casts = [
        'start_date' => 'date',
        'status'     => EmployeeShiftRotationStatus::class,
        'frequency'  => ShiftRotationFrequency::class,
    ];

    // Relationships
    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function shiftRotations()
    {
        return $this->hasMany(ShiftRotation::class);
    }
}
