<?php

namespace Database\Seeders\Shared;

use App\Models\Shared\User;
use App\Models\Shared\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create super admin user
        $superAdmin = User::create([
            'name' => 'Super Admin',
            'email' => 'super@example.com',
            'password' => Hash::make('password'),
            'user_type' => 'system_admin',
            'is_super_admin' => true,
            'status' => 'active',
            'email_verified_at' => now(),
        ]);

        // Create profile for super admin
        UserProfile::create([
            'user_id' => $superAdmin->id,
            'phone' => '123-456-7890',
            'timezone' => 'UTC',
            'locale' => 'en',
            'date_format' => 'MM/DD/YYYY',
            'time_format' => '12h',
        ]);

        // Create regular admin users
        $users = [
            [
                'name' => 'Admin User',
                'email' => 'admin@example.com',
                'password' => Hash::make('password'),
                'user_type' => 'system_admin',
                'is_super_admin' => false,
                'status' => 'active',
                'email_verified_at' => now(),
            ],
            [
                'name' => 'Support Admin',
                'email' => 'support@example.com',
                'password' => Hash::make('password'),
                'user_type' => 'system_admin',
                'is_super_admin' => false,
                'status' => 'active',
                'email_verified_at' => now(),
            ]
        ];

        foreach ($users as $userData) {
            $user = User::create($userData);

            // Create profile
            UserProfile::create([
                'user_id' => $user->id,
                'phone' => '123-456-' . rand(1000, 9999),
                'timezone' => 'UTC',
                'locale' => 'en',
                'date_format' => 'MM/DD/YYYY',
                'time_format' => '12h',
            ]);
        }

        $this->command->info('Admin users created successfully.');
    }
}
