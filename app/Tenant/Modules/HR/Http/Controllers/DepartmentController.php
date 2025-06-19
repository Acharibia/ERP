<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Http\Requests\StoreDepartmentRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateDepartmentRequest;
use App\Tenant\Modules\HR\Models\Department;
use App\Tenant\Modules\HR\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class DepartmentController extends Controller
{
    use BelongsToTenant;

    /**
     * Display a listing of departments.
     */
    public function index(): Response
    {
        return Inertia::render('modules/hr/departments/index');
    }

    /**
     * Show the form for creating a new department.
     */
    public function create(): Response
    {
        return Inertia::render('modules/hr/departments/create', [
            'departments' => Department::active()->get(['id', 'name']),
            'employees' => Employee::active()->get(['id', 'name']),
        ]);
    }

    /**
     * Store a newly created department.
     */
    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());
        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department created successfully.');
    }

    /**
     * Display the specified department.
     */
    public function show($id): Response
    {
        $department = Department::findOrFail($id);
        $department->load(['manager', 'employees', 'parent', 'children']);

        return Inertia::render('modules/hr/departments/show', [
            'department' => $department
        ]);
    }

    /**
     * Show the form for editing the specified department.
     */
    public function edit($id): Response
    {
        $department = Department::findOrFail($id);
    
        return Inertia::render('modules/hr/departments/edit', [
            'department' => $department,
            'departments' => Department::where('id', '!=', $department->id)->active()->get(['id', 'name']),
            'employees' => Employee::active()->get(['id', 'name']),
        ]);
    }

    /**
     * Update the specified department.
     */
    public function update(UpdateDepartmentRequest $request, $id): RedirectResponse
    {
        $department = Department::findOrFail($id);
        $department->update($request->validated());

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Remove the specified department.
     */
    public function destroy($id): RedirectResponse
    {
        $department = Department::findOrFail($id);

        if ($department->employees()->count() > 0) {
            return back()->withErrors(['delete' => 'Cannot delete department with active employees.']);
        }

        if ($department->children()->count() > 0) {
            return back()->withErrors(['delete' => 'Cannot delete department with sub-departments.']);
        }

        $department->delete();

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department deleted successfully.');
    }
}
