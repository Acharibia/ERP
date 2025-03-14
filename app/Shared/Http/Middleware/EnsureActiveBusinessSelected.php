<?php

namespace App\Shared\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureActiveBusinessSelected
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if ($request->user() && !$request->session()->has('active_business_id')) {
            return redirect()->route('business.selection');
        }

        return $next($request);
    }
}
