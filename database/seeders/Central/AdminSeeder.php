<?php
namespace Database\Seeders\Central;

use App\Central\Models\User;
use Illuminate\Database\Seeder;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create system admin user
        $superAdminData = [
            'name'              => 'Super Admin',
            'email'             => 'super@example.com',
            'password'          => bcrypt('password'),
            'status'            => 'active',
            'email_verified_at' => now(),
        ];
        $superAdmin = User::firstOrCreate(
            ['email' => $superAdminData['email']],
            $superAdminData
        );
        $superAdmin->assignRole('system_admin');

        // Create regular admin users
        $users = [
            [
                'name'              => 'Admin User',
                'email'             => 'admin@example.com',
                'password'          => bcrypt('password'),
                'status'            => 'active',
                'email_verified_at' => now(),
            ],
            [
                'name'              => 'Support Admin',
                'email'             => 'support@example.com',
                'password'          => bcrypt('password'),
                'status'            => 'active',
                'email_verified_at' => now(),
            ],
        ];
        foreach ($users as $userData) {
            $user = User::firstOrCreate(
                ['email' => $userData['email']],
                $userData
            );
            $user->assignRole('admin');
        }
        $this->command->info('Admin users created successfully.');
    }
}
