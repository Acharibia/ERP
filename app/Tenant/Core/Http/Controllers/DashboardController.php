<?php

namespace App\Tenant\Core\Http\Controllers;
use App\Central\Http\Controllers\Controller;
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

        return Inertia::render('modules/core/dashboard');
    }
}
