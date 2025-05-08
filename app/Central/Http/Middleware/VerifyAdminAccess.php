<?php

namespace App\Central\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class VerifyAdminAccess
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        if (!$user || !$user->hasAdminAccess()) {
            if ($request->wantsJson()) {
                return response()->json(['error' => 'Unauthorized'], 403);
            }

            return redirect()->route('access.selection');
        }

        // Check if active_access_type is admin
        if ($request->session()->get('active_access_type') !== 'admin') {
            return redirect()->route('access.selection');
        }

        return $next($request);
    }
}
