<?php

namespace App\Auth\Http\Controllers;

use App\Businesses\Http\Requests\StoreBusinessRequest;
use App\Businesses\Services\BusinessService;
use App\Investos\Http\Requests\StoreInvestorRequest;
use App\Investors\Services\InvestorService;
use App\Resellers\Http\Requests\StoreResellerRequest;
use App\Resellers\Services\ResellerService;
use App\Central\Http\Controllers\Controller;
use App\Central\Http\Resources\PackageCollection;
use App\Central\Models\Package;
use App\Central\Services\CountryService;
use App\Central\Services\GenderService;
use App\Central\Services\IndustryService;
use App\Central\Services\PackageService;
use App\Central\Services\StateService;
use App\Central\Services\TitleService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    protected ResellerService $resellerService;
    protected BusinessService $businessService;
    protected InvestorService $investorService;
    protected PackageService $packageService;
    protected StateService $stateService;
    protected TitleService $titleService;
    protected CountryService $countryService;
    protected GenderService $genderService;
    protected IndustryService $industryService;

    /**
     * Create a new RegisteredUserController instance.
     *
     * @param ResellerService $resellerService
     * @param BusinessService $businessService
     * @param PackageService $packageService
     * @param InvestorService $investorService
     * @param StateService $stateService
     * @param TitleService $titleService
     * @param CountryService $countryService
     * @param GenderService $genderService
     * @param IndustryService $industryService
     */
    public function __construct(
        ResellerService $resellerService,
        BusinessService $businessService,
        InvestorService $investorService,
        PackageService $packageService,
        StateService $stateService,
        TitleService $titleService,
        CountryService $countryService,
        GenderService $genderService,
        IndustryService $industryService,
    ) {
        $this->resellerService = $resellerService;
        $this->businessService = $businessService;
        $this->investorService = $investorService;
        $this->packageService = $packageService;
        $this->stateService = $stateService;
        $this->titleService = $titleService;
        $this->countryService = $countryService;
        $this->genderService = $genderService;
        $this->industryService = $industryService;
    }

    /**
     * Show the user type selection page.
     */
    public function showTypeSelection(): Response
    {
        return Inertia::render('auth/user-type-selection');
    }

    /**
     * Show the registration page for resellers.
     */
    public function createReseller(): Response
    {
        return Inertia::render('auth/register-reseller');
    }

    /**
     * Show the registration page for businesses.
     */
    public function createBusiness(): Response
    {
        return Inertia::render('auth/register-business', [
            'countries' => $this->countryService->getAll(),
            'states' => $this->stateService->getAll(),
            'titles' => $this->titleService->getAll(),
            'genders' => $this->genderService->getAll(),
            'industries' => $this->industryService->getAll(true),
            'packages' => new PackageCollection($this->packageService->getPublicPackages()),
        ]);
    }

    /**
     * Show the registration page for investors.
     */
    public function createInvestor(): Response
    {
        return Inertia::render('auth/register-investor');
    }

    /**
     * Handle reseller registration.
     */
    public function storeReseller(StoreResellerRequest $request): RedirectResponse
    {
        $this->resellerService->register($request);
        return to_route('reseller.dashboard');
    }

    /**
     * Handle business registration.
     */
    public function storeBusiness(StoreBusinessRequest $request): RedirectResponse
    {
        // Check if this is just validation or final submission
        $validateOnly = $request->query('validate_only', false);

        if ($validateOnly) {
            // For step validation, we don't perform actual registration
            // Just return with a flash success message
            return back()->with('success', true);
        }

        // This is final submission, proceed with registration
        $this->businessService->register($request);
        return to_route('modules.core.dashboard');
    }

    /**
     * Handle investor registration.
     */
    public function storeInvestor(StoreInvestorRequest $request): RedirectResponse
    {
        $result = $this->investorService->register($request);

        if (!$result['success']) {
            return back()->withErrors(['general' => $result['message']]);
        }

        return to_route('investor.dashboard');
    }
}
