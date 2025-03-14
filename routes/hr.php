<?php

use App\Modules\HR\Http\Controllers\DashboardController;

Route::prefix('hr')->name('hr.')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Other HR module routes
});
