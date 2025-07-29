<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Enum\PermissionEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create HR permissions using the enum
        foreach (PermissionEnum::cases() as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission->value, 'guard_name' => 'web'],
                [
                    'name'        => $permission->value,
                    'guard_name'  => 'web',
                    'module'      => $permission->module(),
                    'description' => $permission->description(),
                ]
            );
        }

        $this->command->info('✓ HR Permissions seeded successfully!');
    }
}
