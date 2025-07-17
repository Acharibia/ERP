<?php
namespace Database\Seeders\Tenant\Module\HR;

use App\Tenant\Modules\HR\Models\LeaveType;
use Illuminate\Database\Seeder;

class LeaveTypeSeeder extends Seeder
{
    public function run(): void
    {
        $types = [
            [
                'name'                        => 'Annual Leave',
                'code'                        => 'ANL',
                'description'                 => 'Paid time off granted to employees annually.',
                'default_days'                => 20,
                'requires_approval'           => true,
                'is_paid'                     => true,
                'can_carry_forward'           => true,
                'max_carry_forward_days'      => 5,
                'carry_forward_expiry_months' => 3,
            ],
            [
                'name'                        => 'Sick Leave',
                'code'                        => 'SCK',
                'description'                 => 'Time off granted for illness or medical appointments.',
                'default_days'                => 15,
                'requires_approval'           => false,
                'is_paid'                     => true,
                'can_carry_forward'           => false,
                'max_carry_forward_days'      => null,
                'carry_forward_expiry_months' => null,
            ],
            [
                'name'                        => 'Maternity Leave',
                'code'                        => 'MAT',
                'description'                 => 'Leave granted to female employees for childbirth and recovery.',
                'default_days'                => 90,
                'requires_approval'           => true,
                'is_paid'                     => true,
                'can_carry_forward'           => false,
                'max_carry_forward_days'      => null,
                'carry_forward_expiry_months' => null,
            ],
            [
                'name'                        => 'Paternity Leave',
                'code'                        => 'PAT',
                'description'                 => 'Leave granted to male employees after childbirth.',
                'default_days'                => 10,
                'requires_approval'           => true,
                'is_paid'                     => true,
                'can_carry_forward'           => false,
                'max_carry_forward_days'      => null,
                'carry_forward_expiry_months' => null,
            ],
            [
                'name'                        => 'Unpaid Leave',
                'code'                        => 'UPL',
                'description'                 => 'Leave without pay, granted under special circumstances.',
                'default_days'                => 0,
                'requires_approval'           => true,
                'is_paid'                     => false,
                'can_carry_forward'           => false,
                'max_carry_forward_days'      => null,
                'carry_forward_expiry_months' => null,
            ],
            [
                'name'                        => 'Compassionate Leave',
                'code'                        => 'CMP',
                'description'                 => 'Leave for attending funerals or supporting family members in critical conditions.',
                'default_days'                => 5,
                'requires_approval'           => true,
                'is_paid'                     => true,
                'can_carry_forward'           => false,
                'max_carry_forward_days'      => null,
                'carry_forward_expiry_months' => null,
            ],
        ];

        foreach ($types as $type) {
            LeaveType::updateOrCreate(
                ['code' => $type['code']],
                array_merge($type, ['status' => 'active'])
            );
        }
    }
}
