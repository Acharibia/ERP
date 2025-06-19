<?php

namespace Database\Seeders\Central;

use App\Central\Models\Business;
use App\Central\Models\Industry;
use App\Central\Models\Package;
use App\Central\Models\Reseller;
use App\Central\Models\UserProfile;
use App\Central\Services\SubscriptionService;
use App\Central\Services\UserService;
use App\Support\Enums\SubscriptionStatus;
use App\Support\Enums\UserType;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    protected $subscriptionService;
    protected $userService;

    public function __construct(SubscriptionService $subscriptionService, UserService $userService)
    {
        $this->subscriptionService = $subscriptionService;
        $this->userService = $userService;
    }

    public function run(): void
    {
        // Get required data
        $resellers = Reseller::all();
        $industries = Industry::all();
        $packages = Package::all();

        // Demo businesses
        $businesses = [
            [
                'name' => 'ABC Corporation',
                'registration_number' => 'ABC12345',
                'email' => 'info@abccorp.com',
                'phone' => '123-456-7890',
                'website' => 'www.abccorp.com',
                'address_line_1' => '123 Business Avenue',
                'city' => 'New York',
                'state_id' => 1,
                'postal_code' => '10001',
                'country_id' => 1,
                'subscription_status' => SubscriptionStatus::ACTIVE->value,
                'domain' => 'abc.example.com',
                'package_info' => ['billing_cycle' => 'monthly'],
                'users' => [
                    ['name' => 'ABC Admin', 'email' => 'admin@abccorp.com', 'password' => 'password', 'is_admin' => true],
                    ['name' => 'ABC User', 'email' => 'user@abccorp.com', 'password' => 'password', 'is_admin' => false],
                ],
            ],
        ];

        foreach ($businesses as $index => $businessData) {
            $this->command->info("Creating business: {$businessData['name']}");

            // Extract data
            $users = $businessData['users'];
            $domain = $businessData['domain'];
            $packageInfo = $businessData['package_info'];
            unset($businessData['users'], $businessData['domain'], $businessData['package_info']);

            // Add required IDs
            $businessData['reseller_id'] = $resellers[$index % count($resellers)]->id;
            $businessData['industry_id'] = $industries[$index % count($industries)]->id;
            $businessData['environment'] = 'production';

            // Create business with tenant
            $business = Business::createWithTenant($businessData, $domain);
            $this->command->info("✓ Business and tenant created");

            // Create subscription
            $package = $packages[$index % count($packages)];
            $this->subscriptionService->create(
                $business,
                $package->id,
                $packageInfo['billing_cycle'] ?? 'monthly'
            );
            $this->command->info("✓ Subscription created");

            // Create users
            foreach ($users as $userData) {
                // Create user
                $user = $this->userService->createAndSync(
                    [
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                        'password' => $userData['password'],
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ],
                    UserType::BUSINESS_USER,
                    [$business->id]
                );

                // Create user profile
                UserProfile::create([
                    'user_id' => $user->id,
                    'phone' => '555-555-' . rand(1000, 9999),
                    'timezone' => 'UTC',
                    'locale' => 'en',
                    'date_format' => 'MM/DD/YYYY',
                    'time_format' => '12h',
                ]);

                // Link to business
                $user->businesses()->attach($business->id, [
                    'is_primary' => true,
                    'is_business_admin' => $userData['is_admin'],
                ]);

                // Set admin role if needed
                if ($userData['is_admin']) {
                    $this->userService->updateBusinessRole($user, $business, 'business_admin');
                }

                $this->command->info("✓ User created: {$user->email}");
            }

            $this->command->info("✓ Business setup completed: {$business->name}\n");
        }

        $this->command->info('All businesses created successfully!');
    }
}
