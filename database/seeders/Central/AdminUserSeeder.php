<?php

namespace Database\Seeders\Central;

use App\Central\Models\User;
use App\Central\Models\UserProfile;
use App\Central\Services\UserService;
use App\Central\Enums\UserType;
use Illuminate\Database\Seeder;

class AdminUserSeeder extends Seeder
{
    /**
     * The user service instance.
     *
     * @var UserService
     */
    protected $userService;

    /**
     * Create a new seeder instance.
     *
     * @param UserService $userService
     * @return void
     */
    public function __construct(UserService $userService)
    {
        $this->userService = $userService;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin user
        $superAdminData = [
            'name' => 'Super Admin',
            'email' => 'super@example.com',
            'password' => 'password',
            'is_super_admin' => true,
            'status' => 'active',
            'email_verified_at' => now(),
        ];

        // Check if user exists first
        $superAdmin = User::where('email', $superAdminData['email'])->first();

        if (!$superAdmin) {
            $superAdmin = $this->userService->create($superAdminData, UserType::SYSTEM_ADMIN);
        } else {
            // Update existing user without using profile_photo_path
            $superAdmin->update([
                'name' => $superAdminData['name'],
                'is_super_admin' => $superAdminData['is_super_admin'],
                'status' => $superAdminData['status']
            ]);
        }

        // Create profile for super admin if it doesn't exist
        if (!$superAdmin->profile) {
            UserProfile::create([
                'user_id' => $superAdmin->id,
                'phone' => '123-456-7890',
                'timezone' => 'UTC',
                'locale' => 'en',
                'date_format' => 'MM/DD/YYYY',
                'time_format' => '12h',
            ]);
        }

        // Create regular admin users
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => 'password',
                'is_super_admin' => false,
                'status' => 'active',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Support Admin',
                'email' => 'support@example.com',
                'password' => 'password',
                'is_super_admin' => false,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        ];

        foreach ($users as $userData) {
            // Check if user exists first
            $user = User::where('email', $userData['email'])->first();

            if (!$user) {
                $user = $this->userService->create($userData, UserType::SYSTEM_ADMIN);
            } else {
                // Update existing user without using profile_photo_path
                $user->update([
                    'name' => $userData['name'],
                    'is_super_admin' => $userData['is_super_admin'],
                    'status' => $userData['status']
                ]);
            }

            // Create profile if it doesn't exist
            if (!$user->profile) {
                UserProfile::create([
                    'user_id' => $user->id,
                    'phone' => '123-456-' . rand(1000, 9999),
                    'timezone' => 'UTC',
                    'locale' => 'en',
                    'date_format' => 'MM/DD/YYYY',
                    'time_format' => '12h',
                ]);
            }
        }

        $this->command->info('Admin users created successfully.');
    }
}
