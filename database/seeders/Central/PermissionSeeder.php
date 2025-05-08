<?php

namespace Database\Seeders\Central;

use App\Central\Models\Permission;
use App\Central\Models\Role;
use App\Central\Models\User;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create central system permissions
        $centralPermissions = [
            // Admin permissions
            'admin.view',
            'admin.create',
            'admin.update',
            'admin.delete',

            // Business permissions
            'businesses.view',
            'businesses.create',
            'businesses.update',
            'businesses.delete',

            // Reseller permissions
            'resellers.view',
            'resellers.create',
            'resellers.update',
            'resellers.delete',

            // Module permissions
            'modules.view',
            'modules.create',
            'modules.update',
            'modules.delete',

            // Package permissions
            'packages.view',
            'packages.create',
            'packages.update',
            'packages.delete',

            // System settings
            'settings.view',
            'settings.update',

            // For resellers
            'clients.view',
            'clients.create',
            'clients.update',
            'clients.delete',

            'subscriptions.view',
            'subscriptions.create',
            'subscriptions.update',

            'invoices.view',
            'invoices.create',
            'invoices.update',
        ];

        // Create permissions
        foreach ($centralPermissions as $permissionName) {
            Permission::updateOrCreate(
                ['name' => $permissionName, 'guard_name' => 'web'],
                ['name' => $permissionName, 'guard_name' => 'web']
            );
        }

        // Create roles
        $roles = [
            [
                'name' => 'Super Admin',
                'guard_name' => 'web',
                'permissions' => $centralPermissions, // All permissions
            ],
            [
                'name' => 'Admin',
                'guard_name' => 'web',
                'permissions' => array_filter($centralPermissions, function ($permission) {
                    // Exclude some sensitive permissions
                    return !in_array($permission, ['admin.create', 'admin.delete']);
                }),
            ],
            [
                'name' => 'Reseller Admin',
                'guard_name' => 'web',
                'permissions' => [
                    'clients.view',
                    'clients.create',
                    'clients.update',
                    'clients.delete',
                    'subscriptions.view',
                    'subscriptions.create',
                    'subscriptions.update',
                    'invoices.view',
                    'invoices.create',
                    'invoices.update',
                ],

            ],
            [
                'name' => 'Reseller Staff',
                'guard_name' => 'web',
                'permissions' => [
                    'clients.view',
                    'subscriptions.view',
                    'invoices.view',
                    'invoices.create',
                ],

            ],
        ];

        foreach ($roles as $roleData) {
            $permissions = $roleData['permissions'] ?? [];
            unset($roleData['permissions']);

            $role = Role::updateOrCreate(
                ['name' => $roleData['name'], 'guard_name' => $roleData['guard_name']],
                $roleData
            );

            // Assign permissions to role - use sync instead of attach
            if (!empty($permissions)) {
                $permissionModels = Permission::whereIn('name', $permissions)->get();
                $role->permissions()->sync($permissionModels->pluck('id')->toArray());
            }
        }

        // Assign roles to users
        $this->assignRolesToUsers();

        $this->command->info('Permissions and roles created successfully.');
    }

    /**
     * Assign roles to respective users
     */
    private function assignRolesToUsers(): void
    {
        // Assign Super Admin role to super admin users
        $superAdminRole = Role::where('name', 'Super Admin')->first();
        $superAdminUsers = User::where('is_super_admin', true)->get();

        foreach ($superAdminUsers as $user) {
            // Check if user already has this role
            if (!$user->hasRole($superAdminRole)) {
                $user->assignRole($superAdminRole);
            }
        }

        // Assign Admin role to other system admin users
        $adminRole = Role::where('name', 'Admin')->first();
        $adminUsers = User::where('user_type', 'system_admin')
            ->where('is_super_admin', false)
            ->get();

        foreach ($adminUsers as $user) {
            // Check if user already has this role
            if (!$user->hasRole($adminRole)) {
                $user->assignRole($adminRole);
            }
        }

        // Assign Reseller Admin role to reseller users
        $resellerAdminRole = Role::where('name', 'Reseller Admin')->first();
        $resellerUsers = User::where('user_type', 'reseller')
            ->whereHas('reseller', function ($query) {
                $query->where('status', 'active');
            })
            ->get();

        foreach ($resellerUsers as $user) {
            // Check if user already has this role
            if (!$user->hasRole($resellerAdminRole)) {
                $user->assignRole($resellerAdminRole);
            }
        }

        // Business users are handled through the business_role_user table
        // This is typically managed at the tenant level
    }
}
