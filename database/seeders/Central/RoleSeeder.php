<?php
namespace Database\Seeders\Central;

use App\Central\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            [
                'name'       => 'system_admin',
                'guard_name' => 'web',
                'description' => 'System Administrator',
            ],
            [
                'name'       => 'admin',
                'guard_name' => 'web',
                'description' => 'Administrator',
            ],
            [
                'name'       => 'reseller',
                'guard_name' => 'web',
                'description' => 'Reseller',
            ],
        ];

        foreach ($roles as $roleData) {
            Role::updateOrCreate(
                ['name' => $roleData['name'], 'guard_name' => $roleData['guard_name']],
                $roleData
            );
        }

        $this->command->info('Roles created successfully.');
    }
}
