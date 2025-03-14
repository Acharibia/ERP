<?php

use App\Admin\Http\Controllers\DashboardController;

Route::middleware(['auth', 'verify.admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Other admin routes
});
