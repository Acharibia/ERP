<?php

namespace App\Tenant\Modules\HR\Http\Controllers;
use App\Central\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmployeeController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index(Request $request): Response
    {
        return Inertia::render('modules/hr/employees/index');
    }
}
