<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Show the login page.
     */
    public function create(Request $request): Response
    {
        return Inertia::render('auth/login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        // Get the authenticated user
        $user = Auth::user();

        // Check if user is a reseller with no businesses (direct reseller access)
        if ($user->hasResellerAccess()) {
            // Set the access type to reseller
            $request->session()->put('active_access_type', 'reseller');

            // Redirect directly to the reseller dashboard
            return redirect()->route('reseller.dashboard');
        }

        // Check if user is a system admin with admin access
        if ($user->hasAdminAccess()) {
            // Set the access type to admin
            $request->session()->put('active_access_type', 'admin');

            // Redirect directly to the admin dashboard
            return redirect()->route('admin.dashboard');
        }

        // Get the businesses the user belongs to
        $businesses = $user->businesses;

        if ($businesses->count() === 0) {
            // If user has no businesses and is not already handled (reseller/admin), redirect to "no access" page
            return redirect()->route('no.access');
        } elseif ($businesses->count() === 1) {
            // If user has just one business, set it as the active business
            $business = $businesses->first();
            $request->session()->put('active_business_id', $business->id);

            // Redirect to the access selection page
            return redirect()->route('access.selection');
        } else {
            // If user has multiple businesses, redirect to business selection page
            return redirect()->route('business.selection');
        }
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
