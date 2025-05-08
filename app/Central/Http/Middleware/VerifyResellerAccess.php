<?php

namespace App\Central\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerifyResellerAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || !$user->hasResellerAccess()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            // Direct to login if not logged in, or to access selection if no reseller access
            return $user ? redirect()->route('access.selection') : redirect()->route('login');
        }

        // Check if active_access_type is reseller
        if ($request->session()->get('active_access_type') !== 'reseller') {
            // For users with reseller type but no active_access_type set, update it
            if ($user->user_type === 'reseller') {
                $request->session()->put('active_access_type', 'reseller');
            } else {
                return redirect()->route('access.selection');
            }
        }

        return $next($request);
    }
}
