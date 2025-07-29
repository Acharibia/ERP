<?php
namespace Database\Seeders\Tenant\Core;

use App\Tenant\Core\Enum\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Get Owner role and assign all permissions
        $ownerRole = Role::where('name', RoleEnum::OWNER->value)->first();
        if ($ownerRole) {
            $ownerRole->syncPermissions(Permission::all());
            $this->command->info("✓ Assigned all permissions to " . RoleEnum::OWNER->value);
        }

        // Get Administrator role and assign all permissions
        $adminRole = Role::where('name', RoleEnum::ADMINISTRATOR->value)->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::all());
            $this->command->info("✓ Assigned all permissions to " . RoleEnum::ADMINISTRATOR->value);
        }

        $this->command->info('✓ Core Role Permissions seeded successfully!');
    }
}
