<?php
namespace App\Tenant\Modules\HR\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShiftRotation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_shift_rotation_id',
        'shift_id',
        'duration_days',
        'order',
    ];

    // Relationships
    public function rotation()
    {
        return $this->belongsTo(EmployeeShiftRotation::class, 'employee_shift_rotation_id');
    }

    public function shift()
    {
        return $this->belongsTo(Shift::class);
    }
}
