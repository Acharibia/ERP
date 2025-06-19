<?php

namespace App\Auth\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BusinessSwitchController extends Controller
{
    public function switch(Request $request)
    {
        $request->validate([
            'business_id' => 'required|exists:businesses,id'
        ]);

        $user = $request->user();

        if ($user->switchToBusiness($request->business_id)) {
            $business = $user->businesses()->with(['subscription.package.modules'])->find($request->business_id);
            if ($business && $business->subscription) {
                $request->session()->put('available_modules', $business->subscription->package->modules);
            }

            return back()->with('success', 'Business switched successfully.');
        }

        return back()->withErrors(['business_id' => 'Invalid business selection.']);
    }
}
