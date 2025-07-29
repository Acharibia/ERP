<?php

namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Enum\LeaveRequestStatus;
use App\Tenant\HR\Http\Requests\StoreLeaveRequest;
use App\Tenant\HR\Http\Requests\UpdateLeaveRequest;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\LeaveRequest;
use App\Tenant\HR\Models\LeaveType;
use App\Tenant\HR\Models\LeaveBalance;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaveRequestController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('modules/hr/leaves/index', [
            'leaveTypes' => LeaveType::all(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/leaves/create', [
            'employees' => Employee::active()->get(['id']),
            'leaveTypes' => LeaveType::active()->select('id', 'name', 'code')->get(),
        ]);
    }

    public function store(StoreLeaveRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        $employeeId = $validated['employee_id'];
        $leaveTypeId = $validated['leave_type_id'];
        $totalDays = $validated['total_days'];
        $year = (int) now()->year;

        $balance = LeaveBalance::firstOrCreate([
            'employee_id' => $employeeId,
            'leave_type_id' => $leaveTypeId,
            'year' => $year,
        ], [
            'entitled_days' => 0,
            'used_days' => 0,
            'pending_days' => 0,
            'carried_over_days' => 0,
        ]);

        $available = $balance->entitled_days + $balance->carried_over_days - $balance->used_days - $balance->pending_days;

        if ($available < $totalDays) {
            return back()->withErrors([
                'total_days' => 'Insufficient leave balance. Only ' . $available . ' days available.',
            ])->withInput();
        }

        LeaveRequest::create($validated);
        $balance->increment('pending_days', $totalDays);

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave request created successfully.');
    }

    public function show($id): Response
    {
        $leave = LeaveRequest::with(['employee.personalInfo', 'leaveType', 'approver'])->findOrFail($id);
        return Inertia::render('modules/hr/leaves/show', [
            'leave' => $leave,
        ]);
    }

    public function edit($id): Response
    {
        return Inertia::render('modules/hr/leaves/edit', [
            'leave' => LeaveRequest::with('leaveType')->findOrFail($id),
            'employees' => Employee::active()->get(['id']),
            'leaveTypes' => LeaveType::active()->select('id', 'name', 'code')->get(),
        ]);
    }

    public function update(UpdateLeaveRequest $request, $id): RedirectResponse
    {
        $leave = LeaveRequest::findOrFail($id);
        $leave->update($request->validated());

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave request updated successfully.');
    }

    public function destroy($id): RedirectResponse
    {
        $leave = LeaveRequest::findOrFail($id);
        $leave->delete();

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave request deleted successfully.');
    }

    public function approve(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $leave = LeaveRequest::findOrFail($id);

        if ($leave->status !== LeaveRequestStatus::PENDING) {
            return back()->with('warning', 'Leave is not in a pending state.');
        }

        $balance = LeaveBalance::firstOrCreate([
            'employee_id' => $leave->employee_id,
            'leave_type_id' => $leave->leave_type_id,
            'year' => $leave->start_date->year,
        ], [
            'entitled_days' => 0,
            'used_days' => 0,
            'pending_days' => 0,
            'carried_over_days' => 0,
        ]);

        $available = $balance->entitled_days + $balance->carried_over_days - $balance->used_days;

        if ($available < $leave->total_days) {
            return back()->withErrors([
                'total_days' => 'Insufficient leave balance to approve this request.',
            ]);
        }

        $leave->update([
            'status' => LeaveRequestStatus::APPROVED,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        $balance->decrement('pending_days', $leave->total_days);
        $balance->increment('used_days', $leave->total_days);

        return back()->with('success', 'Leave approved successfully.');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'comment' => 'required|string|max:1000',
        ]);

        $leave = LeaveRequest::findOrFail($id);

        $balance = LeaveBalance::where([
            'employee_id' => $leave->employee_id,
            'leave_type_id' => $leave->leave_type_id,
            'year' => $leave->start_date->year,
        ])->first();

        if ($balance && $leave->status === LeaveRequestStatus::PENDING) {
            $balance->decrement('pending_days', $leave->total_days);
        }

        $leave->update([
            'status' => LeaveRequestStatus::REJECTED,
            'comment' => $request->input('comment'),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Leave rejected successfully.');
    }

    public function cancel(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'comment' => 'required|string|max:1000',
        ]);

        $leave = LeaveRequest::findOrFail($id);

        $balance = LeaveBalance::where([
            'employee_id' => $leave->employee_id,
            'leave_type_id' => $leave->leave_type_id,
            'year' => $leave->start_date->year,
        ])->first();

        if ($balance) {
            if ($leave->status === LeaveRequestStatus::APPROVED) {
                $balance->decrement('used_days', $leave->total_days);
            } elseif ($leave->status === LeaveRequestStatus::PENDING) {
                $balance->decrement('pending_days', $leave->total_days);
            }
        }

        $leave->update([
            'status' => LeaveRequestStatus::CANCELLED,
            'comment' => $request->input('comment'),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Leave cancelled successfully.');
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
        ]);

        foreach (LeaveRequest::whereIn('id', $request->input('ids'))->where('status', LeaveRequestStatus::PENDING)->get() as $leave) {
            $balance = LeaveBalance::firstOrCreate([
                'employee_id' => $leave->employee_id,
                'leave_type_id' => $leave->leave_type_id,
                'year' => $leave->start_date->year,
            ], [
                'entitled_days' => 0,
                'used_days' => 0,
                'pending_days' => 0,
                'carried_over_days' => 0,
            ]);

            $available = $balance->entitled_days + $balance->carried_over_days - $balance->used_days;

            if ($available >= $leave->total_days) {
                $leave->update([
                    'status' => LeaveRequestStatus::APPROVED,
                    'reviewed_by' => auth()->id(),
                    'reviewed_at' => now(),
                ]);

                $balance->decrement('pending_days', $leave->total_days);
                $balance->increment('used_days', $leave->total_days);
            }
        }

        return back()->with('success', 'Selected leave requests processed.');
    }

    public function bulkReject(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
            'comment' => 'required|string|max:1000',
        ]);

        foreach (LeaveRequest::whereIn('id', $request->input('ids'))->where('status', LeaveRequestStatus::PENDING)->get() as $leave) {
            $balance = LeaveBalance::where([
                'employee_id' => $leave->employee_id,
                'leave_type_id' => $leave->leave_type_id,
                'year' => $leave->start_date->year,
            ])->first();

            if ($balance) {
                $balance->decrement('pending_days', $leave->total_days);
            }

            $leave->update([
                'status' => LeaveRequestStatus::REJECTED,
                'comment' => $request->input('comment'),
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);
        }

        return back()->with('success', 'Selected leave requests rejected.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
        ]);

        LeaveRequest::whereIn('id', $request->input('ids'))->delete();

        return back()->with('success', 'Selected leave requests deleted.');
    }
}
