<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Core\Models\User;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Position;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class UserAccessController extends Controller
{
    /**
     * Display the comprehensive access management page.
     */
    public function index(): Response
    {
        $users       = User::orderBy('name')->get(['id', 'name', 'email']);
        $roles       = Role::query()->where('module', 'hr')->get(['id', 'name', 'description']);
        $permissions = Permission::query()->where('module', 'hr')->get(['id', 'name']);
        $departments = Department::query()->orderBy('name')->get(['id', 'name']);
        $positions   = Position::query()->orderBy('title')->get(['id', 'title']);
        return Inertia::render('modules/hr/user-access/index', [
            'users'       => $users,
            'roles'       => $roles,
            'permissions' => $permissions,
            'departments' => $departments,
            'positions'   => $positions,
        ]);
    }

    /**
     * Show the form for editing user access control.
     */
    public function edit($id): Response
    {
        $user        = User::with(['roles', 'permissions'])->findOrFail($id);
        $roles       = Role::query()->get(['id', 'name', 'description']);
        $permissions = Permission::query()->where('module', 'hr')->get(['id', 'name']);

        return Inertia::render('modules/hr/user-access/edit', [
            'user'        => $user,
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified user's access control in storage.
     */
    public function update(Request $request, $id): RedirectResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'roles'         => ['array'],
            'roles.*'       => ['integer', 'exists:roles,id'],
            'permissions'   => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
        ]);

        // Sync roles
        if (isset($validated['roles'])) {
            $user->syncRoles($validated['roles']);
        }

        // Sync direct permissions
        if (isset($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        }

        return redirect()->route('modules.hr.user-access.index')
            ->with('success', 'User access control updated successfully.');
    }

    /**
     * Display the specified user's access control information.
     */
    public function show($id): Response
    {
        $user = User::with(['roles', 'permissions'])->findOrFail($id);

        // Get all permissions the user has (both from roles and direct)
        $allPermissions = $user->getAllPermissions();

        return Inertia::render('modules/hr/user-access/show', [
            'user'           => $user,
            'allPermissions' => $allPermissions,
        ]);
    }

    /**
     * Bulk update user access control.
     */
    public function bulkUpdate(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'user_ids'      => ['required', 'array'],
            'user_ids.*'    => ['integer', 'exists:users,id'],
            'roles'         => ['array'],
            'roles.*'       => ['integer', 'exists:roles,id'],
            'permissions'   => ['array'],
            'permissions.*' => ['integer', 'exists:permissions,id'],
            'action'        => ['required', 'string', 'in:assign,remove'],
        ]);

        $users = User::whereIn('id', $validated['user_ids'])->get();

        foreach ($users as $user) {
            if ($validated['action'] === 'assign') {
                if (isset($validated['roles'])) {
                    $user->assignRole($validated['roles']);
                }
                if (isset($validated['permissions'])) {
                    $user->givePermissionTo($validated['permissions']);
                }
            } else {
                if (isset($validated['roles'])) {
                    $user->removeRole($validated['roles']);
                }
                if (isset($validated['permissions'])) {
                    $user->revokePermissionTo($validated['permissions']);
                }
            }
        }

        return redirect()->route('modules.hr.user-access.index')
            ->with('success', 'Bulk access control update completed successfully.');
    }

    /**
     * Handle the new comprehensive access management form submission.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'selection_type'   => ['required', 'string', 'in:user,department,position'],
            'selected_items'   => ['required', 'array', 'min:1'],
            'selected_items.*' => ['integer'],
            'roles'            => ['array'],
            'roles.*'          => ['integer', 'exists:roles,id'],
            'permissions'      => ['array'],
            'permissions.*'    => ['integer', 'exists:permissions,id'],
        ]);

        $selectedItems = $validated['selected_items'];
        $roles         = $validated['roles'] ?? [];
        $permissions   = $validated['permissions'] ?? [];

        switch ($validated['selection_type']) {
            case 'user':
                $this->assignToUsers($selectedItems, $roles, $permissions);
                break;
            case 'department':
                $this->assignToDepartmentUsers($selectedItems, $roles, $permissions);
                break;
            case 'position':
                $this->assignToPositionUsers($selectedItems, $roles, $permissions);
                break;
        }

        return redirect()->route('modules.hr.user-access.index')
            ->with('success', 'Access control updated successfully.');
    }

    /**
     * Assign roles and permissions to specific users.
     */
    private function assignToUsers(array $userIds, array $roles, array $permissions): void
    {
        $users = User::whereIn('id', $userIds)->get();

        foreach ($users as $user) {
            if (! empty($roles)) {
                $user->assignRole($roles);
            }
            if (! empty($permissions)) {
                $user->givePermissionTo($permissions);
            }
        }
    }

    /**
     * Assign roles and permissions to users in specific departments.
     */
    private function assignToDepartmentUsers(array $departmentIds, array $roles, array $permissions): void
    {
        $users = User::whereHas('employee', function ($query) use ($departmentIds) {
            $query->whereIn('department_id', $departmentIds);
        })->get();

        foreach ($users as $user) {
            if (! empty($roles)) {
                $user->assignRole($roles);
            }
            if (! empty($permissions)) {
                $user->givePermissionTo($permissions);
            }
        }
    }

    /**
     * Assign roles and permissions to users in specific positions.
     */
    private function assignToPositionUsers(array $positionIds, array $roles, array $permissions): void
    {
        $users = User::whereHas('employee', function ($query) use ($positionIds) {
            $query->whereIn('position_id', $positionIds);
        })->get();

        foreach ($users as $user) {
            if (! empty($roles)) {
                $user->assignRole($roles);
            }
            if (! empty($permissions)) {
                $user->givePermissionTo($permissions);
            }
        }
    }
}
