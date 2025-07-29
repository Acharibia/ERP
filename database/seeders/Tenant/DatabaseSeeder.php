<?php
namespace Database\Seeders\Tenant;

use Database\Seeders\Tenant\Core\CoreSeeder;
use Database\Seeders\Tenant\HR\HRSeeder;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            CoreSeeder::class,
            HRSeeder::class,
        ]);
    }
}
