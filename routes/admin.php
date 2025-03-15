<?php

use App\Admin\Http\Controllers\BusinessController;
use App\Admin\Http\Controllers\ResellerController;
use App\Admin\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verify.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Resellers routes
    Route::resource('resellers', ResellerController::class);
    Route::patch('resellers/{reseller}/toggle-status', [ResellerController::class, 'toggleStatus'])
        ->name('resellers.toggle-status');
    Route::get('resellers/{reseller}/verification', [ResellerController::class, 'verification'])
        ->name('resellers.verification');
    Route::post('resellers/{reseller}/verification-action', [ResellerController::class, 'verificationAction'])
        ->name('resellers.verification-action');

    // Business routes
    Route::resource('businesses', BusinessController::class);
});
