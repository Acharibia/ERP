<?php

namespace App\Admin\Services;

use App\Models\Shared\Reseller;
use App\Models\Shared\User;
use App\Models\Shared\Business;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ResellerService
{
    /**
     * Get resellers with filters and pagination.
     *
     * @param string|null $search
     * @param string|null $status
     * @param string $sortField
     * @param string $sortDirection
     * @param int $perPage
     * @return \Illuminate\Contracts\Pagination\LengthAwarePaginator
     */
    public function getResellers($search = null, $status = null, $sortField = 'created_at', $sortDirection = 'desc', $perPage = 10)
    {
        $query = Reseller::query()
            ->withCount(['businesses', 'users'])
            ->with('users:id,name,email,reseller_id');

        // Apply search filter
        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('company_name', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status) {
            $query->where('status', $status);
        }

        // Apply sorting
        $query->orderBy($sortField, $sortDirection);

        // Return paginated results
        return $query->paginate($perPage)->withQueryString();
    }

    /**
     * Create a new reseller.
     *
     * @param array $data
     * @return \App\Models\Shared\Reseller
     */
    public function createReseller(array $data)
    {
        return DB::transaction(function () use ($data) {
            // Create the reseller
            $reseller = Reseller::create([
                'company_name' => $data['company_name'],
                'contact_name' => $data['contact_name'],
                'email' => $data['email'],
                'phone' => $data['phone'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'postal_code' => $data['postal_code'] ?? null,
                'country' => $data['country'] ?? null,
                'status' => $data['status'],
                'verification_status' => $data['verification_status'],
                'commission_rate' => $data['commission_rate'] ?? 0.00,
            ]);

            // Create reseller admin user
            $user = User::create([
                'name' => $data['user']['name'],
                'email' => $data['user']['email'],
                'password' => Hash::make($data['user']['password']),
                'user_type' => 'reseller',
                'reseller_id' => $reseller->id,
                'status' => 'active',
            ]);

            // Assign reseller admin role
            $user->assignRole('reseller_admin');

            // Create reseller settings with default values
            $reseller->settings()->create([
                'logo_url' => null,
                'primary_color' => '#4f46e5',
                'secondary_color' => '#0ea5e9',
                'custom_domain' => null,
                'support_email' => $data['email'],
                'support_phone' => $data['phone'] ?? null,
                'footer_text' => 'Powered by ' . config('app.name'),
                'login_page_message' => 'Welcome to ' . $data['company_name'],
            ]);

            // Return the created reseller
            return $reseller;
        });
    }

    /**
     * Update an existing reseller.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @param array $data
     * @return \App\Models\Shared\Reseller
     */
    public function updateReseller(Reseller $reseller, array $data)
    {
        $reseller->update([
            'company_name' => $data['company_name'],
            'contact_name' => $data['contact_name'],
            'email' => $data['email'],
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'postal_code' => $data['postal_code'] ?? null,
            'country' => $data['country'] ?? null,
            'status' => $data['status'],
            'verification_status' => $data['verification_status'],
            'commission_rate' => $data['commission_rate'] ?? $reseller->commission_rate,
        ]);

        // If default support email/phone changed, update in settings
        if ($reseller->settings) {
            $settingsUpdated = false;
            $settingsData = [];

            if ($reseller->email !== $data['email'] && $reseller->settings->support_email === $reseller->getOriginal('email')) {
                $settingsData['support_email'] = $data['email'];
                $settingsUpdated = true;
            }

            if (isset($data['phone']) && $reseller->phone !== $data['phone'] && $reseller->settings->support_phone === $reseller->getOriginal('phone')) {
                $settingsData['support_phone'] = $data['phone'];
                $settingsUpdated = true;
            }

            if ($settingsUpdated) {
                $reseller->settings->update($settingsData);
            }
        }

        return $reseller;
    }

    /**
     * Delete a reseller.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return bool|null
     */
    public function deleteReseller(Reseller $reseller)
    {
        return DB::transaction(function () use ($reseller) {
            // Delete associated users
            $reseller->users()->delete();

            // Delete associated businesses
            $reseller->businesses()->delete();

            // Delete reseller settings
            if ($reseller->settings) {
                $reseller->settings->delete();
            }

            // Delete the reseller
            return $reseller->delete();
        });
    }

    /**
     * Update reseller status.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @param string $status
     * @return \App\Models\Shared\Reseller
     */
    public function updateResellerStatus(Reseller $reseller, string $status)
    {
        $reseller->update(['status' => $status]);

        // If reseller is suspended, suspend all associated users
        if ($status === 'suspended') {
            $reseller->users()->update(['status' => 'suspended']);
        } elseif ($status === 'active') {
            // If reseller is activated, reactivate primary user
            $reseller->users()->where('user_type', 'reseller')->update(['status' => 'active']);
        }

        return $reseller;
    }

    /**
     * Approve reseller verification.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return \App\Models\Shared\Reseller
     */
    public function approveResellerVerification(Reseller $reseller)
    {
        $reseller->update([
            'verification_status' => 'verified',
            'status' => 'active',
        ]);

        // Notify the reseller
        // $reseller->notify(new ResellerVerificationApproved());

        return $reseller;
    }

    /**
     * Reject reseller verification.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @param string|null $reason
     * @return \App\Models\Shared\Reseller
     */
    public function rejectResellerVerification(Reseller $reseller, ?string $reason = null)
    {
        $reseller->update([
            'verification_status' => 'rejected',
        ]);

        // Store rejection reason
        $reseller->verificationRejects()->create([
            'reason' => $reason,
            'admin_id' => auth()->id(),
        ]);

        // Notify the reseller
        // $reseller->notify(new ResellerVerificationRejected($reason));

        return $reseller;
    }

    /**
     * Get reseller statistics.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return array
     */
    public function getResellerStats(Reseller $reseller)
    {
        // Count businesses by status
        $businessesByStatus = Business::where('reseller_id', $reseller->id)
            ->select('subscription_status', DB::raw('count(*) as total'))
            ->groupBy('subscription_status')
            ->pluck('total', 'subscription_status')
            ->toArray();

        // Calculate monthly recurring revenue
        $mrr = Business::where('reseller_id', $reseller->id)
            ->whereHas('subscription', function ($query) {
                $query->where('status', 'active');
            })
            ->join('subscriptions', 'businesses.id', '=', 'subscriptions.business_id')
            ->select(DB::raw('SUM(COALESCE(price_override, (SELECT base_price FROM packages WHERE id = subscriptions.package_id))) as total_mrr'))
            ->first()
            ->total_mrr ?? 0;

        // Get total commission for current month
        $currentMonthCommission = DB::table('invoices')
            ->where('reseller_id', $reseller->id)
            ->whereMonth('issue_date', now()->month)
            ->whereYear('issue_date', now()->year)
            ->where('status', 'paid')
            ->sum(DB::raw('total_amount * ' . ($reseller->commission_rate / 100)));

        // Get monthly commission trend for last 6 months
        $commissionTrend = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $commission = DB::table('invoices')
                ->where('reseller_id', $reseller->id)
                ->whereMonth('issue_date', $month->month)
                ->whereYear('issue_date', $month->year)
                ->where('status', 'paid')
                ->sum(DB::raw('total_amount * ' . ($reseller->commission_rate / 100)));

            $commissionTrend[] = [
                'month' => $month->format('M Y'),
                'amount' => $commission,
            ];
        }

        return [
            'total_businesses' => $reseller->businesses()->count(),
            'active_businesses' => $businessesByStatus['active'] ?? 0,
            'trial_businesses' => $businessesByStatus['trial'] ?? 0,
            'suspended_businesses' => $businessesByStatus['suspended'] ?? 0,
            'total_users' => $reseller->users()->count(),
            'monthly_recurring_revenue' => $mrr,
            'current_month_commission' => $currentMonthCommission,
            'commission_trend' => $commissionTrend,
        ];
    }
}