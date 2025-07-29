<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAccessController extends Controller
{
    /**
     * Display a listing of the HR roles.
     */
    public function index(): Response
    {
        return Inertia::render('modules/hr/role-access/index');
    }

    /**
     * Show the form for creating a new HR role.
     */
    public function create(): Response
    {
        $permissions = Permission::where('module', 'hr')->get(['id', 'name']);
        return Inertia::render('modules/hr/role-access/create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created HR role in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255', 'unique:roles,name'],
            'description'   => ['nullable', 'string', 'max:255'],
            'permissions'   => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);
        $roleName = strtolower($validated['name']);
        if (! str_starts_with($roleName, 'hr_')) {
            $roleName = 'hr_' . ltrim($roleName, '_');
        }
        $role = Role::create([
            'name'        => $roleName,
            'description' => $validated['description'] ?? null,
            'guard_name'  => 'web',
        ]);
        if (! empty($validated['permissions'])) {
            $role->syncPermissions($validated['permissions']);
        }
        return redirect()->route('modules.hr.role-access.index')
            ->with('success', 'Role created successfully.');
    }

    /**
     * Display the specified HR role.
     */
    public function show($id): Response
    {
        $role = Role::where('module', 'hr')->findOrFail($id);
        return Inertia::render('modules/hr/role-access/show', [
            'role' => $role,
        ]);
    }

    /**
     * Show the form for editing the specified HR role.
     */
    public function edit($id): Response
    {
        $role        = Role::where('module', 'hr')->with('permissions')->findOrFail($id);
        $permissions = Permission::where('module', 'hr')->get(['id', 'name']);
        return Inertia::render('modules/hr/role-access/edit', [
            'role'        => $role,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified HR role in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $role      = Role::where('module', 'hr')->findOrFail($id);
        $validated = $request->validate([
            'name'          => ['required', 'string', 'max:255', 'unique:roles,name,' . $role->id],
            'description'   => ['nullable', 'string', 'max:255'],
            'permissions'   => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);
        $roleName = strtolower($validated['name']);
        if (! str_starts_with($roleName, 'hr_')) {
            $roleName = 'hr_' . ltrim($roleName, '_');
        }
        $role->update([
            'name'        => $roleName,
            'description' => $validated['description'] ?? null,
        ]);
        $role->syncPermissions($validated['permissions'] ?? []);
        return redirect()->route('modules.hr.role-access.index')
            ->with('success', 'Role updated successfully.');
    }

    /**
     * Remove the specified HR role from storage.
     */
    public function destroy($id): RedirectResponse
    {
        $role = Role::where('module', 'hr')->findOrFail($id);
        $role->delete();
        return redirect()->route('modules.hr.role-access.index')
            ->with('success', 'Role deleted successfully.');
    }
}
