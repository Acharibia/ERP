<?php

namespace App\Auth\Http\Controllers;

use App\Shared\Http\Controllers\Controller;
use App\Shared\Models\Business;
use App\Shared\Models\Investor;
use App\Shared\Models\Reseller;
use App\Shared\Models\User;
use App\Support\Enums\UserType;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the user type selection page.
     */
    public function showTypeSelection(): Response
    {
        return Inertia::render('auth/user-type-selection');
    }

    /**
     * Show the registration page for resellers.
     */
    public function createReseller(): Response
    {
        return Inertia::render('auth/register-reseller');
    }

    /**
     * Show the registration page for businesses.
     */
    public function createBusiness(): Response
    {
        return Inertia::render('auth/register-business');
    }

    /**
     * Show the registration page for investors.
     */
    public function createInvestor(): Response
    {
        return Inertia::render('auth/register-investor');
    }

    /**
     * Handle reseller registration.
     */
    public function storeReseller(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'company_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:50',
        ]);


        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => UserType::RESELLER,
            ]);

            $reseller = Reseller::create([
                'company_name' => $request->company_name,
                'contact_name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'status' => 'pending',
                'verification_status' => 'pending',
            ]);

            $user->reseller_id = $reseller->id;
            $user->save();


            event(new Registered($user));
            Auth::login($user);

            return to_route('reseller.dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Registration failed. Please try again.']);
        }
    }

    /**
     * Handle business registration.
     */
    public function storeBusiness(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'business_name' => 'required|string|max:255',
            'industry' => 'nullable|string|max:100',
        ]);


        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => UserType::BUSINESS_USER,
            ]);

            // Create a business record
            $business = Business::create([
                'name' => $request->business_name,
                'tenant_id' => 'business_' . strtolower(str_replace(' ', '_', $request->business_name)) . '_' . uniqid(),
                'schema_version' => '1.0',
                'settings' => json_encode([
                    'industry' => $request->industry,
                ]),
                'subscription_status' => 'trial',
            ]);

            // Associate user with business
            DB::table('user_businesses')->insert([
                'user_id' => $user->id,
                'business_id' => $business->id,
                'is_primary' => true,
                'is_business_admin' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ]);


            event(new Registered($user));
            Auth::login($user);

            return to_route('business.dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Registration failed. Please try again.']);
        }
    }

    /**
     * Handle investor registration.
     */
    public function storeInvestor(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'investor_type' => 'required|string|exists:investor_types,code',
        ]);


        try {
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'user_type' => UserType::INVESTOR,
            ]);

            // Create investor record
            $investor = Investor::create([
                'user_id' => $user->id,
                'type_id' => $request->investor_type,
                'status' => 'active',
            ]);

            // Create investor profile
            InvestorProfile::create([
                'investor_id' => $investor->id,
                'display_name' => $request->name,
            ]);


            event(new Registered($user));
            Auth::login($user);

            return to_route('investor.dashboard');
        } catch (\Exception $e) {
            return back()->withErrors(['general' => 'Registration failed. Please try again.']);
        }
    }
}
