<?php
namespace Database\Seeders\Tenant\Core;

use Illuminate\Database\Seeder;
use Spatie\Permission\PermissionRegistrar;

class CoreSeeder extends Seeder
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

        // Run the seeders in order
        $this->call([
            PermissionSeeder::class,
            RoleSeeder::class,
            RolePermissionSeeder::class,
        ]);
    }
}
