<?php

namespace Database\Seeders;
use Database\Seeders\Shared\AdminUserSeeder;
use Database\Seeders\Shared\BusinessSeeder;
use Database\Seeders\Shared\IndustrySeeder;
use Database\Seeders\Shared\ModuleSeeder;
use Database\Seeders\Shared\PackageSeeder;
use Database\Seeders\Shared\PermissionSeeder;
use Database\Seeders\Shared\ResellerSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            IndustrySeeder::class,
            ResellerSeeder::class,
            AdminUserSeeder::class,
            ModuleSeeder::class,
            PackageSeeder::class,
            BusinessSeeder::class,
            PermissionSeeder::class,
        ]);
    }
}
