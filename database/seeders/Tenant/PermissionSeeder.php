<?php

namespace Database\Seeders\Tenant;

use App\Tenant\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->createCorePermissions();
        $this->createTenantRoles();
        $this->command->info('Tenant permissions and roles created successfully.');
    }

    /**
     * Create core tenant permissions for business administration
     */
    private function createCorePermissions(): void
    {
        $corePermissions = [
            // User Management
            'users.view',
            'users.create',
            'users.update',
            'users.delete',
            'users.invite',
            'users.manage_roles',

            // Business Settings
            'settings.view',
            'settings.update',
            'settings.manage_modules',

            // Dashboard & Analytics
            'dashboard.view',
            'analytics.view',
            'analytics.export',

            // File Management
            'files.view',
            'files.upload',
            'files.download',
            'files.delete',

            // Audit Logs
            'audit_logs.view',
            'audit_logs.export',


            // Notifications
            'notifications.view',
            'notifications.create',
            'notifications.update',
            'notifications.delete',

            // Integrations
            'integrations.view',
            'integrations.create',
            'integrations.update',
            'integrations.delete',
            'integrations.manage_credentials',

            // Reports
            'reports.view',
            'reports.create',
            'reports.update',
            'reports.delete',
            'reports.export',
            'reports.schedule',
        ];

        $this->createPermissions($corePermissions);
    }

    /**
     * Create permissions helper method
     */
    private function createPermissions(array $permissions): void
    {
        foreach ($permissions as $permissionName) {
            Permission::updateOrCreate(
                ['name' => $permissionName, 'guard_name' => 'web'],
                ['name' => $permissionName, 'guard_name' => 'web']
            );
        }
    }

    /**
     * Create tenant roles
     */
    private function createTenantRoles(): void
    {
        $roles = [
            [
                'name' => 'Business Admin',
                'guard_name' => 'web',
                'permissions' => [
                    // All core permissions
                    'users.view',
                    'users.create',
                    'users.update',
                    'users.delete',
                    'users.invite',
                    'users.manage_roles',
                    'settings.view',
                    'settings.update',
                    'settings.manage_modules',
                    'dashboard.view',
                    'analytics.view',
                    'analytics.export',
                    'files.view',
                    'files.upload',
                    'files.download',
                    'files.delete',
                    'audit_logs.view',
                    'audit_logs.export',
                    'custom_fields.view',
                    'custom_fields.create',
                    'custom_fields.update',
                    'custom_fields.delete',
                    'notifications.view',
                    'notifications.create',
                    'notifications.update',
                    'notifications.delete',
                    'integrations.view',
                    'integrations.create',
                    'integrations.update',
                    'integrations.delete',
                    'integrations.manage_credentials',
                    'reports.view',
                    'reports.create',
                    'reports.update',
                    'reports.delete',
                    'reports.export',
                    'reports.schedule',
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

            // Assign permissions to role
            if (!empty($permissions)) {
                $permissionModels = Permission::whereIn('name', $permissions)->get();
                $role->permissions()->sync($permissionModels->pluck('id')->toArray());
            }
        }
    }
}
