<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Models\EmployeeShiftRotation;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Http\Requests\StoreEmployeeShiftRotationRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateEmployeeShiftRotationRequest;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeShiftRotationController extends Controller
{
    public function index(): Response
    {
        $rotations = EmployeeShiftRotation::with('employee')->get();
        return Inertia::render('modules/hr/employee-shift-rotations/index', [
            'rotations' => $rotations,
        ]);
    }

    public function create(): Response
    {
        $employees = Employee::all(['id', 'name']);
        return Inertia::render('modules/hr/employee-shift-rotations/create', [
            'employees' => $employees,
        ]);
    }

    public function store(StoreEmployeeShiftRotationRequest $request)
    {
        EmployeeShiftRotation::create($request->validated());
        return redirect()->route('modules.hr.employee-shift-rotations.index')->with('success', 'Employee shift rotation created successfully.');
    }

    public function show($id): Response
    {
        $rotation = EmployeeShiftRotation::with(['employee', 'shiftRotations.shift'])->findOrFail($id);
        return Inertia::render('modules/hr/employee-shift-rotations/show', [
            'rotation' => $rotation,
        ]);
    }

    public function edit($id): Response
    {
        $rotation = EmployeeShiftRotation::findOrFail($id);
        $employees = Employee::all(['id', 'name']);
        return Inertia::render('modules/hr/employee-shift-rotations/edit', [
            'rotation' => $rotation,
            'employees' => $employees,
        ]);
    }

    public function update(UpdateEmployeeShiftRotationRequest $request, $id)
    {
        $rotation = EmployeeShiftRotation::findOrFail($id);
        $rotation->update($request->validated());
        return redirect()->route('modules.hr.employee-shift-rotations.index')->with('success', 'Employee shift rotation updated successfully.');
    }

    public function destroy($id)
    {
        $rotation = EmployeeShiftRotation::findOrFail($id);
        $rotation->delete();
        return redirect()->route('modules.hr.employee-shift-rotations.index')->with('success', 'Employee shift rotation deleted successfully.');
    }
}
