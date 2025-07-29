<?php

namespace Database\Seeders\Tenant\Core;

use App\Tenant\Core\Enum\RoleEnum;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Core roles using the enum
        foreach (RoleEnum::cases() as $role) {
            Role::firstOrCreate(
                ['name' => $role->value, 'guard_name' => 'web'],
                [
                    'name' => $role->value,
                    'guard_name' => 'web',
                    'module' => $role->module(),
                    'protected' => $role->isProtected(),
                    'description' => $role->description(),
                ]
            );
        }

        $this->command->info('✓ Core Roles seeded successfully!');
    }

    /**
     * Get all roles as an array
     */
    public static function getAllRoles(): array
    {
        return array_column(RoleEnum::cases(), 'value');
    }

    /**
     * Get roles with their details
     */
    public static function getRolesWithDetails(): array
    {
        $roles = [];
        foreach (RoleEnum::cases() as $role) {
            $roles[] = [
                'name' => $role->value,
                'label' => $role->label(),
                'description' => $role->description(),
                'module' => $role->module(),
                'protected' => $role->isProtected(),
            ];
        }
        return $roles;
    }

    /**
     * Get a specific role by name
     */
    public static function getRoleByName(string $name): ?RoleEnum
    {
        foreach (RoleEnum::cases() as $role) {
            if ($role->value === $name) {
                return $role;
            }
        }
        return null;
    }
}
