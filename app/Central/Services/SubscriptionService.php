<?php

namespace App\Central\Services;

use App\Central\Models\Business;
use App\Central\Models\Module;
use App\Central\Models\Subscription;
use App\Central\Models\Package;
use App\Support\Enums\SubscriptionStatus;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SubscriptionService
{
    /**
     * ID of the special "All Access" package for trials
     * You'll need to create this package in your database or seeder
     */
    protected const ALL_ACCESS_PACKAGE_ID = 3; // Replace with your actual package ID

    /**
     * Create a new subscription for a business
     *
     * @param Business $business
     * @param int $packageId
     * @param string $billingCycle
     * @param bool $startTrial
     * @param float|null $priceOverride
     * @param int|null $userLimitOverride
     * @return Subscription
     */
    public function create(
        Business $business,
        int $packageId,
        string $billingCycle = 'monthly',
        bool $startTrial = true,
        ?float $priceOverride = null,
        ?int $userLimitOverride = null
    ): Subscription {
        // If starting trial, use the All Access package
        $actualPackageId = $startTrial ? self::ALL_ACCESS_PACKAGE_ID : $packageId;
        $package = Package::findOrFail($actualPackageId);

        // Define start and end dates based on billing cycle
        $startDate = now()->startOfDay();
        $endDate = $this->calculateEndDate($startDate, $billingCycle);

        // Initialize with a trial or active status
        $status = $startTrial ? SubscriptionStatus::TRIAL->value : SubscriptionStatus::ACTIVE->value;

        // Define trial end date if applicable
        $trialEndsAt = $startTrial ? now()->addDays(30)->endOfDay() : null;

        // Create the subscription
        $subscription = Subscription::create([
            'business_id' => $business->id,
            'package_id' => $package->id,
            'status' => $status,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'trial_ends_at' => $trialEndsAt,
            'is_auto_renew' => true,
            'billing_cycle' => $billingCycle,
            'price_override' => $priceOverride,
            'user_limit_override' => $userLimitOverride,
        ]);

        // Update the business subscription status
        $business->update([
            'subscription_status' => $status,
        ]);

        // Attach package modules to the business
        foreach ($package->modules as $module) {
            // Check if the module is already attached to the business
            if (!$business->modules()->where('module_id', $module->id)->exists()) {
                // If not, attach it
                $business->modules()->attach($module->id, [
                    'is_active' => true,
                    'version' => $module->version,
                ]);
            } else {
                // If it exists, update it
                $business->modules()->updateExistingPivot($module->id, [
                    'is_active' => true,
                    'version' => $module->version,
                ]);
            }
        }

        return $subscription;
    }

    /**
     * Handle trial expiration for a subscription
     *
     * @param Subscription $subscription
     * @return Subscription
     */
    public function handleTrialExpiration(Subscription $subscription): Subscription
    {
        $business = $subscription->business;

        // Since we don't have selected_package_id, we'll use a default approach
        // Option 1: Just convert the current trial subscription to active
        $subscription->update([
            'status' => SubscriptionStatus::ACTIVE->value,
            'trial_ends_at' => null
        ]);

        // Update business status
        $business->update([
            'subscription_status' => SubscriptionStatus::ACTIVE->value
        ]);

        return $subscription->fresh();

        /* Alternative approach if you need to create a new subscription:

        // End the trial subscription
        $subscription->update([
            'status' => SubscriptionStatus::EXPIRED->value,
            'end_date' => now()
        ]);

        // Create a new active subscription with the same package
        $newSubscription = Subscription::create([
            'business_id' => $business->id,
            'package_id' => $subscription->package_id, // Use the same package
            'status' => SubscriptionStatus::ACTIVE->value,
            'start_date' => now()->startOfDay(),
            'end_date' => $this->calculateEndDate(now()->startOfDay(), $subscription->billing_cycle),
            'trial_ends_at' => null,
            'is_auto_renew' => $subscription->is_auto_renew,
            'billing_cycle' => $subscription->billing_cycle,
            'price_override' => $subscription->price_override,
            'user_limit_override' => $subscription->user_limit_override,
        ]);

        // Update business status
        $business->update([
            'subscription_status' => SubscriptionStatus::ACTIVE->value
        ]);

        return $newSubscription;
        */
    }

    /**
     * Change a business's subscription to a new package
     *
     * @param Business $business
     * @param int $newPackageId
     * @param string $billingCycle
     * @param bool $applyImmediately
     * @param float|null $priceOverride
     * @param int|null $userLimitOverride
     * @return Subscription
     */
    public function changePackage(
        Business $business,
        int $newPackageId,
        string $billingCycle = 'monthly',
        bool $applyImmediately = true,
        ?float $priceOverride = null,
        ?int $userLimitOverride = null
    ): Subscription {
        $newPackage = Package::findOrFail($newPackageId);
        $currentSubscription = $business->subscription;

        // If current subscription is in trial, just end it and create new one
        if ($currentSubscription && $currentSubscription->isOnTrial()) {
            // End the trial subscription
            $currentSubscription->update([
                'status' => SubscriptionStatus::CANCELLED->value,
                'end_date' => now()
            ]);

            // Create new subscription with selected package
            return $this->create(
                $business,
                $newPackageId,
                $billingCycle,
                false,  // No trial for the new subscription
                $priceOverride,
                $userLimitOverride
            );
        }

        // If there is a current subscription and applying immediately
        if ($currentSubscription && $applyImmediately) {
            // End the current subscription
            $currentSubscription->update([
                'status' => SubscriptionStatus::CANCELLED->value,
                'end_date' => now()
            ]);

            // Start dates for new subscription
            $startDate = now()->startOfDay();
            $endDate = $this->calculateEndDate($startDate, $billingCycle);

            // Create new subscription with active status
            $subscription = Subscription::create([
                'business_id' => $business->id,
                'package_id' => $newPackage->id,
                'status' => SubscriptionStatus::ACTIVE->value,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'trial_ends_at' => null, // No trial for package changes
                'is_auto_renew' => true,
                'billing_cycle' => $billingCycle,
                'price_override' => $priceOverride,
                'user_limit_override' => $userLimitOverride,
            ]);

            // Update modules based on new package
            $this->updateBusinessModules($business, $newPackage);

            return $subscription;
        }
        // If there is a current subscription and scheduling for next cycle
        elseif ($currentSubscription && !$applyImmediately) {
            // Mark current subscription for non-renewal
            $currentSubscription->update([
                'is_auto_renew' => false
            ]);

            // Create pending subscription starting after current one ends
            $startDate = $currentSubscription->end_date;
            $endDate = $this->calculateEndDate($startDate, $billingCycle);

            $subscription = Subscription::create([
                'business_id' => $business->id,
                'package_id' => $newPackage->id,
                'status' => SubscriptionStatus::PENDING->value,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'trial_ends_at' => null,
                'is_auto_renew' => true,
                'billing_cycle' => $billingCycle,
                'price_override' => $priceOverride,
                'user_limit_override' => $userLimitOverride,
            ]);

            return $subscription;
        }
        // If there is no current subscription
        else {
            return $this->create(
                $business,
                $newPackage->id,
                $billingCycle,
                false, // No trial for new package when changing
                $priceOverride,
                $userLimitOverride
            );
        }
    }

    /**
     * Cancel a business's subscription
     *
     * @param Business $business
     * @param bool $immediately
     * @return bool
     */
    public function cancel(Business $business, bool $immediately = false): bool
    {
        $subscription = $business->subscription;

        if (!$subscription) {
            return false;
        }

        if ($immediately) {
            // Cancel immediately
            $subscription->update([
                'status' => SubscriptionStatus::CANCELLED->value,
                'end_date' => now()
            ]);

            // Update business status
            $business->update([
                'subscription_status' => SubscriptionStatus::CANCELLED->value
            ]);

            // Deactivate modules
            foreach ($business->modules()->wherePivot('is_active', true)->get() as $module) {
                $business->modules()->updateExistingPivot($module->id, [
                    'is_active' => false
                ]);
            }
        } else {
            // Cancel at end of billing cycle
            $subscription->update([
                'is_auto_renew' => false
            ]);
        }

        return true;
    }

    /**
     * Renew a subscription
     *
     * @param Subscription $subscription
     * @return Subscription
     */
    public function renew(Subscription $subscription): Subscription
    {
        $business = $subscription->business;
        $package = $subscription->package;

        // Mark the current subscription as expired
        $subscription->update([
            'status' => SubscriptionStatus::EXPIRED->value,
        ]);

        // Create new subscription
        $startDate = $subscription->end_date;
        $endDate = $this->calculateEndDate($startDate, $subscription->billing_cycle);

        return Subscription::create([
            'business_id' => $business->id,
            'package_id' => $package->id,
            'status' => SubscriptionStatus::ACTIVE->value,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'trial_ends_at' => null,
            'is_auto_renew' => $subscription->is_auto_renew,
            'billing_cycle' => $subscription->billing_cycle,
            'price_override' => $subscription->price_override,
            'user_limit_override' => $subscription->user_limit_override,
        ]);
    }

    /**
     * Apply a pending subscription when it becomes due
     *
     * @param Subscription $pendingSubscription
     * @return Subscription
     */
    public function activatePendingSubscription(Subscription $pendingSubscription): Subscription
    {
        $business = $pendingSubscription->business;
        $package = $pendingSubscription->package;

        // Update the pending subscription to active
        $pendingSubscription->update([
            'status' => SubscriptionStatus::ACTIVE->value,
        ]);

        // Update business subscription status
        $business->update([
            'subscription_status' => SubscriptionStatus::ACTIVE->value,
        ]);

        // Update modules based on new package
        $this->updateBusinessModules($business, $package);

        return $pendingSubscription->fresh();
    }

    /**
     * Check if a business is eligible for a free trial
     *
     * @param Business $business
     * @return bool
     */
    public function isEligibleForTrial(Business $business): bool
    {
        // Check if the business has had a trial before
        return !Subscription::where('business_id', $business->id)
            ->whereNotNull('trial_ends_at')
            ->exists();
    }

    /**
     * Calculate end date based on billing cycle
     *
     * @param Carbon $startDate
     * @param string $billingCycle
     * @return Carbon
     */
    protected function calculateEndDate(Carbon $startDate, string $billingCycle): Carbon
    {
        switch ($billingCycle) {
            case 'quarterly':
                return $startDate->copy()->addMonths(3)->endOfDay();
            case 'annual':
                return $startDate->copy()->addYear()->endOfDay();
            case 'monthly':
            default:
                return $startDate->copy()->addMonth()->endOfDay();
        }
    }

    /**
     * Update business modules when changing packages
     *
     * @param Business $business
     * @param Package $newPackage
     * @return void
     */
    protected function updateBusinessModules(Business $business, Package $newPackage): void
    {
        // Get current active modules
        $currentModuleIds = $business->modules()->wherePivot('is_active', true)->pluck('modules.id')->toArray();

        // Get new package modules
        $newModuleIds = $newPackage->modules->pluck('id')->toArray();

        // Modules to remove (deactivate)
        $modulesToDeactivate = array_diff($currentModuleIds, $newModuleIds);

        // Modules to add
        $modulesToAdd = array_diff($newModuleIds, $currentModuleIds);

        // Deactivate modules not in the new package
        foreach ($modulesToDeactivate as $moduleId) {
            $business->modules()->updateExistingPivot($moduleId, [
                'is_active' => false
            ]);
        }

        // Add new modules
        foreach ($modulesToAdd as $moduleId) {
            $module = $newPackage->modules->firstWhere('id', $moduleId);

            if ($business->modules()->where('modules.id', $moduleId)->exists()) {
                // If module exists but inactive, reactivate it
                $business->modules()->updateExistingPivot($moduleId, [
                    'is_active' => true,
                    'version' => $module->version
                ]);
            } else {
                // If module doesn't exist, add it
                $business->modules()->attach($moduleId, [
                    'is_active' => true,
                    'version' => $module->version
                ]);
            }
        }
    }
}
