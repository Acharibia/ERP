<?php

namespace Database\Seeders\Central;
use Database\Seeders\Central\AdminUserSeeder;
use Database\Seeders\Central\BusinessSeeder;
use Database\Seeders\Central\CountrySeeder;
use Database\Seeders\Central\GenderSeeder;
use Database\Seeders\Central\IndustrySeeder;
use Database\Seeders\Central\ModuleSeeder;
use Database\Seeders\Central\NotificationTemplatesSeeder;
use Database\Seeders\Central\PackageSeeder;
use Database\Seeders\Central\PermissionSeeder;
use Database\Seeders\Central\ResellerSeeder;
use Database\Seeders\Central\StateSeeder;
use Database\Seeders\Central\TitleSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CountrySeeder::class,
            StateSeeder::class,
            GenderSeeder::class,
            TitleSeeder::class,
            IndustrySeeder::class,
            ResellerSeeder::class,
            AdminUserSeeder::class,
            ModuleSeeder::class,
            PackageSeeder::class,
            BusinessSeeder::class,
            PermissionSeeder::class,
            NotificationTemplatesSeeder::class,
        ]);
    }
}
