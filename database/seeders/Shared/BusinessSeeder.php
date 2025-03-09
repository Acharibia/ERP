<?php

namespace Database\Seeders\Shared;

use App\Models\Shared\Business;
use App\Models\Shared\Industry;
use App\Models\Shared\Module;
use App\Models\Shared\Package;
use App\Models\Shared\Reseller;
use App\Models\Shared\Subscription;
use App\Models\Shared\User;
use App\Models\Shared\UserProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class BusinessSeeder extends Seeder
{
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
                'state' => 'NY',
                'postal_code' => '10001',
                'country' => 'USA',
                'subscription_status' => 'active',
                'domain' => 'abc.example.com',
                'users' => [
                    [
                        'name' => 'ABC Admin',
                        'email' => 'admin@abccorp.com',
                        'is_admin' => true,
                    ],
                    [
                        'name' => 'ABC User',
                        'email' => 'user@abccorp.com',
                        'is_admin' => false,
                    ],
                ],
            ],
            [
                'name' => 'XYZ Industries',
                'registration_number' => 'XYZ54321',
                'email' => 'info@xyzindustries.com',
                'phone' => '987-654-3210',
                'website' => 'www.xyzindustries.com',
                'address_line_1' => '456 Manufacturing Drive',
                'city' => 'Chicago',
                'state' => 'IL',
                'postal_code' => '60601',
                'country' => 'USA',
                'subscription_status' => 'active',
                'domain' => 'xyz.example.com',
                'users' => [
                    [
                        'name' => 'XYZ Admin',
                        'email' => 'admin@xyzindustries.com',
                        'is_admin' => true,
                    ],
                    [
                        'name' => 'XYZ Manager',
                        'email' => 'manager@xyzindustries.com',
                        'is_admin' => true,
                    ],
                    [
                        'name' => 'XYZ User',
                        'email' => 'user@xyzindustries.com',
                        'is_admin' => false,
                    ],
                ],
            ],
            [
                'name' => 'Tech Innovators',
                'registration_number' => 'TECH789',
                'email' => 'info@techinnovators.com',
                'phone' => '555-123-4567',
                'website' => 'www.techinnovators.com',
                'address_line_1' => '789 Tech Park',
                'city' => 'San Francisco',
                'state' => 'CA',
                'postal_code' => '94103',
                'country' => 'USA',
                'subscription_status' => 'trial',
                'domain' => 'tech.example.com',
                'users' => [
                    [
                        'name' => 'Tech Admin',
                        'email' => 'admin@techinnovators.com',
                        'is_admin' => true,
                    ],
                    [
                        'name' => 'Tech User 1',
                        'email' => 'user1@techinnovators.com',
                        'is_admin' => false,
                    ],
                    [
                        'name' => 'Tech User 2',
                        'email' => 'user2@techinnovators.com',
                        'is_admin' => false,
                    ],
                ],
            ],
        ];

        foreach ($businesses as $index => $businessData) {
            // Extract users and domain
            $users = $businessData['users'];
            $domain = $businessData['domain'];
            unset($businessData['users'], $businessData['domain']);

            // Add additional fields
            $businessData['reseller_id'] = $resellers[$index % count($resellers)]->id;
            $businessData['industry_id'] = $industries[$index % count($industries)]->id;
            $businessData['environment'] = 'production';

            // Create business with tenant
            $business = Business::createWithTenant($businessData, $domain);

            // Create subscription
            $package = $packages[$index % count($packages)];
            $subscription = Subscription::create([
                'business_id' => $business->id,
                'package_id' => $package->id,
                'status' => $businessData['subscription_status'],
                'start_date' => now(),
                'end_date' => now()->addYear(),
                'trial_ends_at' => $businessData['subscription_status'] === 'trial' ? now()->addDays(30) : null,
                'is_auto_renew' => true,
                'billing_cycle' => 'monthly',
            ]);

            // Attach modules to business
            foreach ($package->modules as $module) {
                $business->modules()->attach($module->id, [
                    'is_active' => true,
                    'version' => $module->version,
                ]);
            }

            // Create users for the business
            foreach ($users as $userData) {
                $user = User::firstOrCreate(
                    ['email' => $userData['email']],
                    [
                        'name' => $userData['name'],
                        'password' => Hash::make('password'),
                        'user_type' => 'business_user',
                        'status' => 'active',
                        'email_verified_at' => now(),
                    ]
                );

                // Create user profile if it doesn't exist
                if (!$user->profile) {
                    UserProfile::create([
                        'user_id' => $user->id,
                        'phone' => '555-555-' . rand(1000, 9999),
                        'timezone' => 'UTC',
                        'locale' => 'en',
                        'date_format' => 'MM/DD/YYYY',
                        'time_format' => '12h',
                    ]);
                }

                // Attach user to business
                $user->businesses()->attach($business->id, [
                    'is_primary' => true,
                    'is_business_admin' => $userData['is_admin'],
                ]);
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
