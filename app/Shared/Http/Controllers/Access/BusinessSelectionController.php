<?php

namespace App\Shared\Http\Controllers\Access;

use App\Shared\Http\Controllers\Controller;
use App\Models\Shared\Business;
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

        // Set the active business in session
        $request->session()->put('active_business_id', $businessId);

        // Clear any previously selected access type or module
        $request->session()->forget(['active_access_type', 'active_module_code']);

        // Redirect to access selection (which module or view to use)
        return redirect()->route('access.selection');
    }
}
