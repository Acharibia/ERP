<?php
namespace Database\Seeders\Central;

use App\Central\Models\Permission;
use App\Central\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Get all permissions
        $allPermissions = Permission::pluck('id', 'name');

        // Define permission sets
        $adminPermissions    = $allPermissions->except(['admin.create', 'admin.delete']);
        $resellerPermissions = $allPermissions->only([
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
        ]);

        // Assign all permissions to system_admin
        $superAdminRole = Role::where('name', 'system_admin')->first();
        if ($superAdminRole) {
            $superAdminRole->permissions()->sync($allPermissions->values()->all());
        }

        // Assign admin permissions
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            $adminRole->permissions()->sync($adminPermissions->values()->all());
        }

        // Assign reseller permissions
        $resellerRole = Role::where('name', 'reseller')->first();
        if ($resellerRole) {
            $resellerRole->permissions()->sync($resellerPermissions->values()->all());
        }

        $this->command->info('Role-permission assignments completed.');
    }
}
