<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Http\Requests\StoreLeaveTypeRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateLeaveTypeRequest;
use App\Tenant\Modules\HR\Models\LeaveType;

class LeaveTypeController extends Controller
{
    /**
     * Store a newly created leave type in storage.
     */
    public function store(StoreLeaveTypeRequest $request)
    {
        LeaveType::create($request->validated());

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave type created successfully.');
    }

    /**
     * Update the specified leave type in storage.
     */
    public function update(UpdateLeaveTypeRequest $request, LeaveType $leaveType)
    {
        $leaveType->update($request->validated());

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave type updated successfully.');
    }

    /**
     * Remove the specified leave type from storage.
     */
    public function destroy(LeaveType $leaveType)
    {
        $leaveType->delete();

        return back()->with('success', 'Leave type deleted successfully.');
    }
}
