<?php
namespace Database\Seeders\Tenant\Core;

use App\Tenant\Core\Enum\PermissionEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        foreach (PermissionEnum::cases() as $permission) {
            Permission::firstOrCreate(
                ['name' => $permission->value, 'guard_name' => 'web'],
                [
                    'name'        => $permission->value,
                    'guard_name'  => 'web',
                    'module'      => $permission->module(),
                    'description' => $permission->description(),
                ]
            );
        }

        $this->command->info('✓ Core permissions seeded successfully!');
    }

    /**
     * Get all permissions as an array
     */
    public static function getAllPermissions(): array
    {
        return array_column(PermissionEnum::cases(), 'value');
    }

    /**
     * Get permissions grouped by category
     */
    public static function getGroupedPermissions(): array
    {
        return [
            'Module Access'   => [
                PermissionEnum::CORE_ACCESS->value,
                PermissionEnum::HR_ACCESS->value,
                PermissionEnum::INVENTORY_ACCESS->value,
                PermissionEnum::CRM_ACCESS->value,
                PermissionEnum::FINANCE_ACCESS->value,
            ],
            'User Management' => [
                PermissionEnum::CORE_VIEW_USERS->value,
                PermissionEnum::CORE_CREATE_USER->value,
                PermissionEnum::CORE_EDIT_USER->value,
                PermissionEnum::CORE_DELETE_USER->value,
                PermissionEnum::CORE_INVITE_USER->value,
                PermissionEnum::CORE_MANAGE_USER_PERMISSIONS->value,
            ],
            'Role Management' => [
                PermissionEnum::CORE_VIEW_ROLES->value,
                PermissionEnum::CORE_CREATE_ROLE->value,
                PermissionEnum::CORE_EDIT_ROLE->value,
                PermissionEnum::CORE_DELETE_ROLE->value,
                PermissionEnum::CORE_ASSIGN_ROLE->value,
            ],
        ];
    }

    /**
     * Get permissions for a specific category
     */
    public static function getPermissionsForCategory(string $category): array
    {
        return self::getGroupedPermissions()[$category] ?? [];
    }
}
