<?php
namespace App\Tenant\HR\Observers;

use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\LeaveBalance;
use App\Tenant\HR\Models\LeaveType;

class EmployeeObserver
{
    /**
     * Handle the Employee "created" event.
     */
    public function created(Employee $employee)
    {
        $leaveTypes = LeaveType::where('status', 'active')->get();

        foreach ($leaveTypes as $leaveType) {
            LeaveBalance::firstOrCreate([
                'employee_id'   => $employee->id,
                'leave_type_id' => $leaveType->id,
                'year'          => now()->year,
            ], [
                'entitled_days'     => $leaveType->default_days,
                'used_days'         => 0,
                'pending_days'      => 0,
                'carried_over_days' => 0,
            ]);
        }
    }
}
