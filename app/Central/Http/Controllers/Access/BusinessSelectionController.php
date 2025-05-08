<?php

namespace App\Central\Http\Controllers\Access;

use App\Central\Http\Controllers\Controller;
use App\Central\Models\Business;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BusinessSelectionController extends Controller
{
    /**
     * Show the business selection page.
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // Get all businesses the user has access to
        $businesses = $user->businesses;

        return Inertia::render('shared/business-selection', [
            'businesses' => $businesses
        ]);
    }

    /**
     * Select a business and redirect to the access selection page.
     */
    public function select(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'business_id' => ['required', 'exists:businesses,id'],
        ]);

        $businessId = $validated['business_id'];
        $user = $request->user();

        // Check if the user has access to this business
        $hasAccess = $user->businesses()->where('businesses.id', $businessId)->exists();

        if (!$hasAccess) {
            abort(403, 'You do not have access to this business.');
        }

        // Fetch the full business with its subscription
        $business = Business::with([
            'subscription.package.modules' => function ($query) {
                $query->where('modules.status', 'active');
            }
        ])->findOrFail($businessId);

        // Set the active business in session
        $request->session()->put('active_business', $business);

        // Store available modules if subscription exists
        if ($business->subscription) {
            $request->session()->put('available_modules', $business->subscription->package->modules);
        }

        $request->session()->forget(['active_access_type', 'active_module_code']);

        return redirect()->route('access.selection');
    }
}
