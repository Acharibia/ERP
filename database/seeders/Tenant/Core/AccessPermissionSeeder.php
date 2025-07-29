<?php
namespace Database\Seeders\Tenant\Core;

use App\Tenant\Core\Enum\AccessPermissionEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class AccessPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create access control permissions using the enum
        foreach (AccessPermissionEnum::cases() as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission->value, 'guard_name' => 'web'],
                [
                    'name' => $permission->value,
                    'guard_name' => 'web',
                    'module' => 'core',
                ]
            );
        }

        $this->command->info('✓ Access Permissions seeded successfully!');
    }
}
