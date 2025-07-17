<?php
namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Http\Requests\StoreShiftPreferenceRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateShiftPreferenceRequest;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\Shift;
use App\Tenant\Modules\HR\Models\ShiftPreference;
use Inertia\Inertia;
use Inertia\Response;

class ShiftPreferenceController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('modules/hr/shift-preferences/index');
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/shift-preferences/create', [
            'employees' => Employee::active()->get(['id']),
            'shifts'    => Shift::all(['id', 'name']),
        ]);
    }

    public function store(StoreShiftPreferenceRequest $request)
    {
        ShiftPreference::create($request->validated());
        return redirect()->route('modules.hr.shift-preferences.index')->with('success', 'Shift preference created successfully.');
    }

    public function show($id): Response
    {
        return Inertia::render('modules/hr/shift-preferences/show', [
            'preference' => ShiftPreference::with(['employee', 'shift'])->findOrFail($id),
        ]);
    }

    public function edit($id): Response
    {
        return Inertia::render('modules/hr/shift-preferences/edit', [
            'preference' => ShiftPreference::findOrFail($id),
            'employees'  => Employee::active()->get(['id']),
            'shifts'     => Shift::all(['id', 'name']),
        ]);
    }

    public function update(UpdateShiftPreferenceRequest $request, $id)
    {
        $preference = ShiftPreference::findOrFail($id);
        $validated  = $request->validated();
        $preference->update($validated);
        return redirect()->route('modules.hr.shift-preferences.index')->with('success', 'Shift preference updated successfully.');
    }

    public function destroy($id)
    {
        $preference = ShiftPreference::findOrFail($id);
        $preference->delete();
        return redirect()->route('modules.hr.shift-preferences.index')->with('success', 'Shift preference deleted successfully.');
    }
}
