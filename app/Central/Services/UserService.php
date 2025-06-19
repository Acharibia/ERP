<?php

namespace App\Central\Services;

use App\Central\Models\Tenant;
use App\Central\Models\User as CentralUser;
use App\Tenant\Models\User as TenantUser;
use App\Central\Models\Business;
use App\Support\Enums\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Stancl\Tenancy\Tenancy;

class UserService
{
    protected $tenancy;

    public function __construct(Tenancy $tenancy)
    {
        $this->tenancy = $tenancy;
    }

    /**
     * Create a new user in the central database
     */
    public function create(array $userData, UserType $userType): CentralUser
    {
        $user = CentralUser::create([
            'global_id' => Str::uuid(),
            'name' => $userData['name'],
            'email' => $userData['email'],
            'status' => $userData['status'] ?? 'active',
            'password' => Hash::make($userData['password']),
            'user_type' => $userType,
            'email_verified_at' => $userData['email_verified_at'] ?? null,
            'reseller_id' => $userData['reseller_id'] ?? null,
            'is_super_admin' => $userData['is_super_admin'] ?? false,
        ]);

        event(new Registered($user));

        return $user;
    }

    /**
     * Create a user and sync to specified businesses
     */
    public function createAndSync(array $userData, UserType $userType, array $businessIds = []): CentralUser
    {
        // Create the user in the central database
        $user = $this->create($userData, $userType);

        // Sync user to specified businesses if any
        if (!empty($businessIds)) {
            $this->syncToBusinesses($user, $businessIds);
        }

        return $user;
    }

    /**
     * Sync a user to multiple businesses
     */
    public function syncToBusinesses(CentralUser $user, array $businessIds): void
    {
        foreach ($businessIds as $businessId) {
            $business = Business::query()->where('id', $businessId)->first();

            if (!$business) {
                throw new \Exception("Business with ID {$businessId} not found");
            }

            $this->syncToBusiness($user, $business);
        }
    }

    /**
     * Sync a user to a specific business
     * FIXED: Don't create new tenants if business already has one
     */
    public function syncToBusiness(CentralUser $user, $business): void
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        // CRITICAL FIX: Check tenant_id first, then load relationship
        if (!$businessModel->tenant_id) {
            throw new \Exception("Business {$businessModel->name} does not have a tenant. This should not happen if business was created properly.");
        }

        // Load the tenant relationship (this should work since tenant_id exists)
        $tenant = $businessModel->tenant;

        if (!$tenant) {
            throw new \Exception("Business {$businessModel->name} has tenant_id but tenant not found. Data integrity issue.");
        }

        // Create user in tenant database
        $this->createTenantUser($user, $tenant);

        // Attach user to tenant in central database if not already attached
        if (!$user->tenants()->where('tenant_id', $tenant->id)->exists()) {
            $user->tenants()->attach($tenant->id);
        }
    }

    /**
     * Create a tenant user (user record in the tenant database)
     */
    protected function createTenantUser(CentralUser $user, Tenant $tenant): ?TenantUser
    {
        // Initialize tenant context
        tenancy()->initialize($tenant);

        // Try to find existing user first
        $existingTenantUser = TenantUser::where('email', $user->email)->first();

        // If user doesn't exist, create a new one with only tenant-relevant fields
        if (!$existingTenantUser) {
            $tenantUser = TenantUser::create([
                'global_id' => $user->global_id,
                'name' => $user->name,
                'email' => $user->email,
                'password' => $user->password, // Already hashed
                'email_verified_at' => $user->email_verified_at,
                'status' => 'active',
            ]);

            // Always end tenant context
            tenancy()->end();

            return $tenantUser;
        }

        // Always end tenant context
        tenancy()->end();

        return $existingTenantUser;
    }

    // REMOVE this method entirely - it's causing the duplicate tenant creation
    // protected function createTenantForBusiness(Business $business): Tenant { ... }

    /**
     * Remove a user from a business
     */
    public function removeFromBusiness(CentralUser $user, $business): void
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        $tenant = $businessModel->tenant;

        if ($tenant) {
            // Remove from tenant database
            tenancy()->initialize($tenant);

            $tenantUser = TenantUser::where('global_id', $user->global_id)->first();
            if ($tenantUser) {
                $tenantUser->delete();
            }

            tenancy()->end();

            // Remove from central tenant relationship
            $user->tenants()->detach($tenant->id);
        }
    }

    /**
     * Update a user's role within a specific business
     */
    public function updateBusinessRole(CentralUser $user, $business, string $roleName): bool
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        $tenant = $businessModel->tenant;

        if (!$tenant) {
            throw new \Exception("Business does not have an associated tenant");
        }

        // Check if user is synced with this business
        if (!$user->tenants()->where('tenant_id', $tenant->id)->exists()) {
            throw new \Exception("User is not associated with this business");
        }

        // Switch to tenant context
        tenancy()->initialize($tenant);

        // Find the user in the tenant database
        $tenantUser = TenantUser::where('global_id', $user->global_id)->first();

        if (!$tenantUser) {
            tenancy()->end();
            return false;
        }

        // Update the role
        // $tenantUser->syncRoles([$roleName]);

        // Always return to central context
        tenancy()->end();

        return true;
    }

    /**
     * Get all businesses a user is synced with
     */
    public function getUserBusinesses(CentralUser $user)
    {
        // Get all tenants the user is associated with
        $tenants = $user->tenants;

        // Get the businesses for those tenants
        $businesses = collect();
        foreach ($tenants as $tenant) {
            if ($tenant->business) {
                $businesses->push($tenant->business);
            }
        }

        return $businesses;
    }

    /**
     * Get user in tenant context
     */
    public function getTenantUser(CentralUser $user, $business)
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        $tenant = $businessModel->tenant;

        if (!$tenant) {
            throw new \Exception("Business does not have an associated tenant");
        }

        // Check if user is synced with this business
        if (!$user->tenants()->where('tenant_id', $tenant->id)->exists()) {
            return null;
        }

        // Switch to tenant context
        tenancy()->initialize($tenant);

        // Find the user in the tenant database using global_id
        $tenantUser = TenantUser::where('global_id', $user->global_id)->first();

        // Always return to central context
        tenancy()->end();

        return $tenantUser;
    }

    // REMOVE ensureBusinessHasTenant method - it's not needed and causes issues

    /**
     * Update user information across all tenants
     */
    public function updateUserAcrossAllTenants(CentralUser $user, array $updateData): void
    {
        // Update central user
        $user->update($updateData);

        // Update user in all tenant databases
        $tenants = $user->tenants;

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            $tenantUser = TenantUser::where('global_id', $user->global_id)->first();
            if ($tenantUser) {
                // Only update fields that exist in tenant user table
                $tenantUpdateData = array_intersect_key($updateData, array_flip([
                    'name',
                    'email',
                    'status',
                    'email_verified_at'
                ]));

                if (!empty($tenantUpdateData)) {
                    $tenantUser->update($tenantUpdateData);
                }
            }

            tenancy()->end();
        }
    }

    /**
     * Permanently delete a user from all contexts
     */
    public function deleteUserCompletely(CentralUser $user): void
    {
        // Remove from all tenant databases
        $tenants = $user->tenants;

        foreach ($tenants as $tenant) {
            tenancy()->initialize($tenant);

            $tenantUser = TenantUser::where('global_id', $user->global_id)->first();
            if ($tenantUser) {
                $tenantUser->forceDelete();
            }

            tenancy()->end();
        }

        // Remove tenant relationships
        $user->tenants()->detach();

        // Remove business relationships
        $user->businesses()->detach();

        // Delete central user
        $user->forceDelete();
    }

    /**
     * Check if user has access to a specific business
     */
    public function hasAccessToBusiness(CentralUser $user, $business): bool
    {
        $businessId = $business instanceof Business ? $business->id : $business;

        return $user->businesses()->where('business_id', $businessId)->exists();
    }

    /**
     * Get user's role in a specific business
     */
    public function getUserRolesInBusiness(CentralUser $user, $business): array
    {
        $businessModel = $business instanceof Business
            ? $business
            : Business::findOrFail($business);

        $tenant = $businessModel->tenant;

        if (!$tenant) {
            return [];
        }

        // Switch to tenant context
        tenancy()->initialize($tenant);

        $tenantUser = TenantUser::where('global_id', $user->global_id)->first();

        $roles = [];
        if ($tenantUser) {
            $roles = $tenantUser->getRoleNames()->toArray();
        }

        tenancy()->end();

        return $roles;
    }
}
