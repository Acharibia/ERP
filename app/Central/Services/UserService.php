<?php

namespace App\Central\Services;

use App\Central\Models\Tenant;
use App\Central\Models\User as CentralUser;
use App\Tenant\Models\User as TenantUser;
use App\Central\Models\Business;
use App\Support\Enums\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Stancl\Tenancy\Tenancy;

class UserService
{
    protected $tenancy;

    public function __construct(Tenancy $tenancy)
    {
        $this->tenancy = $tenancy;
    }

    /**
     * Create a new user
     *
     * @param array $userData
     * @param UserType $userType
     * @return CentralUser
     */
    public function create(array $userData, UserType $userType): CentralUser
    {
        $user = CentralUser::create([
            'name' => $userData['name'],
            'email' => $userData['email'],
            'status' => 'active',
            'password' => Hash::make($userData['password']),
            'user_type' => $userType,
        ]);

        event(new Registered($user));

        return $user;
    }

    /**
     * Create a user and sync to specified businesses
     *
     * @param array $userData
     * @param UserType $userType
     * @param array $businessIds
     * @return CentralUser
     */
    public function createAndSync(array $userData, UserType $userType, array $businessIds = []): CentralUser
    {
        try {
            // Create the user in the central database
            $user = $this->create($userData, $userType);

            // Sync user to specified businesses if any
            if (!empty($businessIds)) {
                $this->syncToBusinesses($user, $businessIds);
            }

            return $user;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * Sync a user to multiple businesses
     *
     * @param CentralUser $user
     * @param array $businessIds
     * @return void
     */
    public function syncToBusinesses(CentralUser $user, array $businessIds): void
    {
        foreach ($businessIds as $businessId) {
            $business = Business::query()->where('id', $businessId)->first();

            if (!$business) {
                throw new \Exception("Business with ID {$businessId} not found");
            }

            // Find or create tenant for the business
            $tenant = Tenant::where('business_id', $business->id)->first()
                ?? Tenant::createForBusiness($business);

            // Initialize tenant context
            tenancy()->initialize($tenant);

            try {
                // Try to find existing user first
                $existingTenantUser = TenantUser::where('email', $user->email)->first();

                // If user doesn't exist, create a new one
                if (!$existingTenantUser) {
                    TenantUser::create([
                        'name' => $user->name,
                        'email' => $user->email,
                        'password' => $user->password,
                        'user_type' => $user->user_type,
                        'status' => 'active',
                        'email_verified_at' => now(),
                        'global_id' => $user->global_id,
                    ]);
                }
            } finally {
                // Always end tenant context
                tenancy()->end();
            }

            // Attach user to tenant if not already attached
            if (!$user->tenants()->where('tenant_id', $tenant->id)->exists()) {
                $user->tenants()->attach($tenant->id);
            }
        }
    }

    /**
     * Sync a user to a specific business
     *
     * @param CentralUser $user
     * @param Business|string $business Business model or ID
     * @return void
     */
    public function syncToBusiness(CentralUser $user, $business): void
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        // Find or create tenant for the business
        $tenant = Tenant::where('business_id', $businessModel->id)->first()
            ?? Tenant::createForBusiness($businessModel);

        // Initialize tenant context
        tenancy()->initialize($tenant);

        try {
            // Try to find existing user first
            $existingTenantUser = TenantUser::where('email', $user->email)->first();

            // If user doesn't exist, create a new one
            if (!$existingTenantUser) {
                TenantUser::create([
                    'name' => $user->name,
                    'email' => $user->email,
                    'password' => $user->password,
                    'user_type' => $user->user_type,
                    'status' => 'active',
                    'email_verified_at' => now(),
                    'global_id' => $user->global_id,
                ]);
            }
        } finally {
            // Always end tenant context
            tenancy()->end();
        }

        // Attach user to tenant
        if (!$user->tenants()->where('tenant_id', $tenant->id)->exists()) {
            $user->tenants()->attach($tenant->id);
        }
    }

    /**
     * Remove a user from a business
     *
     * @param CentralUser $user
     * @param Business|string $business Business model or ID
     * @return void
     */
    public function removeFromBusiness(CentralUser $user, $business): void
    {
        $businessId = $business instanceof Business ? $business->id : $business;
        $user->tenants()->detach($businessId);
    }

    /**
     * Update a user's role within a specific business
     *
     * @param CentralUser $user
     * @param Business|string $business Business model or ID
     * @param string $roleName
     * @return bool
     */
    public function updateBusinessRole(CentralUser $user, $business, string $roleName): bool
    {
        $businessId = $business instanceof Business ? $business->id : $business;
        $business = $business instanceof Business ? $business : Business::find($businessId);

        if (!$business) {
            throw new \Exception("Business not found");
        }

        // Check if user is synced with this business
        if (!$user->tenants()->where('tenant_id', $businessId)->exists()) {
            throw new \Exception("User is not associated with this business");
        }

        // Switch to tenant context
        $this->tenancy->initialize($business);

        try {
            // Find the user in the tenant database
            $tenantUser = TenantUser::find($user->id);

            if (!$tenantUser) {
                return false;
            }

            // Update the role
            $tenantUser->syncRoles([$roleName]);

            return true;
        } finally {
            // Always return to central context
            $this->tenancy->end();
        }
    }

    /**
     * Get all businesses a user is synced with
     *
     * @param CentralUser $user
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getUserBusinesses(CentralUser $user)
    {
        return $user->tenants;
    }

    /**
     * Get user in tenant context
     *
     * @param CentralUser $user
     * @param Business|string $business Business model or ID
     * @return TenantUser|null
     */
    public function getTenantUser(CentralUser $user, $business)
    {
        $businessId = $business instanceof Business ? $business->id : $business;
        $business = $business instanceof Business ? $business : Business::find($businessId);

        if (!$business) {
            throw new \Exception("Business not found");
        }

        // Check if user is synced with this business
        if (!$user->tenants()->where('tenant_id', $businessId)->exists()) {
            return null;
        }

        // Switch to tenant context
        $this->tenancy->initialize($business);

        try {
            // Find the user in the tenant database
            return TenantUser::query()->where('id', $user->id)->first();
        } finally {
            // Always return to central context
            $this->tenancy->end();
        }
    }
}
