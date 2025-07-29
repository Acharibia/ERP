<?php

namespace Database\Seeders\Central;

use App\Central\Models\Reseller;
use App\Central\Models\User;
use Illuminate\Database\Seeder;

class ResellerSeeder extends Seeder
{
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
            // other resellers...
        ];

        foreach ($resellers as $resellerData) {
            $reseller = Reseller::updateOrCreate(
                ['email' => $resellerData['email']],
                $resellerData
            );

            // Create reseller admin user
            $email = 'admin@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com';
            $adminUser = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => $reseller->contact_name,
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            $adminUser->assignRole('reseller');

            // Staff email
            $staffEmail = 'staff@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com';
            $staffUser = User::firstOrCreate(
                ['email' => $staffEmail],
                [
                    'name' => 'Staff at ' . $reseller->company_name,
                    'password' => bcrypt('password'),
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]
            );
            $staffUser->assignRole('reseller');
        }

        $this->command->info('Resellers created successfully.');
    }
}
