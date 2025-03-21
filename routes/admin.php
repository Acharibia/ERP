<?php

use App\Admins\Http\Controllers\BusinessController;
use App\Admins\Http\Controllers\ResellerController;
use App\Admins\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verify.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Resellers routes
    Route::resource('resellers', ResellerController::class);

    // Business routes
    Route::resource('businesses', BusinessController::class);
});
    