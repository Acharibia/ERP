<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Models\ShiftRotation;
use App\Tenant\Modules\HR\Models\Shift;
use App\Tenant\Modules\HR\Http\Requests\StoreShiftRotationRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateShiftRotationRequest;
use Inertia\Inertia;
use Inertia\Response;

class ShiftRotationController extends Controller
{
    public function index($employeeShiftRotationId): Response
    {
        $pattern = ShiftRotation::where('employee_shift_rotation_id', $employeeShiftRotationId)
            ->with('shift')
            ->orderBy('order')
            ->get();
        return Inertia::render('modules/hr/shift-rotations/index', [
            'pattern' => $pattern,
            'employeeShiftRotationId' => $employeeShiftRotationId,
        ]);
    }

    public function create($employeeShiftRotationId): Response
    {
        $shifts = Shift::all(['id', 'name']);
        return Inertia::render('modules/hr/shift-rotations/create', [
            'employeeShiftRotationId' => $employeeShiftRotationId,
            'shifts' => $shifts,
        ]);
    }

    public function store(StoreShiftRotationRequest $request, $employeeShiftRotationId)
    {
        ShiftRotation::create(array_merge(
            $request->validated(),
            ['employee_shift_rotation_id' => $employeeShiftRotationId]
        ));
        return redirect()->route('modules.hr.shift-rotations.index', $employeeShiftRotationId)->with('success', 'Shift rotation pattern entry created successfully.');
    }

    public function edit($id): Response
    {
        $shiftRotation = ShiftRotation::findOrFail($id);
        $shifts = Shift::all(['id', 'name']);
        return Inertia::render('modules/hr/shift-rotations/edit', [
            'shiftRotation' => $shiftRotation,
            'shifts' => $shifts,
        ]);
    }

    public function update(UpdateShiftRotationRequest $request, $id)
    {
        $shiftRotation = ShiftRotation::findOrFail($id);
        $shiftRotation->update($request->validated());
        return redirect()->route('modules.hr.shift-rotations.index', $shiftRotation->employee_shift_rotation_id)->with('success', 'Shift rotation pattern entry updated successfully.');
    }

    public function destroy($id)
    {
        $shiftRotation = ShiftRotation::findOrFail($id);
        $employeeShiftRotationId = $shiftRotation->employee_shift_rotation_id;
        $shiftRotation->delete();
        return redirect()->route('modules.hr.shift-rotations.index', $employeeShiftRotationId)->with('success', 'Shift rotation pattern entry deleted successfully.');
    }
}
