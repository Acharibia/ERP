<?php

namespace App\Investors\Services;

use App\Investors\Http\Requests\StoreInvestorRequest;
use App\Central\Models\Investor;
use App\Central\Models\User;
use App\Support\Enums\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class InvestorService
{
    /**
     * Register a new investor
     *
     * @param StoreInvestorRequest $request
     * @return array
     */
    public function register(StoreInvestorRequest $request): array
    {
        try {
            return DB::transaction(function () use ($request) {
                // Create user
                $user = User::create([
                    'name' => $request->name,
                    'email' => $request->email,
                    'password' => Hash::make($request->password),
                    'user_type' => UserType::INVESTOR,
                ]);

                event(new Registered($user));

                // Create investor record
                $investor = Investor::create([
                    'user_id' => $user->id,
                    'type' => $request->type,
                    'name' => $request->name,
                    'company_name' => $request->company_name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'city' => $request->city,
                    'state' => $request->state,
                    'postal_code' => $request->postal_code,
                    'country' => $request->country,
                    'tax_id' => $request->tax_id,
                    'accreditation_status' => 'pending',
                    'status' => 'active',
                    'notes' => $request->notes,
                ]);

                // Login user
                Auth::login($user);

                return [
                    'success' => true,
                    'user' => $user,
                    'investor' => $investor
                ];
            });
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'Registration failed: ' . $e->getMessage()
            ];
        }
    }
}
