<?php

namespace App\Admin\Services;

use App\Models\Shared\Reseller;
use App\Models\Shared\User;
use Illuminate\Support\Facades\Hash;

class ResellerService
{
    public function getResellers($search = null, $status = null, $sortField = 'created_at', $sortDirection = 'desc', $perPage = 10)
    {
        $query = Reseller::query()
            ->withCount(['businesses', 'users'])
            ->with('users:id,name,email,reseller_id');

        if ($search) {
            $query->where(function ($query) use ($search) {
                $query->where('company_name', 'like', "%{$search}%")
                    ->orWhere('contact_name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        $query->orderBy($sortField, $sortDirection);

        return $query->paginate($perPage)->withQueryString();
    }

    public function createReseller(array $data)
    {
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
        $user = User::create([
            'name' => $data['user']['name'],
            'email' => $data['user']['email'],
            'password' => Hash::make($data['user']['password']),
            'user_type' => 'reseller',
            'reseller_id' => $reseller->id,
            'status' => 'active',
        ]);
        $user->assignRole('reseller_admin');
        return $reseller;
    }

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

        return $reseller;
    }

    public function deleteReseller(Reseller $reseller)
    {
        $reseller->users()->delete();
        $reseller->businesses()->delete();
        return $reseller->delete();
    }
}
