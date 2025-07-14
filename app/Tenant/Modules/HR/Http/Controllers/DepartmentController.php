<?php

namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Enum\DepartmentStatus;
use App\Tenant\Modules\HR\Http\Requests\StoreDepartmentRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateDepartmentRequest;
use App\Tenant\Modules\HR\Models\Department;
use App\Tenant\Modules\HR\Models\Employee;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Concerns\BelongsToTenant;

class DepartmentController extends Controller
{
    use BelongsToTenant;

    public function index(): Response
    {
        return Inertia::render('modules/hr/departments/index');
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/departments/create', [
            'departments' => Department::active()->get(['id', 'name']),
            'employees' => Employee::active()->get(['id']),
        ]);
    }

    public function store(StoreDepartmentRequest $request): RedirectResponse
    {
        Department::create($request->validated());

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department created successfully.');
    }

    public function show($id): Response
    {
        $department = Department::with(['manager', 'employees', 'parent', 'children'])
            ->findOrFail($id);

        return Inertia::render('modules/hr/departments/show', [
            'department' => $department,
        ]);
    }

    public function edit($id): Response
    {
        $department = Department::findOrFail($id);

        return Inertia::render('modules/hr/departments/edit', [
            'department' => $department,
            'departments' => Department::where('id', '!=', $department->id)->active()->get(['id', 'name']),
            'employees' => Employee::active()->get(['id']),
        ]);
    }

    public function update(UpdateDepartmentRequest $request, $id): RedirectResponse
    {
        $department = Department::findOrFail($id);
        $department->update($request->validated());

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department updated successfully.');
    }

    /**
     * Activate the specified department.
     */
    public function activate(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $department = Department::findOrFail($id);

        if ($department->status === DepartmentStatus::ACTIVE) {
            return back()->withErrors(['activate' => 'Department is already active.']);
        }

        $department->update(['status' => DepartmentStatus::ACTIVE]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department activated successfully.');
    }



    public function suspend(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $department = Department::findOrFail($id);

        if ($department->status === DepartmentStatus::SUSPENDED) {
            return back()->withErrors(['suspend' => 'Department is already suspended.']);
        }

        $department->update(['status' => DepartmentStatus::SUSPENDED]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department suspended successfully.');
    }


    public function deactivate(Request $request, $id): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $department = Department::findOrFail($id);

        if ($department->status === DepartmentStatus::INACTIVE) {
            return back()->withErrors(['deactivate' => 'Department is already inactive.']);
        }

        $department->update(['status' => DepartmentStatus::INACTIVE]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Department marked as inactive.');
    }


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

    /**
     * Bulk activate departments.
     */
    public function bulkActivate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:departments,id'],
            'password' => ['required', 'current_password'],
        ]);

        Department::whereIn('id', $validated['ids'])
            ->where('status', '!=', DepartmentStatus::ACTIVE)
            ->update(['status' => DepartmentStatus::ACTIVE]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Selected departments activated successfully.');
    }


    /**
     * Bulk suspend departments.
     */
    public function bulkSuspend(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:departments,id'],
            'password' => ['required', 'current_password'],
        ]);

        Department::whereIn('id', $validated['ids'])
            ->where('status', '!=', DepartmentStatus::SUSPENDED)
            ->update(['status' => DepartmentStatus::SUSPENDED]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Selected departments suspended successfully.');
    }


    /**
     * Bulk deactivate departments.
     */
    public function bulkDeactivate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:departments,id'],
            'password' => ['required', 'current_password'],
        ]);

        Department::whereIn('id', $validated['ids'])
            ->where('status', '!=', DepartmentStatus::INACTIVE)
            ->update(['status' => DepartmentStatus::INACTIVE]);

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Selected departments marked as inactive.');
    }


    /**
     * Bulk delete departments.
     */
    public function bulkDestroy(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'ids' => ['required', 'array', 'min:1'],
            'ids.*' => ['integer', 'exists:departments,id'],
            'password' => ['required', 'current_password'],
        ]);

        $departments = Department::whereIn('id', $validated['ids'])->get();

        foreach ($departments as $department) {
            if ($department->employees()->exists()) {
                return back()->withErrors(['delete' => "Cannot delete department '{$department->name}' with active employees."]);
            }

            if ($department->children()->exists()) {
                return back()->withErrors(['delete' => "Cannot delete department '{$department->name}' with sub-departments."]);
            }

            $department->delete();
        }

        return redirect()->route('modules.hr.departments.index')
            ->with('success', 'Selected departments deleted successfully.');
    }


}
