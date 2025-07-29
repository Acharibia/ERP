<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Enum\ShiftRotationFrequency;
use App\Tenant\HR\Enum\ShiftRotationPriority;
use App\Tenant\HR\Http\Requests\StoreShiftRotationRequest;
use App\Tenant\HR\Http\Requests\UpdateShiftRotationRequest;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Position;
use App\Tenant\HR\Models\Shift;
use App\Tenant\HR\Models\ShiftRotation;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Role;

class ShiftRotationController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('modules/hr/shift-rotations/index');
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/shift-rotations/create', [
            'employees'   => Employee::active()->get(['id']),
            'departments' => Department::active()->orderBy('name')->get(['id', 'name']),
            'roles'       => Role::orderBy('name')->get(['id', 'name']),
            'positions'   => Position::active()->orderBy('title')->get(['id', 'title']),
            'priorities'  => ShiftRotationPriority::options(),
            'frequencies' => ShiftRotationFrequency::options(),
        ]);
    }

    public function store(StoreShiftRotationRequest $request)
    {
        $data = $request->validated();

        // Bulk per-employee assignment
        if (! empty($data['employee_ids'])) {
            foreach ($data['employee_ids'] as $employeeId) {
                ShiftRotation::create(array_merge(
                    $data,
                    ['employee_id' => $employeeId],
                    ['employee_ids' => null]
                ));
            }
        } else {
            ShiftRotation::create($data);
        }

        return redirect()->route('modules.hr.shift-rotations.index')->with('success', 'Shift rotation pattern entry created successfully.');
    }

    public function edit($id): Response
    {
        $shiftRotation = ShiftRotation::findOrFail($id);
        $shifts        = Shift::all(['id', 'name']);
        return Inertia::render('modules/hr/shift-rotations/edit', [
            'shiftRotation' => $shiftRotation,
            'shifts'        => $shifts,
            'priorities'    => ShiftRotationPriority::options(),
            'frequencies'   => ShiftRotationFrequency::options(),
        ]);
    }

    public function update(UpdateShiftRotationRequest $request, $id)
    {
        $data          = $request->validated();
        $shiftRotation = ShiftRotation::findOrFail($id);

        if (! empty($data['employee_ids'])) {
            foreach ($data['employee_ids'] as $employeeId) {
                $rotation = ShiftRotation::where('employee_id', $employeeId)
                    ->where('start_date', $shiftRotation->start_date)
                    ->first();
                if ($rotation) {
                    $rotation->update(array_merge($data, ['employee_id' => $employeeId, 'employee_ids' => null]));
                } else {
                    ShiftRotation::create(array_merge($data, ['employee_id' => $employeeId, 'employee_ids' => null]));
                }
            }
            $shiftRotation->delete();
        } else {
            $shiftRotation->update($data);
        }

        return redirect()->route('modules.hr.shift-rotations.index')->with('success', 'Shift rotation pattern entry updated successfully.');
    }

    public function destroy($id)
    {
        $shiftRotation = ShiftRotation::findOrFail($id);
        $shiftRotation->delete();
        return redirect()->route('modules.hr.shift-rotations.index')->with('success', 'Shift rotation pattern entry deleted successfully.');
    }
}
