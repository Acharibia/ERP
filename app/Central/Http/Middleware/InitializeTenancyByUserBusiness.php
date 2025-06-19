<?php

namespace App\Central\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Stancl\Tenancy\Tenancy;
use App\Central\Models\Tenant;

class InitializeTenancyByUserBusiness
{
    protected $tenancy;

    public function __construct(Tenancy $tenancy)
    {
        $this->tenancy = $tenancy;
    }

    public function handle(Request $request, Closure $next)
    {
        if ($this->tenancy->initialized) {
            return $next($request);
        }

        $user = $request->user();
        if (!$user) {
            return $this->handleFailure($request, $next, 'User not authenticated');
        }

        $activeBusiness = $request->session()->get('active_business');
        if (!$activeBusiness || !isset($activeBusiness->tenant_id)) {
            return $this->handleFailure($request, $next, 'No active business selected');
        }

        // Find tenant by ID and initialize
        $tenant = Tenant::find($activeBusiness->tenant_id);
        if (!$tenant) {
            return $this->handleFailure($request, $next, 'Business configuration error');
        }

        $this->tenancy->initialize($tenant);

        return $next($request);
    }

    protected function handleFailure(Request $request, Closure $next, string $reason)
    {
        if ($request->expectsJson()) {
            return response()->json([
                'error' => 'Business context required',
                'message' => 'Please select a business to continue.'
            ], 422);
        }

        return redirect()->route('business.selection')
            ->withErrors(['business' => 'Please select a business to continue.']);
    }
}
