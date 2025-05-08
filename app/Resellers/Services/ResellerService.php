<?php

namespace App\Resellers\Services;

use App\Resellers\Http\Requests\StoreResellerRequest;
use App\Central\Models\Reseller;
use App\Central\Models\User;
use App\Central\Services\UserService;
use App\Support\Enums\UserType;
use App\Support\Enums\ResellerStatus;
use App\Support\Enums\ResellerVerificationStatus;
use Illuminate\Support\Facades\Auth;
use App\Resellers\Http\Resources\ResellerResource;

class ResellerService
{
    protected UserService $userService;
    protected ResellerNotificationService $notificationService;

    /**
     * Create a new ResellerService instance.
     *
     * @param UserService $userService
     * @param ResellerNotificationService $notificationService
     */
    public function __construct(UserService $userService, ResellerNotificationService $notificationService)
    {
        $this->userService = $userService;
        $this->notificationService = $notificationService;
    }

    /**
     * Register a new reseller
     *
     * @param StoreResellerRequest $request
     * @return ResellerResource
     */
    public function register(StoreResellerRequest $request): ResellerResource
    {
        $user = $this->userService->create([
            'name' => $request->contact_name,
            'email' => $request->contact_email,
            'password' => $request->password,
        ], UserType::RESELLER);

        $reseller = $this->createReseller([
            'company_name' => $request->company_name,
            'contact_name' => $request->contact_name,
            'email' => $request->company_email,
            'phone' => $request->company_phone,
            'address' => $request->address,
            'city' => $request->city,
            'state' => $request->state,
            'postal_code' => $request->postal_code,
            'country' => $request->country,
        ], $user);

        // Send welcome notification to the new reseller
        $this->notificationService->sendWelcomeNotification($reseller->resource, $user);

        // Notify admin about new reseller registration
        $this->notificationService->notifyAdminAboutNewReseller($reseller->resource);

        Auth::login($user);
        return new ResellerResource($reseller);
    }

    /**
     * Create a reseller
     *
     * @param array $resellerData
     * @param User|null $user
     * @return ResellerResource
     */
    public function createReseller(array $resellerData, ?User $user = null): ResellerResource
    {
        $resellerData = array_merge([
            'status' => ResellerStatus::PENDING->value,
            'verification_status' => ResellerVerificationStatus::PENDING->value,
        ], $resellerData);

        $reseller = Reseller::create($resellerData);

        if ($user) {
            $user->reseller_id = $reseller->id;
            $user->save();
        }

        return new ResellerResource($reseller);
    }

    /**
     * Update a reseller's status
     *
     * @param Reseller $reseller
     * @param ResellerStatus $status
     * @return ResellerResource
     */
    public function updateStatus(Reseller $reseller, ResellerStatus $status): ResellerResource
    {
        $oldStatus = $reseller->status;
        $reseller->status = $status->value;
        $reseller->save();

        // Notify reseller about status change
        $this->notificationService->notifyStatusChange($reseller, $oldStatus, $status->value);

        return new ResellerResource($reseller);
    }

    /**
     * Activate a reseller
     *
     * @param Reseller $reseller
     * @return ResellerResource
     */
    public function activate(Reseller $reseller): ResellerResource
    {
        $result = $this->updateStatus($reseller, ResellerStatus::ACTIVE);

        // Send activation notification
        $this->notificationService->sendActivationNotification($reseller);

        return $result;
    }

    /**
     * Suspend a reseller
     *
     * @param Reseller $reseller
     * @param string|null $reason
     * @return ResellerResource
     */
    public function suspend(Reseller $reseller, ?string $reason = null): ResellerResource
    {
        $result = $this->updateStatus($reseller, ResellerStatus::SUSPENDED);

        // Send suspension notification with reason
        $this->notificationService->sendSuspensionNotification($reseller, $reason);

        return $result;
    }

    /**
     * Archive a reseller
     *
     * @param Reseller $reseller
     * @return ResellerResource
     */
    public function archive(Reseller $reseller): ResellerResource
    {
        $result = $this->updateStatus($reseller, ResellerStatus::ARCHIVED);

        // Send archival notification
        $this->notificationService->sendArchivalNotification($reseller);

        return $result;
    }

    /**
     * Update a reseller's verification status
     *
     * @param Reseller $reseller
     * @param ResellerVerificationStatus $verificationStatus
     * @return ResellerResource
     */
    public function updateVerificationStatus(Reseller $reseller, ResellerVerificationStatus $verificationStatus): ResellerResource
    {
        $oldStatus = $reseller->verification_status;
        $reseller->verification_status = $verificationStatus->value;
        $reseller->save();

        // Notify about verification status change
        $this->notificationService->notifyVerificationStatusChange($reseller, $oldStatus, $verificationStatus->value);

        return new ResellerResource($reseller);
    }

    /**
     * Mark a reseller as verified
     *
     * @param Reseller $reseller
     * @return ResellerResource
     */
    public function verify(Reseller $reseller): ResellerResource
    {
        // When verified, also activate the reseller
        $reseller->status = ResellerStatus::ACTIVE->value;
        $reseller->verification_status = ResellerVerificationStatus::VERIFIED->value;
        $reseller->save();

        // Send verification approved notification
        $this->notificationService->sendVerificationApprovedNotification($reseller);

        return new ResellerResource($reseller);
    }

    /**
     * Reject a reseller's verification
     *
     * @param Reseller $reseller
     * @param string|null $reason
     * @return ResellerResource
     */
    public function rejectVerification(Reseller $reseller, ?string $reason = null): ResellerResource
    {
        $reseller->verification_status = ResellerVerificationStatus::REJECTED->value;
        if ($reason) {
            $reseller->rejection_reason = $reason;
        }
        $reseller->save();

        // Send verification rejected notification with reason
        $this->notificationService->sendVerificationRejectedNotification($reseller, $reason);

        return new ResellerResource($reseller);
    }
}
