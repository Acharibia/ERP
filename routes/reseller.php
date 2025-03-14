<?php

use App\Reseller\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verify.reseller'])->prefix('reseller')->name('reseller.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Other admin routes
});
