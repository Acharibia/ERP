<?php

namespace Database\Seeders\Central;

use App\Central\Models\Reseller;
use App\Central\Models\UserProfile;
use App\Central\Services\UserService;
use App\Support\Enums\UserType;
use Illuminate\Database\Seeder;

class ResellerSeeder extends Seeder
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
            // Use updateOrCreate instead of create
            $reseller = Reseller::updateOrCreate(
                ['email' => $resellerData['email']], // Unique identifier
                $resellerData
            );

            // Create reseller admin user
            $email = 'admin@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com';

            // Check if user already exists
            $adminUser = \App\Central\Models\User::where('email', $email)->first();

            if (!$adminUser) {
                // Create the admin user using UserService
                $adminUser = $this->userService->create([
                    'name' => $reseller->contact_name,
                    'email' => $email,
                    'password' => 'password',
                    'status' => 'active',
                    'reseller_id' => $reseller->id,
                    'email_verified_at' => now(),
                ], UserType::RESELLER);

                // Create profile for reseller user
                UserProfile::create([
                    'user_id' => $adminUser->id,
                    'phone' => $reseller->phone,
                    'timezone' => 'UTC',
                    'locale' => 'en',
                    'date_format' => 'MM/DD/YYYY',
                    'time_format' => '12h',
                ]);
            }

            // Staff email
            $staffEmail = 'staff@' . strtolower(str_replace(' ', '', $reseller->company_name)) . '.com';

            // Check if staff user already exists
            $staffUser = \App\Central\Models\User::where('email', $staffEmail)->first();

            if (!$staffUser) {
                // Create additional reseller staff users using UserService
                $staffUser = $this->userService->create([
                    'name' => 'Staff at ' . $reseller->company_name,
                    'email' => $staffEmail,
                    'password' => 'password',
                    'status' => 'active',
                    'reseller_id' => $reseller->id,
                    'email_verified_at' => now(),
                ], UserType::RESELLER);

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
        }

        $this->command->info('Resellers created successfully.');
    }
}
