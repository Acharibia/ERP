<?php

namespace Database\Seeders\Tenant\Module\Core;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create roles for tenant
        $this->createTenantRoles();
    }

    /**
     * Create tenant roles.
     *
     * @return void
     */
    private function createTenantRoles(): void
    {
        $roles = [
            'owner' => 'Full access to all tenant features',
            'admin' => 'Administrative access to most tenant features',
            'manager' => 'Manage users and basic settings',
            'user' => 'Standard user access',
            'billing_manager' => 'Manage subscriptions and payments',
            'support_agent' => 'Handle support tickets and knowledge base',
            'analyst' => 'View reports and analytics',
            'guest' => 'Limited access to specific features',
        ];

        foreach ($roles as $name => $description) {
            Role::findOrCreate($name, 'web')->update(['description' => $description]);
        }
    }
}
