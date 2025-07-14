<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Enum\EmploymentType;
use App\Tenant\Modules\HR\Enum\PositionLevel;
use App\Tenant\Modules\HR\Enum\PositionStatus;
use App\Tenant\Modules\HR\Models\Department;
use App\Tenant\Modules\HR\Models\Position;
use App\Tenant\Modules\HR\Http\Requests\StorePositionRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdatePositionRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PositionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('modules/hr/positions/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('modules/hr/positions/create', [
            'departments' => Department::active()->orderBy('name')->get(['id', 'name']),
            'employmentTypes' => EmploymentType::options(),
            'positionLevels' => PositionLevel::options(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePositionRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        Position::create($validated);

        return redirect()
            ->route('modules.hr.positions.index')
            ->with('success', 'Position created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id): Response
    {
        $position = Position::findOrFail($id);
        $position->load(['department', 'employees.department']);

        return Inertia::render('modules/hr/positions/show', [
            'position' => $position,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id): Response
    {
        $position = Position::findOrFail($id);

        $departments = Department::active()
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('modules/hr/positions/edit', [
            'position' => $position,
            'departments' => $departments,
            'employmentTypes' => EmploymentType::options(),
            'positionLevels' => PositionLevel::options(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdatePositionRequest $request, $id): RedirectResponse
    {
        $position = Position::findOrFail($id);
        $validated = $request->validated();

        $position->update($validated);

        return redirect()
            ->route('modules.hr.positions.index')
            ->with('success', 'Position updated successfully.');
    }

    public function activate(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $position = Position::findOrFail($id);

        if ($position->status === PositionStatus::ACTIVE) {
            return back()->withErrors(['activate' => 'Position is already active.']);
        }

        $position->update(['status' => PositionStatus::ACTIVE]);

        return redirect()->route('modules.hr.positions.index')
            ->with('success', 'Position activated successfully.');
    }

    public function deactivate(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $position = Position::findOrFail($id);

        if ($position->status === PositionStatus::INACTIVE) {
            return back()->withErrors(['deactivate' => 'Position is already inactive.']);
        }

        $position->update(['status' => PositionStatus::INACTIVE]);

        return redirect()->route('modules.hr.positions.index')
            ->with('success', 'Position marked as inactive.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $position = Position::findOrFail($id);

        // Check if position has employees
        if ($position->employees()->count() > 0) {
            return redirect()
                ->back()
                ->with('error', 'Cannot delete position that has employees assigned to it.');
        }

        $position->delete();

        return redirect()
            ->route('modules.hr.positions.index')
            ->with('success', 'Position deleted successfully.');
    }


    public function bulkActivate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:positions,id'],
            'password' => ['required', 'current_password'],
        ]);

        Position::whereIn('id', $validated['ids'])
            ->where('status', '!=', PositionStatus::ACTIVE)
            ->update(['status' => PositionStatus::ACTIVE]);

        return redirect()->route('modules.hr.positions.index')
            ->with('success', 'Selected positions activated successfully.');
    }

    public function bulkDeactivate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:positions,id'],
            'password' => ['required', 'current_password'],
        ]);

        Position::whereIn('id', $validated['ids'])
            ->where('status', '!=', PositionStatus::INACTIVE)
            ->update(['status' => PositionStatus::INACTIVE]);

        return redirect()->route('modules.hr.positions.index')
            ->with('success', 'Selected positions marked as inactive.');
    }

    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:positions,id'],
            'password' => ['required', 'current_password'],
        ]);

        $positions = Position::whereIn('id', $validated['ids'])->get();

        foreach ($positions as $position) {
            if ($position->employees()->exists()) {
                return back()->withErrors([
                    'delete' => "Cannot delete position '{$position->title}' that has employees assigned.",
                ]);
            }

            $position->delete();
        }

        return redirect()->route('modules.hr.positions.index')
            ->with('success', 'Selected positions deleted successfully.');
    }

}
