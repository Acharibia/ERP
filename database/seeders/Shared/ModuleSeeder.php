<?php

namespace Database\Seeders\Shared;

use App\Models\Shared\Module;
use Illuminate\Database\Seeder;

class ModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = [
            [
                'name' => 'Core',
                'code' => 'core',
                'description' => 'Core system functionality',
                'version' => '1.0.0',
                'is_core' => true,
                'status' => 'active',
                'icon_url' => 'core.svg',
            ],
            [
                'name' => 'Human Resources',
                'code' => 'hr',
                'description' => 'Employee management, attendance, and payroll',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'hr.svg',
            ],
            [
                'name' => 'Inventory',
                'code' => 'inventory',
                'description' => 'Inventory and stock management',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'inventory.svg',
            ],
            [
                'name' => 'CRM',
                'code' => 'crm',
                'description' => 'Customer relationship management',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'crm.svg',
            ],
            [
                'name' => 'Accounting',
                'code' => 'accounting',
                'description' => 'Financial management and accounting',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'accounting.svg',
            ],
            [
                'name' => 'Project Management',
                'code' => 'projects',
                'description' => 'Project and task management',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'projects.svg',
            ],
            [
                'name' => 'E-Commerce',
                'code' => 'ecommerce',
                'description' => 'Online store and e-commerce management',
                'version' => '1.0.0',
                'is_core' => false,
                'status' => 'active',
                'icon_url' => 'ecommerce.svg',
            ],
        ];

        foreach ($modules as $moduleData) {
            Module::create($moduleData);
        }

        $this->command->info('Modules created successfully.');
    }
}
