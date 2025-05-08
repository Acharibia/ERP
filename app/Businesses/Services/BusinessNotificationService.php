<?php

namespace App\Businesses\Services;

use App\Central\Models\User;
use App\Central\Models\Package;
use App\Central\Models\Business;
use App\Central\Models\Reseller;
use App\Support\Enums\UserType;
use App\Support\Enums\BusinessStatus;
use App\Central\Services\NotificationService;
use App\Support\Enums\BusinessVerificationStatus;

class BusinessNotificationService
{
    protected NotificationService $notificationService;

    /**
     * Create a new BusinessNotificationService instance.
     *
     * @param NotificationService $notificationService
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Send welcome notification to a new business
     *
     * @param Business $business
     * @param User $user
     * @return void
     */
    public function sendWelcomeNotification(Business $business, User $user): void
    {
        $variables = [
            'business_name' => $business->name,
            'user_name' => $user->name,
            'dashboard_url' => url('/business/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'business.welcome',
            $variables,
            ['user_id' => $user->id]
        );

        // Also create an in-app notification
        $this->notificationService->createInAppNotification(
            $user,
            'business.welcome',
            $variables
        );
    }

    /**
     * Notify admin about new business registration
     *
     * @param Business $business
     * @return void
     */
    public function notifyAdminAboutNewBusiness(Business $business): void
    {
        // Find system admin users
        $adminUsers = User::where('user_type', UserType::SYSTEM_ADMIN->value)
            ->where('is_super_admin', true)
            ->get();

        foreach ($adminUsers as $admin) {
            $variables = [
                'admin_name' => $admin->name,
                'business_name' => $business->name,
                'business_email' => $business->email,
                'business_phone' => $business->phone,
                'registration_date' => now()->format('F j, Y H:i'),
                'admin_url' => url('/admin/businesses/' . $business->id)
            ];

            $this->notificationService->sendEmailNotification(
                $admin->email,
                'admin.new_business',
                $variables,
                ['user_id' => $admin->id]
            );

            $this->notificationService->createInAppNotification(
                $admin,
                'admin.new_business',
                $variables
            );
        }
    }

    /**
     * Notify reseller about a new business registration under them
     *
     * @param Business $business
     * @return void
     */
    public function notifyResellerAboutNewBusiness(Business $business): void
    {
        if (!$business->reseller_id) {
            return;
        }

        $reseller = Reseller::find($business->reseller_id);
        if (!$reseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $reseller->id)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'reseller_name' => $reseller->company_name,
            'user_name' => $user->name,
            'business_name' => $business->name,
            'business_email' => $business->email,
            'business_phone' => $business->phone,
            'registration_date' => now()->format('F j, Y H:i'),
            'business_url' => url('/reseller/businesses/' . $business->id),
            'dashboard_url' => url('/reseller/dashboard')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.new_business',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.new_business',
            $variables
        );
    }

    /**
     * Notify business about status change
     *
     * @param Business $business
     * @param string $oldStatus
     * @param string $newStatus
     * @return void
     */
    public function notifyStatusChange(Business $business, string $oldStatus, string $newStatus): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'old_status' => BusinessStatus::from($oldStatus)->label(),
                'new_status' => BusinessStatus::from($newStatus)->label(),
                'changed_at' => now()->format('F j, Y H:i'),
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.status_changed',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.status_changed',
                $variables
            );
        }
    }

    /**
     * Send activation notification
     *
     * @param Business $business
     * @return void
     */
    public function sendActivationNotification(Business $business): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'activation_date' => now()->format('F j, Y'),
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.activated',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.activated',
                $variables
            );
        }
    }

    /**
     * Send suspension notification with reason
     *
     * @param Business $business
     * @param string|null $reason
     * @return void
     */
    public function sendSuspensionNotification(Business $business, ?string $reason = null): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'suspension_date' => now()->format('F j, Y'),
                'reason' => $reason ?? 'No reason provided',
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.suspended',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.suspended',
                $variables
            );
        }
    }


    /**
     * Notify about verification status change
     *
     * @param Business $business
     * @param string $oldStatus
     * @param string $newStatus
     * @return void
     */
    public function notifyVerificationStatusChange(Business $business, string $oldStatus, string $newStatus): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'old_status' => BusinessVerificationStatus::from($oldStatus)->label(),
                'new_status' => BusinessVerificationStatus::from($newStatus)->label(),
                'changed_at' => now()->format('F j, Y H:i'),
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->createInAppNotification(
                $user,
                'business.verification_status_changed',
                $variables
            );
        }
    }

    /**
     * Send verification approved notification
     *
     * @param Business $business
     * @return void
     */
    public function sendVerificationApprovedNotification(Business $business): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'verification_date' => now()->format('F j, Y'),
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.verification_approved',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.verification_approved',
                $variables
            );
        }
    }

    /**
     * Send verification rejected notification with reason
     *
     * @param Business $business
     * @param string|null $reason
     * @return void
     */
    public function sendVerificationRejectedNotification(Business $business, ?string $reason = null): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'rejection_date' => now()->format('F j, Y'),
                'reason' => $reason ?? 'No reason provided',
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.verification_rejected',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.verification_rejected',
                $variables
            );
        }
    }

    /**
     * Notify business about being transferred to a different reseller
     *
     * @param Business $business
     * @param int|null $oldResellerId
     * @param int $newResellerId
     * @param string|null $reason
     * @return void
     */
    public function notifyBusinessAboutResellerTransfer(Business $business, ?int $oldResellerId, int $newResellerId, ?string $reason = null): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        $oldReseller = $oldResellerId ? Reseller::find($oldResellerId) : null;
        $newReseller = Reseller::find($newResellerId);

        if (!$newReseller) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'old_reseller_name' => $oldReseller ? $oldReseller->company_name : 'None',
                'new_reseller_name' => $newReseller->company_name,
                'transfer_date' => now()->format('F j, Y'),
                'reason' => $reason ?? 'No reason provided',
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.reseller_transfer',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.reseller_transfer',
                $variables
            );
        }
    }

    /**
     * Notify old reseller about a business being transferred away
     *
     * @param Business $business
     * @param int $oldResellerId
     * @param string|null $reason
     * @return void
     */
    public function notifyOldResellerAboutTransfer(Business $business, int $oldResellerId, ?string $reason = null): void
    {
        $oldReseller = Reseller::find($oldResellerId);
        if (!$oldReseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $oldResellerId)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $oldReseller->company_name,
            'business_name' => $business->name,
            'transfer_date' => now()->format('F j, Y'),
            'reason' => $reason ?? 'No reason provided',
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.business_transferred_out',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.business_transferred_out',
            $variables
        );
    }

    /**
     * Notify new reseller about a business being transferred to them
     *
     * @param Business $business
     * @param int $newResellerId
     * @return void
     */
    public function notifyNewResellerAboutTransfer(Business $business, int $newResellerId): void
    {
        $newReseller = Reseller::find($newResellerId);
        if (!$newReseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $newResellerId)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $newReseller->company_name,
            'business_name' => $business->name,
            'business_email' => $business->email,
            'transfer_date' => now()->format('F j, Y'),
            'dashboard_url' => url('/reseller/dashboard'),
            'business_url' => url('/reseller/businesses/' . $business->id),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.business_transferred_in',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.business_transferred_in',
            $variables
        );
    }

    /**
     * Notify reseller about one of their businesses being suspended
     *
     * @param Business $business
     * @param string|null $reason
     * @return void
     */
    public function notifyResellerAboutBusinessSuspension(Business $business, ?string $reason = null): void
    {
        if (!$business->reseller_id) {
            return;
        }

        $reseller = Reseller::find($business->reseller_id);
        if (!$reseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $business->reseller_id)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'business_name' => $business->name,
            'suspension_date' => now()->format('F j, Y'),
            'reason' => $reason ?? 'No reason provided',
            'dashboard_url' => url('/reseller/dashboard'),
            'business_url' => url('/reseller/businesses/' . $business->id),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.business_suspended',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.business_suspended',
            $variables
        );
    }

    /**
     * Notify reseller about one of their businesses being verified
     *
     * @param Business $business
     * @return void
     */
    public function notifyResellerAboutBusinessVerification(Business $business): void
    {
        if (!$business->reseller_id) {
            return;
        }

        $reseller = Reseller::find($business->reseller_id);
        if (!$reseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $business->reseller_id)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'business_name' => $business->name,
            'verification_date' => now()->format('F j, Y'),
            'dashboard_url' => url('/reseller/dashboard'),
            'business_url' => url('/reseller/businesses/' . $business->id),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.business_verified',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.business_verified',
            $variables
        );
    }

    /**
     * Notify reseller about one of their businesses being rejected for verification
     *
     * @param Business $business
     * @param string|null $reason
     * @return void
     */
    public function notifyResellerAboutBusinessRejection(Business $business, ?string $reason = null): void
    {
        if (!$business->reseller_id) {
            return;
        }

        $reseller = Reseller::find($business->reseller_id);
        if (!$reseller) {
            return;
        }

        // Get the reseller's primary user
        $user = User::where('reseller_id', $business->reseller_id)
            ->where('user_type', UserType::RESELLER->value)
            ->first();

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'business_name' => $business->name,
            'rejection_date' => now()->format('F j, Y'),
            'reason' => $reason ?? 'No reason provided',
            'dashboard_url' => url('/reseller/dashboard'),
            'business_url' => url('/reseller/businesses/' . $business->id),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.business_verification_rejected',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.business_verification_rejected',
            $variables
        );
    }


    /**
     * Notify about package change
     *
     * @param Business $business
     * @param Package $package
     * @return void
     */
    public function notifyPackageChange(Business $business, Package $package): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'package_name' => $package->name,
                'package_description' => $package->description,
                'base_price' => $package->base_price,
                'user_limit' => $package->user_limit ? $package->user_limit : 'Unlimited',
                'storage_limit' => $package->storage_limit ? "{$package->storage_limit}GB" : 'Unlimited',
                'change_date' => now()->format('F j, Y'),
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.package_changed',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.package_changed',
                $variables
            );
        }
    }

    /**
     * Notify about subscription cancellation
     *
     * @param Business $business
     * @param bool $immediately
     * @return void
     */
    public function notifySubscriptionCancelled(Business $business, bool $immediately = false): void
    {
        // Get business admin users
        $adminUsers = $this->getBusinessAdminUsers($business);

        if ($adminUsers->isEmpty()) {
            return;
        }

        foreach ($adminUsers as $user) {
            $variables = [
                'user_name' => $user->name,
                'business_name' => $business->name,
                'cancellation_date' => now()->format('F j, Y'),
                'end_date' => $immediately ?
                    now()->format('F j, Y') :
                    $business->subscription->end_date->format('F j, Y'),
                'immediately' => $immediately,
                'dashboard_url' => url('/business/dashboard'),
                'support_email' => config('app.support_email')
            ];

            $this->notificationService->sendEmailNotification(
                $user->email,
                'business.subscription_cancelled',
                $variables,
                ['user_id' => $user->id]
            );

            $this->notificationService->createInAppNotification(
                $user,
                'business.subscription_cancelled',
                $variables
            );
        }
    }

    /**
     * Get business admin users
     *
     * @param Business $business
     * @return \Illuminate\Database\Eloquent\Collection
     */
    private function getBusinessAdminUsers(Business $business)
    {
        return User::whereHas('businesses', function ($query) use ($business) {
            $query->where('businesses.id', $business->id)
                ->where('user_businesses.is_business_admin', true);
        })->get();
    }
}
