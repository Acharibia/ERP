<?php

namespace App\Shared\Http\Middleware;

use App\Models\Shared\Module;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerifyModuleAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();
        $businessId = $request->session()->get('active_business_id');

        if (!$user || !$businessId) {
            return redirect()->route('login');
        }

        // Check if active_access_type is module
        if ($request->session()->get('active_access_type') !== 'module') {
            return redirect()->route('access.selection');
        }

        // Get the module code from the route
        $moduleCode = $request->route()->parameter('module') ??
            explode('.', $request->route()->getName())[1] ?? null;

        // Verify this matches the active module in session
        $activeModuleCode = $request->session()->get('active_module_code');

        if (!$moduleCode || $moduleCode !== $activeModuleCode) {
            return redirect()->route('access.selection');
        }

        // Find the module
        $module = Module::where('code', $moduleCode)->first();

        if (!$module) {
            return redirect()->route('access.selection');
        }

        // Check if user can access this module for the active business
        if (!$user->canAccessModule($module->id, $businessId)) {
            return redirect()->route('access.selection');
        }

        return $next($request);
    }
}
