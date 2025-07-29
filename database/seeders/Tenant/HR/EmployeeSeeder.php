<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\Core\Enum\RoleEnum;
use App\Tenant\Core\Models\User as TenantUser;
use App\Tenant\HR\Enum\EmploymentStatus;
use App\Tenant\HR\Enum\EmploymentType;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\EmployeeEmploymentInfo;
use App\Tenant\HR\Models\EmployeePersonalInfo;
use App\Tenant\HR\Models\Position;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;

class EmployeeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = TenantUser::whereDoesntHave('employee')->get();

        if ($users->isEmpty()) {
            $this->command->info('No users found without employee records.');
            return;
        }

        // Get default department and position
        $department = Department::where('name', 'General Administration')->first();
        $position   = Position::where('title', 'Administrator')->first();

        if (! $department || ! $position) {
            $this->command->error('Default department or position not found. Please run DepartmentSeeder and PositionSeeder first.');
            return;
        }

        // Get HR Manager role using the enum
        $role = Role::where('name', RoleEnum::ADMINISTRATOR->value)->first();

        if (! $role) {
            $this->command->error('Administrator role not found. Please run RoleSeeder first.');
            return;
        }

        foreach ($users as $user) {
            $this->createEmployeeRecord($user, $department, $position, $role);
        }

        $this->command->info("✓ Employee records created for {$users->count()} users!");
    }

    /**
     * Create employee record with personal and employment information
     */
    protected function createEmployeeRecord(TenantUser $user, Department $department, Position $position, Role $role): void
    {
        // Create employee record
        $employee = Employee::create([
            'user_id'         => $user->id,
            'employee_number' => 'EMP' . str_pad($user->id, 4, '0', STR_PAD_LEFT),
        ]);

        // Create personal information
        EmployeePersonalInfo::create([
            'employee_id'    => $employee->id,
            'name'           => $user->name,
            'birth_date'     => now()->subYears(30)->subDays(rand(1, 365)),
            'gender_id'      => rand(1, 2), // Assuming 1=Male, 2=Female
            'marital_status' => ['single', 'married', 'divorced'][rand(0, 2)],
            'nationality'    => 'US',
            'national_id'    => 'ID' . rand(100000, 999999),
            'address'        => '123 Employee Street',
            'city'           => 'New York',
            'state_id'       => 1,
            'postal_code'    => '10001',
            'country_id'     => 1,
            'work_email'     => $user->email,
            'personal_email' => 'personal.' . $user->email,
            'work_phone'     => '+1-' . rand(200, 999) . '-' . rand(100, 999) . '-' . rand(1000, 9999),
            'personal_phone' => '+1-' . rand(200, 999) . '-' . rand(100, 999) . '-' . rand(1000, 9999),
            'bio'            => 'Experienced professional with a strong background in their field.',
        ]);

        // Create employment information
        EmployeeEmploymentInfo::create([
            'employee_id'          => $employee->id,
            'department_id'        => $department->id,
            'position_id'          => $position->id,
            'hire_date'            => now()->subMonths(rand(1, 24)),
            'employment_status'    => EmploymentStatus::ACTIVE,
            'employment_type'      => EmploymentType::FULL_TIME,
            'work_location'        => 'Office',
            'probation_start_date' => now()->subMonths(rand(1, 24)),
            'probation_end_date'   => now()->subMonths(rand(1, 24))->addMonths(3),
        ]);

        // Assign HR Manager role to the user
        $user->assignRole($role);

        $this->command->info("✓ Employee record created and " . RoleEnum::ADMINISTRATOR->label() . " role assigned for: {$user->name}");
    }
}
