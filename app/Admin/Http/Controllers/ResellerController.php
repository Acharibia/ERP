<?php

namespace App\Admin\Http\Controllers;

use App\Admin\Requests\ResellerStoreRequest;
use App\Admin\Requests\ResellerUpdateRequest;
use App\Admin\Services\ResellerService;
use App\Http\Controllers\Controller;
use App\Models\Shared\Reseller;
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
        // Return the create form
        return Inertia::render('admin/resellers/create');
    }

    /**
     * Store a newly created reseller in storage.
     *
     * @param  \App\Admin\Requests\ResellerStoreRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(ResellerStoreRequest $request)
    {
        // Create reseller using service
        $reseller = $this->resellerService->createReseller($request->validated());

        // Flash notification for success
        session()->flash('notification', [
            'type' => 'success',
            'message' => 'Reseller created successfully!'
        ]);

        // Redirect to the reseller's detail page
        return redirect()->route('admin.resellers.show', $reseller->id);
    }

    /**
     * Display the specified reseller.
     *
     * @param \App\Models\Shared\Reseller $reseller
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

        // Get counts and stats
        $stats = $this->resellerService->getResellerStats($reseller);

        // Return the view with data
        return Inertia::render('Admin/Resellers/Show', [
            'reseller' => $reseller,
            'stats' => $stats,
        ]);
    }

    /**
     * Show the form for editing the specified reseller.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Inertia\Response
     */
    public function edit(Reseller $reseller)
    {
        // Return the edit form
        return Inertia::render('Admin/Resellers/Edit', [
            'reseller' => $reseller
        ]);
    }

    /**
     * Update the specified reseller in storage.
     *
     * @param  \App\Admin\Requests\ResellerUpdateRequest  $request
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(ResellerUpdateRequest $request, Reseller $reseller)
    {
        // Update the reseller using service
        $this->resellerService->updateReseller($reseller, $request->validated());

        // Flash notification for success
        session()->flash('notification', [
            'type' => 'success',
            'message' => 'Reseller updated successfully!'
        ]);

        // Redirect back to the same page
        return redirect()->back();
    }

    /**
     * Remove the specified reseller from storage.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Reseller $reseller)
    {
        // Check if reseller has active businesses
        if ($reseller->businesses()->where('subscription_status', 'active')->exists()) {
            return redirect()->back()->with('notification', [
                'type' => 'error',
                'message' => 'Cannot delete reseller with active businesses!'
            ]);
        }

        // Delete the reseller
        $this->resellerService->deleteReseller($reseller);

        // Flash notification for success
        session()->flash('notification', [
            'type' => 'success',
            'message' => 'Reseller deleted successfully!'
        ]);

        // Redirect to resellers list
        return redirect()->route('admin.resellers.index');
    }

    /**
     * Toggle the status of the reseller.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function toggleStatus(Reseller $reseller)
    {
        // Toggle the status
        $newStatus = $reseller->status === 'active' ? 'suspended' : 'active';
        $this->resellerService->updateResellerStatus($reseller, $newStatus);

        // Flash notification
        $message = $newStatus === 'active'
            ? 'Reseller has been activated!'
            : 'Reseller has been suspended!';

        session()->flash('notification', [
            'type' => 'success',
            'message' => $message
        ]);

        // Redirect back
        return redirect()->back();
    }

    /**
     * Show reseller verification page.
     *
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Inertia\Response
     */
    public function verification(Reseller $reseller)
    {
        return Inertia::render('Admin/Resellers/Verification', [
            'reseller' => $reseller->load('verificationDocuments')
        ]);
    }

    /**
     * Approve or reject reseller verification.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param \App\Models\Shared\Reseller $reseller
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verificationAction(Request $request, Reseller $reseller)
    {
        $request->validate([
            'action' => 'required|in:approve,reject',
            'rejection_reason' => 'required_if:action,reject|nullable|string|max:500',
        ]);

        $action = $request->input('action');
        $reason = $request->input('rejection_reason');

        if ($action === 'approve') {
            $this->resellerService->approveResellerVerification($reseller);
            $message = 'Reseller verification approved!';
        } else {
            $this->resellerService->rejectResellerVerification($reseller, $reason);
            $message = 'Reseller verification rejected.';
        }

        session()->flash('notification', [
            'type' => 'success',
            'message' => $message
        ]);

        return redirect()->route('admin.resellers.show', $reseller);
    }
}