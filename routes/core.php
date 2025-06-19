<?php

use App\Tenant\Modules\Core\Http\Controllers\DashboardController;

Route::prefix('core')->name('core.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Other Core module routes
});
