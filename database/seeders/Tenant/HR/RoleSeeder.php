<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Enum\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create HR roles using the enum
        foreach (RoleEnum::cases() as $role) {
            Role::firstOrCreate(
                ['name' => $role->value, 'guard_name' => 'web'],
                [
                    'name'        => $role->value,
                    'guard_name'  => 'web',
                    'module'      => $role->module(),
                    'protected'   => $role->isProtected(),
                    'description' => $role->description(),
                ]
            );
        }

        $this->command->info('✓ HR Roles seeded successfully!');
    }
}
