<?php

namespace Database\Seeders\Shared;

use App\Models\Shared\Module;
use App\Models\Shared\Package;
use Illuminate\Database\Seeder;

class PackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create packages
        $packages = [
            [
                'name' => 'Starter',
                'description' => 'Basic package for small businesses',
                'is_public' => true,
                'base_price' => 49.99,
                'user_limit' => 5,
                'storage_limit' => 5, // GB
                'modules' => ['core', 'hr', 'crm'],
            ],
            [
                'name' => 'Business',
                'description' => 'Standard package for growing businesses',
                'is_public' => true,
                'base_price' => 99.99,
                'user_limit' => 20,
                'storage_limit' => 20, // GB
                'modules' => ['core', 'hr', 'crm', 'inventory', 'accounting'],
            ],
            [
                'name' => 'Enterprise',
                'description' => 'Complete solution for established businesses',
                'is_public' => true,
                'base_price' => 199.99,
                'user_limit' => 50,
                'storage_limit' => 100, // GB
                'modules' => ['core', 'hr', 'crm', 'inventory', 'accounting', 'projects'],
            ],
            [
                'name' => 'Custom',
                'description' => 'Custom package with selected modules',
                'is_public' => false,
                'base_price' => 149.99,
                'user_limit' => null, // Unlimited
                'storage_limit' => null, // Unlimited
                'modules' => ['core'],
            ],
        ];

        foreach ($packages as $packageData) {
            // Extract modules array
            $moduleCodes = $packageData['modules'];
            unset($packageData['modules']);

            // Create package
            $package = Package::create($packageData);

            // Attach modules to package
            $modules = Module::whereIn('code', $moduleCodes)->get();

            foreach ($modules as $module) {
                $package->modules()->attach($module->id);
            }
        }

        $this->command->info('Packages created successfully.');
    }
}
