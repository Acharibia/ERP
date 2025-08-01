<?php
namespace App\Auth\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Central\Models\Business;
use App\Central\Models\Module;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AccessSelectionController extends Controller
{
    /**
     * Show the access selection page.
     */
    public function index(Request $request)
    {
        $user           = $request->user();
        $activeBusiness = $request->session()->get('active_business');

        if (! $activeBusiness || ! isset($activeBusiness->id)) {
            return redirect()->route('business.selection');
        }

        $businessId = $activeBusiness->id;

        $business = Business::with([
            'subscription.package.modules' => function ($query) {
                $query->where('modules.status', 'active');
            },
        ])->findOrFail($businessId);

        // Check if user has access to this business
        abort_unless($user->hasBusinessAccess($businessId), 403);

        // Determine available access types for this user and business
        $accessTypes = [];

        // Admin access
        if ($user->hasAdminAccess()) {
            $accessTypes[] = [
                'type'        => 'admin',
                'name'        => 'Admin Dashboard',
                'description' => 'Manage system-wide settings and configuration',
                'route'       => 'admin.dashboard',
            ];
        }

        // Reseller access
        if ($user->hasResellerAccess()) {
            $accessTypes[] = [
                'type'        => 'reseller',
                'name'        => 'Reseller Dashboard',
                'description' => 'Manage your client businesses and subscriptions',
                'route'       => 'reseller.dashboard',
            ];
        }

        if ($business->subscription) {
            $modules = $business->subscription->package->modules;

            if (! $user->isBusinessAdmin($business)) {
                $modules = $modules->filter(function ($module) use ($user, $business) {
                    return $user->canAccessModule($business, $module->code);
                });
            }

            $moduleAccessTypes = $modules->map(function ($module) {
                return [
                    'type'        => 'module',
                    'id'          => $module->id,
                    'code'        => $module->code,
                    'name'        => $module->name,
                    'description' => $module->description,
                    'icon'        => $module->icon_url,
                    'route'       => 'modules.' . $module->code . '.dashboard',
                ];
            })->values()->toArray();

            $accessTypes = array_merge($accessTypes, $moduleAccessTypes);
        }

        return Inertia::render('shared/access-selection', [
            'business'    => $business,
            'accessTypes' => $accessTypes,
        ]);
    }

    /**
     * Set the access type and redirect to appropriate dashboard.
     */
    public function select(Request $request): RedirectResponse
    {
        $user           = $request->user();
        $activeBusiness = $request->session()->get('active_business');
        $businessId     = $activeBusiness->id;
        $business       = Business::findOrFail($businessId);

        // Check if user has access to this business
        abort_unless($user->hasBusinessAccess($businessId), 403);

        // Validate request
        $validated = $request->validate([
            'access_type' => ['required', 'string', 'in:admin,reseller,module'],
            'module_id'   => ['nullable', 'required_if:access_type,module', 'exists:modules,id'],
        ]);

        $accessType = $validated['access_type'];

        // Check permissions for access type
        if ($accessType === 'admin' && ! $user->hasAdminAccess()) {
            abort(403);
        }

        if ($accessType === 'reseller' && ! $user->hasResellerAccess()) {
            abort(403);
        }

        // Set the active access type in session
        $request->session()->put('active_access_type', $accessType);

        // Handle module access
        if ($accessType === 'module') {
            $moduleId = $validated['module_id'];
            $module   = Module::findOrFail($moduleId);

            // Check if module is available through subscription
            if ($business->subscription) {
                $moduleAvailable = $business->subscription->package->modules()
                    ->where('modules.id', $moduleId)
                    ->exists();

                abort_unless($moduleAvailable, 403);
            } else {
                abort(403, 'Business has no active subscription');
            }

            // Check if user has permission (if not admin)
            if (! $user->isBusinessAdmin($business) && ! $user->canAccessModule($business, $module->code)) {
                abort(403);
            }

            $request->session()->put('active_module_code', $module->code);
            return redirect()->route('modules.' . $module->code . '.dashboard');
        }

        // Redirect to appropriate dashboard
        return redirect()->route($accessType . '.dashboard');
    }
}
