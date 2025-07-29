<?php
namespace App\Tenant\HR\Models;

use App\Tenant\HR\Enum\ShiftRotationPriority;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Models\Role;
use App\Tenant\HR\Enum\ShiftRotationFrequency;

class ShiftRotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'department_ids',
        'position_ids',
        'role_ids',
        'shift_id',
        'start_date',
        'end_date',
        'frequency',
        'interval',
        'status',
        'duration_days',
        'is_recurring',
        'priority',
    ];

    protected $casts = [
        'department_ids' => 'array',
        'position_ids'   => 'array',
        'role_ids'       => 'array',
        'start_date'     => 'date',
        'end_date'       => 'date',
        'is_recurring'   => 'boolean',
        'priority'       => ShiftRotationPriority::class,
        'frequency'      => ShiftRotationFrequency::class,
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }

    public function departments()
    {
        return Department::whereIn('id', $this->department_ids ?? [])->get();
    }

    public function positions()
    {
        return Position::whereIn('id', $this->position_ids ?? [])->get();
    }

    public function roles()
    {
        return Role::whereIn('id', $this->role_ids ?? [])->get();
    }

}
