<?php

namespace App\Admin\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusinessController extends Controller
{

    /**
     * Display a listing of resellers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/businesses/index');
    }

    /**
     * Show the form for creating a new reseller.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/businesses/create');
    }
}
