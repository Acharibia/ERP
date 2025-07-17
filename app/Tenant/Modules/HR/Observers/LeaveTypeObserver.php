<?php

namespace App\Tenant\Modules\HR\Observers;

use App\Tenant\Modules\HR\Models\LeaveType;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\LeaveBalance;

class LeaveTypeObserver
{
    public function created(LeaveType $leaveType)
    {
        $year = now()->year;
        $employees = Employee::all();

        foreach ($employees as $employee) {
            LeaveBalance::firstOrCreate([
                'employee_id'   => $employee->id,
                'leave_type_id' => $leaveType->id,
                'year'          => $year,
            ], [
                'entitled_days'     => $leaveType->default_days,
                'used_days'         => 0,
                'pending_days'      => 0,
                'carried_over_days' => 0,
            ]);
        }
    }
}
