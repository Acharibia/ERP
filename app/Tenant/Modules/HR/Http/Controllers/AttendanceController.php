<?php
namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Http\Requests\StoreAttendanceRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateAttendanceRequest;
use App\Tenant\Modules\HR\Models\Attendance;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\Shift;
use Inertia\Inertia;
use Inertia\Response;

class AttendanceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('modules/hr/attendance/index');
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/attendance/create', [
            'employees' => Employee::active()->get(['id']),
            'shifts'    => Shift::all(['id', 'name']),
        ]);
    }

    public function store(StoreAttendanceRequest $request)
    {
        $validated = $request->validated();
        Attendance::create($validated);
        return redirect()->route('modules.hr.attendance.index')->with('success', 'Attendance record created successfully.');
    }

    public function show($id): Response
    {
        $attendance = Attendance::with(['employee', 'shift'])->findOrFail($id);
        return Inertia::render('modules/hr/attendance/show', [
            'attendance' => $attendance,
        ]);
    }

    public function edit($id): Response
    {
        $attendance = Attendance::findOrFail($id);
        $employees  = Employee::all(['id', 'name']);
        $shifts     = Shift::all(['id', 'name']);
        return Inertia::render('modules/hr/attendance/edit', [
            'attendance' => $attendance,
            'employees'  => $employees,
            'shifts'     => $shifts,
        ]);
    }

    public function update(UpdateAttendanceRequest $request, $id)
    {
        $attendance = Attendance::findOrFail($id);
        $validated  = $request->validated();
        $attendance->update($validated);
        return redirect()->route('modules.hr.attendance.index')->with('success', 'Attendance record updated successfully.');
    }

    public function destroy($id)
    {
        $attendance = Attendance::findOrFail($id);
        $attendance->delete();
        return redirect()->route('modules.hr.attendance.index')->with('success', 'Attendance record deleted successfully.');
    }
}
