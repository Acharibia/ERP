<?php

namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\Shift;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Tenant\HR\Http\Requests\StoreShiftRequest;
use App\Tenant\HR\Http\Requests\UpdateShiftRequest;

class ShiftController extends Controller
{
    public function index(): Response
    {
        $shifts = Shift::all();
        return Inertia::render('modules/hr/shifts/index', [
            'shifts' => $shifts,
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/shifts/create');
    }

    public function store(StoreShiftRequest $request)
    {
        $validated = $request->validated();
        Shift::create($validated);
        return redirect()->route('modules.hr.shifts.index')->with('success', 'Shift created successfully.');
    }

    public function show($id): Response
    {
        $shift = Shift::findOrFail($id);
        return Inertia::render('modules/hr/shifts/show', [
            'shift' => $shift,
        ]);
    }

    public function edit($id): Response
    {
        $shift = Shift::findOrFail($id);
        return Inertia::render('modules/hr/shifts/edit', [
            'shift' => $shift,
        ]);
    }

    public function update(UpdateShiftRequest $request, $id)
    {
        $shift = Shift::findOrFail($id);
        $validated = $request->validated();
        $shift->update($validated);
        return redirect()->route('modules.hr.shifts.index')->with('success', 'Shift updated successfully.');
    }

    public function destroy($id)
    {
        $shift = Shift::findOrFail($id);
        $shift->delete();
        return redirect()->route('modules.hr.shifts.index')->with('success', 'Shift deleted successfully.');
    }
}
