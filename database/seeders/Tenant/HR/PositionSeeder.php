<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Enum\EmploymentType;
use App\Tenant\HR\Enum\PositionLevel;
use App\Tenant\HR\Enum\PositionStatus;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Position;
use Illuminate\Database\Seeder;

class PositionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $positions = [
            // Human Resources Positions
            [
                'title'           => 'HR Manager',
                'code'            => 'HR-MGR',
                'description'     => 'Manages HR operations, policies, and employee relations.',
                'department_name' => 'Human Resources',
                'employment_type' => EmploymentType::FULL_TIME,
                'position_level'  => PositionLevel::SENIOR,
                'min_salary'      => 60000,
                'max_salary'      => 80000,
            ],
            [
                'title'           => 'HR Specialist',
                'code'            => 'HR-SPEC',
                'description'     => 'Handles recruitment, benefits, and HR administration.',
                'department_name' => 'Human Resources',
                'employment_type' => EmploymentType::FULL_TIME,
                'position_level'  => PositionLevel::MID,
                'min_salary'      => 45000,
                'max_salary'      => 60000,
            ],
            [
                'title'           => 'Recruiter',
                'code'            => 'HR-REC',
                'description'     => 'Responsible for talent acquisition and recruitment processes.',
                'department_name' => 'Human Resources',
                'employment_type' => EmploymentType::FULL_TIME,
                'position_level'  => PositionLevel::MID,
                'min_salary'      => 40000,
                'max_salary'      => 55000,
            ],

            // General Administration Positions
            [
                'title'           => 'Administrator',
                'code'            => 'ADMIN',
                'description'     => 'General administrative and management position.',
                'department_name' => 'General Administration',
                'employment_type' => EmploymentType::FULL_TIME,
                'position_level'  => PositionLevel::MID,
                'min_salary'      => 45000,
                'max_salary'      => 60000,
            ],
            [
                'title'           => 'Executive Assistant',
                'code'            => 'EXEC-ASSIST',
                'description'     => 'Provides administrative support to executives.',
                'department_name' => 'General Administration',
                'employment_type' => EmploymentType::FULL_TIME,
                'position_level'  => PositionLevel::MID,
                'min_salary'      => 40000,
                'max_salary'      => 55000,
            ],
        ];

        foreach ($positions as $positionData) {
            $department = Department::where('name', $positionData['department_name'])->first();

            if ($department) {
                Position::firstOrCreate(
                    ['title' => $positionData['title'], 'department_id' => $department->id],
                    [
                        'code'            => $positionData['code'],
                        'description'     => $positionData['description'],
                        'department_id'   => $department->id,
                        'employment_type' => $positionData['employment_type'],
                        'position_level'  => $positionData['position_level'],
                        'min_salary'      => $positionData['min_salary'],
                        'max_salary'      => $positionData['max_salary'],
                        'status'          => PositionStatus::ACTIVE,
                    ]
                );
            }
        }

        $this->command->info('✓ Positions seeded successfully!');
    }
}
