<?php

namespace Database\Seeders\Central;

use App\Central\Models\Business;
use App\Central\Models\Industry;
use App\Central\Models\Package;
use App\Central\Models\Reseller;
use App\Central\Models\User;
use App\Central\Models\UserProfile;
use App\Central\Services\SubscriptionService;
use App\Central\Services\UserService;
use App\Support\Enums\SubscriptionStatus;
use App\Support\Enums\UserType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BusinessSeeder extends Seeder
{
    /**
     * The subscription service instance.
     *
     * @var \App\Central\Services\SubscriptionService
     */
    protected $subscriptionService;

    /**
     * The user service instance.
     *
     * @var \App\Central\Services\UserService
     */
    protected $userService;

    /**
     * Create a new seeder instance.
     *
     * @param \App\Central\Services\SubscriptionService $subscriptionService
     * @param \App\Central\Services\UserService $userService
     * @return void
     */
    public function __construct(SubscriptionService $subscriptionService, UserService $userService)
    {
        $this->subscriptionService = $subscriptionService;
        $this->userService = $userService;
    }

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Get resellers to assign businesses to
        $resellers = Reseller::all();

        if ($resellers->isEmpty()) {
            $this->command->error('No resellers found. Please run ResellerSeeder first.');
            return;
        }

        // Get industries
        $industries = Industry::all();

        if ($industries->isEmpty()) {
            $this->command->error('No industries found. Please run IndustrySeeder first.');
            return;
        }

        // Get packages
        $packages = Package::all();

        if ($packages->isEmpty()) {
            $this->command->error('No packages found. Please run PackageSeeder first.');
            return;
        }

        // Create demo businesses
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
                'package_info' => [
                    'billing_cycle' => 'monthly',
                    'start_trial' => false
                ],
                'users' => [
                    [
                        'name' => 'ABC Admin',
                        'email' => 'admin@abccorp.com',
                        'password' => 'password',
                        'is_admin' => true,
                    ],
                    [
                        'name' => 'ABC User',
                        'email' => 'user@abccorp.com',
                        'password' => 'password',
                        'is_admin' => false,
                    ],
                ],
            ],
            // [
            //     'name' => 'XYZ Industries',
            //     'registration_number' => 'XYZ54321',
            //     'email' => 'info@xyzindustries.com',
            //     'phone' => '987-654-3210',
            //     'website' => 'www.xyzindustries.com',
            //     'address_line_1' => '456 Manufacturing Drive',
            //     'city' => 'Chicago',
            //     'state_id' => 1,
            //     'postal_code' => '10001',
            //     'country_id' => 1,
            //     'subscription_status' => SubscriptionStatus::ACTIVE->value,
            //     'domain' => 'xyz.example.com',
            //     'package_info' => [
            //         'billing_cycle' => 'annual',
            //         'start_trial' => false
            //     ],
            //     'users' => [
            //         [
            //             'name' => 'XYZ Admin',
            //             'email' => 'admin@xyzindustries.com',
            //             'password' => 'password',
            //             'is_admin' => true,
            //         ],
            //         [
            //             'name' => 'XYZ Manager',
            //             'email' => 'manager@xyzindustries.com',
            //             'password' => 'password',
            //             'is_admin' => true,
            //         ],
            //         [
            //             'name' => 'XYZ User',
            //             'email' => 'user@xyzindustries.com',
            //             'password' => 'password',
            //             'is_admin' => false,
            //         ],
            //     ],
            // ],
            // [
            //     'name' => 'Tech Innovators',
            //     'registration_number' => 'TECH789',
            //     'email' => 'info@techinnovators.com',
            //     'phone' => '555-123-4567',
            //     'website' => 'www.techinnovators.com',
            //     'address_line_1' => '789 Tech Park',
            //     'city' => 'San Francisco',
            //     'state_id' => 1,
            //     'postal_code' => '10001',
            //     'country_id' => 1,
            //     'subscription_status' => SubscriptionStatus::TRIAL->value,
            //     'domain' => 'tech.example.com',
            //     'package_info' => [
            //         'billing_cycle' => 'monthly',
            //         'start_trial' => true
            //     ],
            //     'users' => [
            //         [
            //             'name' => 'Tech Admin',
            //             'email' => 'admin@techinnovators.com',
            //             'password' => 'password',
            //             'is_admin' => true,
            //         ],
            //         [
            //             'name' => 'Tech User 1',
            //             'email' => 'user1@techinnovators.com',
            //             'password' => 'password',
            //             'is_admin' => false,
            //         ],
            //         [
            //             'name' => 'Tech User 2',
            //             'email' => 'user2@techinnovators.com',
            //             'password' => 'password',
            //             'is_admin' => false,
            //         ],
            //     ],
            // ],
        ];

        foreach ($businesses as $index => $businessData) {
            // Extract users, domain, and package info
            $users = $businessData['users'];
            $domain = $businessData['domain'];
            $packageInfo = $businessData['package_info'];
            unset($businessData['users'], $businessData['domain'], $businessData['package_info']);

            // Add additional fields
            $businessData['reseller_id'] = $resellers[$index % count($resellers)]->id;
            $businessData['industry_id'] = $industries[$index % count($industries)]->id;
            $businessData['environment'] = 'production';

            // Create business with tenant
            $business = Business::createWithTenant($businessData, $domain);

            // Select a package for this business
            $package = $packages[$index % count($packages)];

            // Create subscription using the service
            $this->subscriptionService->create(
                $business,
                $package->id,
                $packageInfo['billing_cycle'] ?? 'monthly',
                $packageInfo['start_trial'] ?? false
            );

            // Create users for the business
            foreach ($users as $userData) {
                // Check if user already exists
                $existingUser = User::where('email', $userData['email'])->first();

                if ($existingUser) {
                    // User exists, sync with business
                    $this->userService->syncToBusiness($existingUser, $business);

                    // Find or create the user_businesses record
                    $userBusiness = $existingUser->userBusinesses()
                        ->firstOrNew([
                            'business_id' => $business->id,
                        ]);

                    // Update the record
                    $userBusiness->is_primary = true;
                    $userBusiness->is_business_admin = $userData['is_admin'];
                    $userBusiness->save();

                    // Switch to tenant context to set roles if needed
                    if ($userData['is_admin']) {
                        // $this->userService->updateBusinessRole($existingUser, $business, 'business_admin');
                    }
                } else {
                    // Create new user and sync to business
                    $userCreationData = [
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                        'password' => $userData['password'],
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ];

                    $user = $this->userService->createAndSync(
                        $userCreationData,
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

                    // Create user_businesses record
                    $user->userBusinesses()->create([
                        'business_id' => $business->id,
                        'is_primary' => true,
                        'is_business_admin' => $userData['is_admin'],
                    ]);

                    // Set role in tenant database
                    if ($userData['is_admin']) {
                        // $this->userService->updateBusinessRole($user, $business, 'business_admin');
                    }
                }
            }

            // Run tenant migrations if necessary
            if ($business->tenant) {
                $business->tenant->run(function () {
                    // Tenant-specific migrations or seeders could be run here
                    // For example, seeding tenant permissions
                    // $this->call(TenantPermissionSeeder::class);
                });
            }
        }

        $this->command->info('Businesses created successfully.');
    }
}
