<?php

namespace Database\Seeders\Shared;

use App\Shared\Models\Reseller;
use App\Shared\Models\User;
use App\Shared\Models\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class ResellerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create demo resellers
        $resellers = [
            [
                'company_name' => 'Acme Solutions',
                'contact_name' => 'John Smith',
                'email' => 'contact@acmesolutions.com',
                'phone' => '123-456-7890',
                'address' => '123 Main St',
                'city' => 'New York',
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
                'status' => 'active',
                'verification_status' => 'verified',
                'commission_rate' => 10.00,
            ],
            [
                'company_name' => 'Tech Partners',
                'contact_name' => 'Jane Doe',
                'email' => 'contact@techpartners.com',
                'phone' => '987-654-3210',
                'address' => '456 Oak Avenue',
                'city' => 'San Francisco',
                'state' => 'CA',
                'postal_code' => '94103',
                'country' => 'USA',
                'status' => 'active',
                'verification_status' => 'verified',
                'commission_rate' => 12.50,
            ],
            [
                'company_name' => 'Global Systems',
                'contact_name' => 'David Johnson',
                'email' => 'contact@globalsystems.com',
                'phone' => '555-123-4567',
                'address' => '789 Pine Road',
                'city' => 'Chicago',
                'state' => 'IL',
                'postal_code' => '60601',
                'country' => 'USA',
                'status' => 'active',
                'verification_status' => 'verified',
                'commission_rate' => 15.00,
            ],
        ];

        foreach ($resellers as $resellerData) {
            $reseller = Reseller::create($resellerData);

            // Create reseller admin user
            $email = 'admin@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com';
            $user = User::create([
                'name' => $reseller->contact_name,
                'email' => $email,
                'password' => Hash::make('password'),
                'user_type' => 'reseller',
                'reseller_id' => $reseller->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            // Create profile for reseller user
            UserProfile::create([
                'user_id' => $user->id,
                'phone' => $reseller->phone,
                'timezone' => 'UTC',
                'locale' => 'en',
                'date_format' => 'MM/DD/YYYY',
                'time_format' => '12h',
            ]);

            // Create additional reseller staff users
            $staffUser = User::create([
                'name' => 'Staff at ' . $reseller->company_name,
                'email' => 'staff@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com',
                'password' => Hash::make('password'),
                'user_type' => 'reseller',
                'reseller_id' => $reseller->id,
                'status' => 'active',
                'email_verified_at' => now(),
            ]);

            // Create profile for staff user
            UserProfile::create([
                'user_id' => $staffUser->id,
                'phone' => '555-555-' . rand(1000, 9999),
                'timezone' => 'UTC',
                'locale' => 'en',
                'date_format' => 'MM/DD/YYYY',
                'time_format' => '12h',
            ]);
        }

        $this->command->info('Resellers created successfully.');
    }
}
