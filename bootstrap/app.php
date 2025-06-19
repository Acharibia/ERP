<?php

use App\Central\Http\Middleware\HandleAppearance;
use App\Central\Http\Middleware\HandleInertiaRequests;
use App\Central\Http\Middleware\EnsureActiveBusinessSelected;
use App\Central\Http\Middleware\InitializeTenancyByUserBusiness;
use App\Central\Http\Middleware\VerifyAdminAccess;
use App\Central\Http\Middleware\VerifyModuleAccess;
use App\Central\Http\Middleware\VerifyResellerAccess;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->encryptCookies(except: ['appearance']);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'verify.admin' => VerifyAdminAccess::class,
            'verify.reseller' => VerifyResellerAccess::class,
            'verify.module' => VerifyModuleAccess::class,
            'ensure.business' => EnsureActiveBusinessSelected::class,
            'tenant.user' => InitializeTenancyByUserBusiness::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
