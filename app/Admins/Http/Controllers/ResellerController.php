<?php

namespace App\Admins\Http\Controllers;

use App\Admins\Http\Requests\ResellerStoreRequest;
use App\Admins\Http\Requests\ResellerUpdateRequest;
use App\Admins\Services\ResellerService;
use App\Shared\Http\Controllers\Controller;
use App\Shared\Models\Reseller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ResellerController extends Controller
{
    protected $resellerService;

    public function __construct(ResellerService $resellerService)
    {
        $this->resellerService = $resellerService;
    }

    /**
     * Display a listing of resellers.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        return Inertia::render('admin/resellers/index');
    }

    /**
     * Show the form for creating a new reseller.
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('admin/resellers/create');
    }

    /**
     * Store a newly created reseller in storage.
     *
     * @param  \App\Admins\Http\Requests\ResellerStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ResellerStoreRequest $request)
    {
        $reseller = $this->resellerService->createReseller($request->validated());

        return redirect()->route('admin.resellers.show', $reseller->id);
    }

    /**
     * Display the specified reseller.
     *
     * @param \App\Shared\Models\Reseller $reseller
     * @return \Inertia\Response
     */
    public function show(Reseller $reseller)
    {
        // Load relationships
        $reseller->load([
            'clients' => function ($query) {
                $query->withCount('users')->latest()->take(5);
            },
            'users' => function ($query) {
                $query->latest()->take(5);
            }
        ]);

        // Return the view with data
        return Inertia::render('admin/resellers/show', [
            'reseller' => $reseller,
        ]);
    }

    /**
     * Show the form for editing the specified reseller.
     *
     * @param \App\Shared\Models\Reseller $reseller
     * @return \Inertia\Response
     */
    public function edit(Reseller $reseller)
    {
        // Return the edit form
        return Inertia::render('admin/resellers/edit', [
            'reseller' => $reseller
        ]);
    }

    /**
     * Update the specified reseller in storage.
     *
     * @param  \App\Admins\Http\Requests\ResellerUpdateRequest  $request
     * @param \App\Shared\Models\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ResellerUpdateRequest $request, Reseller $reseller)
    {
        $this->resellerService->updateReseller($reseller, $request->validated());

        // Redirect back to the same page
        return redirect()->back();
    }

    /**
     * Remove the specified reseller from storage.
     *
     * @param \App\Shared\Models\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Reseller $reseller)
    {
        if ($reseller->businesses()->where('subscription_status', 'active')->exists()) {
            return redirect()->back()->with('notification', [
                'type' => 'error',
                'message' => 'Cannot delete reseller with active businesses!'
            ]);
        }
        $this->resellerService->deleteReseller($reseller);
        return redirect()->route('admin.resellers.index');
    }
}
