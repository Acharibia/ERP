<?php

namespace App\Central\Services;

use App\Central\Models\Package;
use App\Central\Models\Module;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class PackageService
{
    /**
     * Get all packages.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getAllPackages(): Collection
    {
        return Package::with('modules')->orderBy('base_price')->get();
    }


    /**
     * Get all public packages with their modules.
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function getPublicPackages(): Collection
    {
        return Package::with('modules')
            ->where('is_public', true)
            ->orderBy('base_price')
            ->get();
    }

    /**
     * Get a specific package by ID with its modules.
     *
     * @param int $id
     * @return Package|null
     */
    public function getPackageById(int $id): ?Package
    {
        return Package::with('modules')->find($id);
    }

    /**
     * Create a new package.
     *
     * @param array $data
     * @param array $moduleIds
     * @return Package
     */
    public function createPackage(array $data, array $moduleIds = []): Package
    {
        // Create the package
        $package = Package::create([
            'name' => $data['name'],
            'description' => $data['description'],
            'is_public' => $data['is_public'] ?? true,
            'base_price' => $data['base_price'],
            'user_limit' => $data['user_limit'],
            'storage_limit' => $data['storage_limit'],
        ]);

        // Attach modules if provided
        if (!empty($moduleIds)) {
            $package->modules()->attach($moduleIds);
        }

        return $package->load('modules');
    }

    /**
     * Update an existing package.
     *
     * @param int $id
     * @param array $data
     * @param array|null $moduleIds
     * @return Package|null
     */
    public function updatePackage(int $id, array $data, ?array $moduleIds = null): ?Package
    {
        $package = $this->getPackageById($id);

        if (!$package) {
            return null;
        }

        // Update package attributes
        $package->update([
            'name' => $data['name'] ?? $package->name,
            'description' => $data['description'] ?? $package->description,
            'is_public' => $data['is_public'] ?? $package->is_public,
            'base_price' => $data['base_price'] ?? $package->base_price,
            'user_limit' => $data['user_limit'] ?? $package->user_limit,
            'storage_limit' => $data['storage_limit'] ?? $package->storage_limit,
        ]);

        // Update modules if provided
        if ($moduleIds !== null) {
            $package->modules()->sync($moduleIds);
        }

        return $package->fresh('modules');
    }

    /**
     * Delete a package.
     *
     * @param int $id
     * @return bool
     */
    public function deletePackage(int $id): bool
    {
        $package = Package::find($id);

        if (!$package) {
            return false;
        }

        // Check if the package has any active subscriptions
        if ($package->subscriptions()->where('status', 'active')->exists()) {
            return false;
        }

        // Detach all modules
        $package->modules()->detach();

        // Delete the package
        return $package->delete();
    }

    /**
     * Add a module to a package.
     *
     * @param int $packageId
     * @param int $moduleId
     * @return bool
     */
    public function addModuleToPackage(int $packageId, int $moduleId): bool
    {
        $package = Package::find($packageId);
        $module = Module::find($moduleId);

        if (!$package || !$module) {
            return false;
        }

        // Check if module is already attached
        if ($package->modules()->where('module_id', $moduleId)->exists()) {
            return true;
        }

        $package->modules()->attach($moduleId);
        return true;
    }

    /**
     * Remove a module from a package.
     *
     * @param int $packageId
     * @param int $moduleId
     * @return bool
     */
    public function removeModuleFromPackage(int $packageId, int $moduleId): bool
    {
        $package = Package::find($packageId);

        if (!$package) {
            return false;
        }

        $package->modules()->detach($moduleId);
        return true;
    }

    /**
     * Calculate the price for a package based on billing cycle.
     *
     * @param Package $package
     * @param string $billingCycle monthly|quarterly|annual
     * @return float
     */
    public function calculatePrice(Package $package, string $billingCycle): float
    {
        $basePrice = $package->base_price;

        switch ($billingCycle) {
            case 'quarterly':
                // 3 months with 5% discount
                return round($basePrice * 3 * 0.95, 2);
            case 'annual':
                // 12 months with 20% discount
                return round($basePrice * 12 * 0.8, 2);
            case 'monthly':
            default:
                return $basePrice;
        }
    }
}
