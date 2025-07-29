<?php
namespace Database\Seeders\Tenant\HR;

use App\Tenant\HR\Enum\PermissionEnum;
use App\Tenant\HR\Enum\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $hrManager = Role::where('name', RoleEnum::HR_MANAGER->value)->first();
        if ($hrManager) {
            $hrManager->givePermissionTo(PermissionEnum::all());
            $this->command->info("✓ Assigned all HR permissions to " . RoleEnum::HR_MANAGER->value);
        }

        $hrSupport = Role::where('name', RoleEnum::HR_SUPPORT->value)->first();
        if ($hrSupport) {
            $limitedPermissions = [
                PermissionEnum::HR_VIEW_EMPLOYEE->value,
                PermissionEnum::HR_CREATE_EMPLOYEE->value,
                PermissionEnum::HR_EDIT_EMPLOYEE->value,
                PermissionEnum::HR_DELETE_EMPLOYEE->value,
                PermissionEnum::HR_VIEW_DEPARTMENT->value,
                PermissionEnum::HR_VIEW_POSITION->value,
                PermissionEnum::HR_VIEW_LEAVE->value,
                PermissionEnum::HR_CREATE_LEAVE->value,
                PermissionEnum::HR_EDIT_LEAVE->value,
                PermissionEnum::HR_DELETE_LEAVE->value,
                PermissionEnum::HR_APPROVE_LEAVE->value,
                PermissionEnum::HR_VIEW_ATTENDANCE->value,
                PermissionEnum::HR_CREATE_ATTENDANCE->value,
                PermissionEnum::HR_EDIT_ATTENDANCE->value,
                PermissionEnum::HR_DELETE_ATTENDANCE->value,
                PermissionEnum::HR_VIEW_ACCESS->value,
                PermissionEnum::HR_EDIT_ACCESS->value,
                PermissionEnum::HR_VIEW_ROLE->value,
                PermissionEnum::HR_CREATE_ROLE->value,
                PermissionEnum::HR_EDIT_ROLE->value,
                PermissionEnum::HR_DELETE_ROLE->value,
            ];

            $hrSupport->givePermissionTo($limitedPermissions);
            $this->command->info("✓ Assigned limited HR permissions to " . RoleEnum::HR_SUPPORT->value);
        }

        $this->command->info('✓ HR Role Permissions seeded successfully!');
    }
}
