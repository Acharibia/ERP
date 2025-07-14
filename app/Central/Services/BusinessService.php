<?php

namespace App\Central\Services;

use App\Businesses\Services\BusinessNotificationService;
use App\Central\Http\Requests\StoreBusinessRequest;
use App\Central\Http\Resources\BusinessResource;
use App\Central\Models\Business;
use App\Central\Models\User;
use App\Central\Models\UserBusiness;
use App\Central\Services\UserService;
use App\Central\Services\PackageService;
use App\Central\Services\SubscriptionService;
use App\Central\Enums\BusinessStatus;
use App\Central\Enums\UserType;
use App\Central\Enums\BusinessVerificationStatus;
use App\Central\Enums\SubscriptionStatus;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;

class BusinessService
{
    protected UserService $userService;
    protected BusinessNotificationService $notificationService;
    protected SubscriptionService $subscriptionService;
    protected PackageService $packageService;

    /**
     * Create a new BusinessService instance.
     *
     * @param UserService $userService
     * @param BusinessNotificationService $notificationService
     * @param SubscriptionService $subscriptionService
     * @param PackageService $packageService
     */
    public function __construct(
        UserService $userService,
        BusinessNotificationService $notificationService,
        SubscriptionService $subscriptionService,
        PackageService $packageService
    ) {
        $this->userService = $userService;
        $this->notificationService = $notificationService;
        $this->subscriptionService = $subscriptionService;
        $this->packageService = $packageService;
    }

    /**
     * Register a new business
     *
     * @param StoreBusinessRequest $request
     * @return BusinessResource
     */
    public function register(StoreBusinessRequest $request): BusinessResource
    {
        // Create user account for the business admin
        $user = $this->userService->create([
            'name' => $request->contact_name,
            'email' => $request->contact_email,
            'password' => $request->password,
        ], UserType::BUSINESS_USER);

        event(new Registered($user));

        // Create the business record
        $business = $this->createBusiness([
            'name' => $request->name,
            'registration_number' => $request->registration_number,
            'email' => $request->email,
            'phone' => $request->phone,
            'website' => $request->website,
            'address_line_1' => $request->address_line_1,
            'address_line_2' => $request->address_line_2,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
            'industry_id' => $request->industry_id,
            'reseller_id' => $request->reseller_id,
        ], $user);

        // Create subscription based on selected package
        if ($request->has('package_id')) {
            $this->subscriptionService->create(
                $business->resource,
                $request->package_id,
                $request->billing_cycle ?? 'monthly',
                true // Start with a trial
            );
        }

        // Send welcome notification to the new business
        $this->notificationService->sendWelcomeNotification($business->resource, $user);

        // Notify admin about new business registration
        $this->notificationService->notifyAdminAboutNewBusiness($business->resource);

        // If registered through a reseller, notify them
        if ($request->reseller_id) {
            $this->notificationService->notifyResellerAboutNewBusiness($business->resource);
        }

        Auth::login($user);
        return $business;
    }

    /**
     * Create a business
     *
     * @param array $businessData
     * @param User|null $user
     * @return BusinessResource
     */
    public function createBusiness(array $businessData, ?User $user = null): BusinessResource
    {
        $tenantId = 'business_' . Str::slug($businessData['name']) . '_' . Str::random(8);

        $businessData = array_merge([
            'tenant_id' => $tenantId,
            'schema_version' => '1.0',
            'subscription_status' => SubscriptionStatus::TRIAL->value,
            'environment' => 'production',
            'status' => BusinessStatus::PENDING->value,
            'verification_status' => BusinessVerificationStatus::PENDING->value,
        ], $businessData);

        $business = Business::createWithTenant($businessData);

        if ($user) {
            UserBusiness::create([
                'user_id' => $user->id,
                'business_id' => $business->id,
                'is_primary' => true,
                'is_business_admin' => true,
            ]);
        }

        return new BusinessResource($business);
    }

    /**
     * Update a business's subscription package
     *
     * @param Business $business
     * @param int $packageId
     * @param string $billingCycle
     * @param bool $applyImmediately
     * @return BusinessResource
     */
    public function updateSubscription(
        Business $business,
        int $packageId,
        string $billingCycle = 'monthly',
        bool $applyImmediately = true
    ): BusinessResource {
        // Create or update subscription
        $this->subscriptionService->changePackage(
            $business,
            $packageId,
            $billingCycle,
            $applyImmediately
        );

        // If applied immediately, notify about the package change
        if ($applyImmediately) {
            $package = $this->packageService->getPackageById($packageId);
            $this->notificationService->notifyPackageChange($business, $package);
        }

        return new BusinessResource($business->fresh());
    }

    /**
     * Cancel a business's subscription
     *
     * @param Business $business
     * @param bool $immediately
     * @return BusinessResource
     */
    public function cancelSubscription(Business $business, bool $immediately = false): BusinessResource
    {
        $this->subscriptionService->cancel($business, $immediately);

        // Notify about cancellation
        $this->notificationService->notifySubscriptionCancelled($business, $immediately);

        return new BusinessResource($business->fresh());
    }

    /**
     * Update a business's status
     *
     * @param Business $business
     * @param BusinessStatus $status
     * @return BusinessResource
     */
    public function updateStatus(Business $business, BusinessStatus $status): BusinessResource
    {
        $oldStatus = $business->status;
        $business->status = $status->value;
        $business->save();

        $this->notificationService->notifyStatusChange($business, $oldStatus, $status->value);

        return new BusinessResource($business);
    }

    /**
     * Activate a business
     *
     * @param Business $business
     * @return BusinessResource
     */
    public function activate(Business $business): BusinessResource
    {
        $result = $this->updateStatus($business, BusinessStatus::ACTIVE);

        // Send activation notification
        $this->notificationService->sendActivationNotification($business);

        return $result;
    }

    /**
     * Suspend a business
     *
     * @param Business $business
     * @param string|null $reason
     * @return BusinessResource
     */
    public function suspend(Business $business, ?string $reason = null): BusinessResource
    {
        $result = $this->updateStatus($business, BusinessStatus::SUSPENDED);

        // Send suspension notification with reason
        $this->notificationService->sendSuspensionNotification($business, $reason);

        // Notify reseller if the business is tied to one
        if ($business->reseller_id) {
            $this->notificationService->notifyResellerAboutBusinessSuspension($business, $reason);
        }

        return $result;
    }


    /**
     * Update a business's verification status
     *
     * @param Business $business
     * @param BusinessVerificationStatus $verificationStatus
     * @return BusinessResource
     */
    public function updateVerificationStatus(Business $business, BusinessVerificationStatus $verificationStatus): BusinessResource
    {
        $oldStatus = $business->verification_status;
        $business->verification_status = $verificationStatus->value;
        $business->save();

        // Notify about verification status change
        $this->notificationService->notifyVerificationStatusChange($business, $oldStatus, $verificationStatus->value);

        return new BusinessResource($business);
    }

    /**
     * Mark a business as verified
     *
     * @param Business $business
     * @return BusinessResource
     */
    public function verify(Business $business): BusinessResource
    {
        // When verified, also activate the business
        $business->status = BusinessStatus::ACTIVE->value;
        $business->verification_status = BusinessVerificationStatus::VERIFIED->value;
        $business->save();

        // Send verification approved notification
        $this->notificationService->sendVerificationApprovedNotification($business);

        // Notify reseller if the business is tied to one
        if ($business->reseller_id) {
            $this->notificationService->notifyResellerAboutBusinessVerification($business);
        }

        return new BusinessResource($business);
    }

    /**
     * Reject a business's verification
     *
     * @param Business $business
     * @param string|null $reason
     * @return BusinessResource
     */
    public function rejectVerification(Business $business, ?string $reason = null): BusinessResource
    {
        $business->verification_status = BusinessVerificationStatus::REJECTED->value;
        if ($reason) {
            $business->rejection_reason = $reason;
        }
        $business->save();

        // Send verification rejected notification with reason
        $this->notificationService->sendVerificationRejectedNotification($business, $reason);

        // Notify reseller if the business is tied to one
        if ($business->reseller_id) {
            $this->notificationService->notifyResellerAboutBusinessRejection($business, $reason);
        }

        return new BusinessResource($business);
    }

    /**
     * Transfer a business to a different reseller
     *
     * @param Business $business
     * @param int $newResellerId
     * @param string|null $reason
     * @return BusinessResource
     */
    public function transferToReseller(Business $business, int $newResellerId, ?string $reason = null): BusinessResource
    {
        $oldResellerId = $business->reseller_id;
        $business->reseller_id = $newResellerId;
        $business->save();

        // Notify business about the transfer
        $this->notificationService->notifyBusinessAboutResellerTransfer($business, $oldResellerId, $newResellerId, $reason);

        // Notify old reseller
        if ($oldResellerId) {
            $this->notificationService->notifyOldResellerAboutTransfer($business, $oldResellerId, $reason);
        }

        // Notify new reseller
        $this->notificationService->notifyNewResellerAboutTransfer($business, $newResellerId);

        return new BusinessResource($business);
    }
}
