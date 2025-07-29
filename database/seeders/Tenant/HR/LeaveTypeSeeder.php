<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Enum\LeaveTypeStatus;
use App\Tenant\HR\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $leaveTypes = [
            [
                'name'              => 'Annual Leave',
                'code'              => 'AL',
                'description'       => 'Regular annual vacation leave',
                'default_days'      => 20,
                'is_paid'           => true,
                'requires_approval' => true,
                'can_carry_forward' => true,
                'max_carry_forward_days' => 5,
                'carry_forward_expiry_months' => 3,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
            [
                'name'              => 'Sick Leave',
                'code'              => 'SL',
                'description'       => 'Medical and health-related leave',
                'default_days'      => 10,
                'is_paid'           => true,
                'requires_approval' => false,
                'can_carry_forward' => false,
                'max_carry_forward_days' => null,
                'carry_forward_expiry_months' => null,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
            [
                'name'              => 'Personal Leave',
                'code'              => 'PL',
                'description'       => 'Personal and family matters',
                'default_days'      => 5,
                'is_paid'           => true,
                'requires_approval' => true,
                'can_carry_forward' => false,
                'max_carry_forward_days' => null,
                'carry_forward_expiry_months' => null,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
            [
                'name'              => 'Maternity Leave',
                'code'              => 'ML',
                'description'       => 'Maternity and pregnancy-related leave',
                'default_days'      => 90,
                'is_paid'           => true,
                'requires_approval' => true,
                'can_carry_forward' => false,
                'max_carry_forward_days' => null,
                'carry_forward_expiry_months' => null,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
            [
                'name'              => 'Paternity Leave',
                'code'              => 'PTL',
                'description'       => 'Paternity leave for new fathers',
                'default_days'      => 14,
                'is_paid'           => true,
                'requires_approval' => true,
                'can_carry_forward' => false,
                'max_carry_forward_days' => null,
                'carry_forward_expiry_months' => null,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
            [
                'name'              => 'Unpaid Leave',
                'code'              => 'UL',
                'description'       => 'Unpaid leave for various reasons',
                'default_days'      => 30,
                'is_paid'           => false,
                'requires_approval' => true,
                'can_carry_forward' => false,
                'max_carry_forward_days' => null,
                'carry_forward_expiry_months' => null,
                'status'            => LeaveTypeStatus::ACTIVE,
            ],
        ];

        foreach ($leaveTypes as $leaveTypeData) {
            LeaveType::firstOrCreate(
                ['code' => $leaveTypeData['code']],
                $leaveTypeData
            );
        }

        $this->command->info('✓ Leave Types seeded successfully!');
    }
}
