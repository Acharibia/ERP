<?php

namespace App\Resellers\Services;

use App\Central\Models\User;
use App\Central\Models\Reseller;
use App\Central\Services\NotificationService;
use App\Support\Enums\UserType;
use App\Support\Enums\ResellerStatus;
use App\Support\Enums\ResellerVerificationStatus;

class ResellerNotificationService
{
    protected NotificationService $notificationService;

    /**
     * Create a new ResellerNotificationService instance.
     *
     * @param NotificationService $notificationService
     */
    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    /**
     * Send welcome notification to a new reseller
     *
     * @param Reseller $reseller
     * @param User $user
     * @return void
     */
    public function sendWelcomeNotification(Reseller $reseller, User $user): void
    {
        $variables = [
            'reseller_name' => $reseller->company_name,
            'user_name' => $user->name,
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.welcome',
            $variables,
            ['user_id' => $user->id]
        );

        // Also create an in-app notification
        $this->notificationService->createInAppNotification(
            $user,
            'reseller.welcome',
            $variables
        );
    }

    /**
     * Notify admin about new reseller registration
     *
     * @param Reseller $reseller
     * @return void
     */
    public function notifyAdminAboutNewReseller(Reseller $reseller): void
    {
        // Find system admin users
        $adminUsers = User::where('user_type', UserType::SYSTEM_ADMIN->value)
            ->where('is_super_admin', true)
            ->get();

        foreach ($adminUsers as $admin) {
            $variables = [
                'admin_name' => $admin->name,
                'reseller_name' => $reseller->company_name,
                'reseller_email' => $reseller->email,
                'reseller_phone' => $reseller->phone,
                'registration_date' => now()->format('F j, Y H:i'),
                'admin_url' => url('/admin/resellers/' . $reseller->id)
            ];

            $this->notificationService->sendEmailNotification(
                $admin->email,
                'admin.new_reseller',
                $variables,
                ['user_id' => $admin->id]
            );

            $this->notificationService->createInAppNotification(
                $admin,
                'admin.new_reseller',
                $variables
            );
        }
    }

    /**
     * Notify reseller about status change
     *
     * @param Reseller $reseller
     * @param string $oldStatus
     * @param string $newStatus
     * @return void
     */
    public function notifyStatusChange(Reseller $reseller, string $oldStatus, string $newStatus): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'old_status' => ResellerStatus::from($oldStatus)->label(),
            'new_status' => ResellerStatus::from($newStatus)->label(),
            'changed_at' => now()->format('F j, Y H:i'),
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.status_changed',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.status_changed',
            $variables
        );
    }

    /**
     * Send activation notification to reseller
     *
     * @param Reseller $reseller
     * @return void
     */
    public function sendActivationNotification(Reseller $reseller): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'activation_date' => now()->format('F j, Y'),
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.activated',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.activated',
            $variables
        );
    }

    /**
     * Send suspension notification to reseller
     *
     * @param Reseller $reseller
     * @param string|null $reason
     * @return void
     */
    public function sendSuspensionNotification(Reseller $reseller, ?string $reason = null): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'suspension_date' => now()->format('F j, Y'),
            'reason' => $reason ?? 'No reason provided',
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.suspended',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.suspended',
            $variables
        );
    }

    /**
     * Send archival notification to reseller
     *
     * @param Reseller $reseller
     * @return void
     */
    public function sendArchivalNotification(Reseller $reseller): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'archive_date' => now()->format('F j, Y'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.archived',
            $variables,
            ['user_id' => $user->id]
        );
    }

    /**
     * Notify about verification status change
     *
     * @param Reseller $reseller
     * @param string $oldStatus
     * @param string $newStatus
     * @return void
     */
    public function notifyVerificationStatusChange(Reseller $reseller, string $oldStatus, string $newStatus): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'old_status' => ResellerVerificationStatus::from($oldStatus)->label(),
            'new_status' => ResellerVerificationStatus::from($newStatus)->label(),
            'changed_at' => now()->format('F j, Y H:i'),
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.verification_status_changed',
            $variables
        );
    }

    /**
     * Send verification approved notification
     *
     * @param Reseller $reseller
     * @return void
     */
    public function sendVerificationApprovedNotification(Reseller $reseller): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'verification_date' => now()->format('F j, Y'),
            'dashboard_url' => url('/reseller/dashboard'),
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.verification_approved',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.verification_approved',
            $variables
        );
    }

    /**
     * Send verification rejected notification
     *
     * @param Reseller $reseller
     * @param string|null $reason
     * @return void
     */
    public function sendVerificationRejectedNotification(Reseller $reseller, ?string $reason = null): void
    {
        // Get the reseller's primary user
        $user = $this->getResellerPrimaryUser($reseller);

        if (!$user) {
            return;
        }

        $variables = [
            'user_name' => $user->name,
            'reseller_name' => $reseller->company_name,
            'rejection_date' => now()->format('F j, Y'),
            'reason' => $reason ?? 'No reason provided',
            'support_email' => config('app.support_email')
        ];

        $this->notificationService->sendEmailNotification(
            $user->email,
            'reseller.verification_rejected',
            $variables,
            ['user_id' => $user->id]
        );

        $this->notificationService->createInAppNotification(
            $user,
            'reseller.verification_rejected',
            $variables
        );
    }

    /**
     * Get the reseller's primary user
     *
     * @param Reseller $reseller
     * @return User|null
     */
    private function getResellerPrimaryUser(Reseller $reseller): ?User
    {
        return User::where('reseller_id', $reseller->id)
            ->where('user_type', UserType::RESELLER->value)
            ->first();
    }
}
