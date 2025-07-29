<?php
namespace Database\Seeders\Central;

use App\Central\Models\Permission;
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

        $this->command->info('Permissions created successfully.');
    }
}
