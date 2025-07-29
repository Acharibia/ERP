<?php
namespace Database\Seeders\Central;

use App\Central\Enums\SubscriptionStatus;
use App\Central\Models\Business;
use App\Central\Models\Industry;
use App\Central\Models\Package;
use App\Central\Models\Reseller;
use App\Central\Models\User;
use App\Central\Services\SubscriptionService;
use Illuminate\Database\Seeder;

class BusinessSeeder extends Seeder
{
    protected $subscriptionService;

    public function __construct(SubscriptionService $subscriptionService)
    {
        $this->subscriptionService = $subscriptionService;
    }

    public function run(): void
    {
        // Get required data
        $resellers  = Reseller::all();
        $industries = Industry::all();
        $packages   = Package::all();

        // Demo businesses
        $businesses = [
            [
                'name'                => 'ABC Corporation',
                'registration_number' => 'ABC12345',
                'email'               => 'info@abccorp.com',
                'phone'               => '123-456-7890',
                'website'             => 'www.abccorp.com',
                'address_line_1'      => '123 Business Avenue',
                'city'                => 'New York',
                'state_id'            => 1,
                'postal_code'         => '10001',
                'country_id'          => 1,
                'subscription_status' => SubscriptionStatus::ACTIVE->value,
                'domain'              => 'abc.example.com',
                'package_info'        => ['billing_cycle' => 'monthly'],
                'users'               => [
                    ['name' => 'ABC Admin', 'email' => 'admin@abccorp.com', 'password' => 'password'],
                ],
            ],
        ];

        foreach ($businesses as $index => $businessData) {
            $this->command->info("Creating business: {$businessData['name']}");

            // Extract data
            $users       = $businessData['users'];
            $domain      = $businessData['domain'];
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
                $user = User::createInCentralAndTenant($userData, $business);
                $user->businesses()->syncWithoutDetaching([$business->id]);
                $this->command->info("✓ User created: {$user->email}");
            }

            $this->command->info("✓ Business setup completed: {$business->name}\n");
        }

        $this->command->info('All businesses created successfully!');
    }
}
