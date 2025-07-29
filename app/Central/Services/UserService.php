<?php
namespace App\Central\Services;

use App\Central\Enums\UserType;
use App\Central\Models\Business;
use App\Central\Models\Tenant;
use App\Central\Models\User as CentralUser;
use App\Tenant\Core\Models\User as TenantUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserService
{
    /**
     * Create a new user in the central database
     */
    public function create(array $userData, UserType $userType): CentralUser
    {
        $user = CentralUser::create([
            'global_id'         => Str::uuid(),
            'name'              => $userData['name'],
            'email'             => $userData['email'],
            'status'            => $userData['status'] ?? 'active',
            'password'          => Hash::make($userData['password']),
            'email_verified_at' => $userData['email_verified_at'] ?? null,
        ]);

        event(new Registered($user));

        return $user;
    }

    /**
     * Create a user and sync to specified businesses
     */
    public function createAndSync(array $userData, UserType $userType, array $businessIds = []): CentralUser
    {
        $user = $this->create($userData, $userType);

        if (! empty($businessIds)) {
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
            $business = Business::findOrFail($businessId);
            $this->syncToBusiness($user, $business);
        }
    }

    /**
     * Sync a user to a specific business
     */
    public function syncToBusiness(CentralUser $user, Business $business): void
    {
        if (! $business->tenant_id || ! $business->tenant) {
            throw new \Exception("Business {$business->name} is missing a valid tenant.");
        }

        // Create tenant user (assumes already in tenant context)
        $this->createTenantUser($user);

        // Attach relationships in central DB
        $user->tenants()->syncWithoutDetaching([$business->tenant->id]);
        $user->businesses()->syncWithoutDetaching([$business->id]);
    }

    /**
     * Create a tenant user assuming tenant context is already active
     */
    protected function createTenantUser(CentralUser $user): TenantUser
    {
        return TenantUser::firstOrCreate(
            ['email' => $user->email],
            [
                'global_id'         => $user->global_id,
                'name'              => $user->name,
                'password'          => $user->password, // already hashed
                'email_verified_at' => $user->email_verified_at,
                'status'            => 'active',
            ]
        );
    }

    /**
     * Remove a user from a business (assumes tenant context already active)
     */
    public function removeFromBusiness(CentralUser $user, Business $business): void
    {
        if (! $business->tenant_id || ! $business->tenant) {
            return;
        }

        // Remove from tenant DB
        TenantUser::where('global_id', $user->global_id)->delete();

        // Remove from central DB relationships
        $user->tenants()->detach($business->tenant_id);
        $user->businesses()->detach($business->id);
    }

    /**
     * Update user across all tenants
     */
    public function updateUserAcrossAllTenants(CentralUser $user, array $updateData): void
    {
        $user->update($updateData);

        foreach ($user->tenants as $tenant) {
            // Let your tenant middleware handle context, or manually switch if needed
            $tenantUser = TenantUser::where('global_id', $user->global_id)->first();
            if ($tenantUser) {
                $tenantUser->update(array_intersect_key($updateData, array_flip([
                    'name',
                    'email',
                    'status',
                    'email_verified_at',
                ])));
            }
        }
    }

    public function findByEmail(string $email): ?CentralUser
    {
        return CentralUser::where('email', $email)->first();
    }

    /**
     * Delete user from all tenants and central DB
     */
    public function deleteUserCompletely(CentralUser $user): void
    {
        foreach ($user->tenants as $tenant) {
            TenantUser::where('global_id', $user->global_id)->forceDelete();
        }

        $user->tenants()->detach();
        $user->businesses()->detach();
        $user->forceDelete();
    }

    /**
     * Check if user has access to a business
     */
    public function hasAccessToBusiness(CentralUser $user, Business $business): bool
    {
        return $user->businesses()->where('business_id', $business->id)->exists();
    }

    /**
     * Get user roles in tenant context (assumes tenant context is already active)
     */
    public function getUserRolesInBusiness(CentralUser $user, Business $business): array
    {
        if (! $business->tenant_id || ! $business->tenant) {
            return [];
        }

        $tenantUser = TenantUser::where('global_id', $user->global_id)->first();

        return $tenantUser ? $tenantUser->getRoleNames()->toArray() : [];
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

        if (! $tenant) {
            throw new \Exception("Business does not have an associated tenant");
        }

        // Check if user is synced with this business
        if (! $user->tenants()->where('tenant_id', $tenant->id)->exists()) {
            throw new \Exception("User is not associated with this business");
        }

        // Switch to tenant context
        tenancy()->initialize($tenant);

        // Find the user in the tenant database
        $tenantUser = TenantUser::where('global_id', $user->global_id)->first();

        if (! $tenantUser) {
            tenancy()->end();
            return false;
        }

        // Update the role
        $tenantUser->syncRoles([$roleName]);

        // Always return to central context
        tenancy()->end();

        return true;
    }
}
