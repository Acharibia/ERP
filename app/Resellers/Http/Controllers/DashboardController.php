<?php

namespace App\Resellers\Http\Controllers;

use App\Shared\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('reseller/dashboard');
    }
}
