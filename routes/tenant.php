<?php

declare(strict_types=1);

use App\Central\Http\Middleware\InitializeTenancyByUserBusiness;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::middleware([
    'auth',
    InitializeTenancyByUserBusiness::class,
])->group(function () {
});
