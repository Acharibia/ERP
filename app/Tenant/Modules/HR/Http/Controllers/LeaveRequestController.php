<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Enum\LeaveRequestStatus;
use App\Tenant\Modules\HR\Http\Requests\StoreLeaveRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateLeaveRequest;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\LeaveRequest;
use App\Tenant\Modules\HR\Models\LeaveType;
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
        LeaveRequest::create($request->validated());

        return redirect()->route('modules.hr.leaves.index')
            ->with('success', 'Leave request created successfully.');
    }

    public function show($id): Response
    {
        $leave = LeaveRequest::with(['employee', 'leaveType', 'approver'])->findOrFail($id);

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
        $leave = LeaveRequest::findOrFail($id);
        $leave->update([
            'status' => LeaveRequestStatus::APPROVED,
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Leave approved successfully.');
    }

    public function reject(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

        $leave = LeaveRequest::findOrFail($id);
        $leave->update([
            'status' => LeaveRequestStatus::REJECTED,
            'comment' => $request->input('comment'),
            'reviewed_by' => auth()->id(),
            'reviewed_at' => now(),
        ]);

        return back()->with('success', 'Leave rejected successfully.');
    }

    public function bulkApprove(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
        ]);

        LeaveRequest::whereIn('id', $request->input('ids'))
            ->where('status', LeaveRequestStatus::PENDING->value)
            ->update([
                'status' => LeaveRequestStatus::APPROVED,
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

        return back()->with('success', 'Selected leave requests approved.');
    }

    public function bulkReject(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
            'comment' => 'required|string|max:1000',
        ]);

        LeaveRequest::whereIn('id', $request->input('ids'))
            ->where('status', LeaveRequestStatus::PENDING->value)
            ->update([
                'status' => LeaveRequestStatus::REJECTED,
                'comment' => $request->input('comment'),
                'reviewed_by' => auth()->id(),
                'reviewed_at' => now(),
            ]);

        return back()->with('success', 'Selected leave requests rejected.');
    }

    public function bulkDelete(Request $request): RedirectResponse
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'exists:leave_requests,id',
        ]);

        LeaveRequest::whereIn('id', $request->input('ids'))->delete();

        return back()->with('success', 'Selected leave requests deleted.');
    }
}
