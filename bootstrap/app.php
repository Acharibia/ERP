<?php

use App\Shared\Http\Middleware\HandleAppearance;
use App\Shared\Http\Middleware\HandleInertiaRequests;
use App\Shared\Http\Middleware\EnsureActiveBusinessSelected;
use App\Shared\Http\Middleware\VerifyAdminAccess;
use App\Shared\Http\Middleware\VerifyModuleAccess;
use App\Shared\Http\Middleware\VerifyResellerAccess;
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
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
