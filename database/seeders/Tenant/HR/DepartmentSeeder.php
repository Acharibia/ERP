<?php

namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Enum\DepartmentStatus;
use Illuminate\Database\Seeder;

class DepartmentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = [
            [
                'name' => 'Human Resources',
                'email' => 'hr@company.com',
                'code' => 'HR',
                'description' => 'Human Resources department responsible for employee management, recruitment, and HR policies.',
                'status' => DepartmentStatus::ACTIVE,
            ],
            [
                'name' => 'General Administration',
                'email' => 'admin@company.com',
                'code' => 'GA',
                'description' => 'General administration and management department.',
                'status' => DepartmentStatus::ACTIVE,
            ],
        ];

        foreach ($departments as $departmentData) {
            Department::firstOrCreate(
                ['name' => $departmentData['name']],
                $departmentData
            );
        }

        $this->command->info('✓ Departments seeded successfully!');
    }
}
