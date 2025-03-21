<?php

use App\Shared\Http\Controllers\Access\AccessSelectionController;
use App\Shared\Http\Controllers\Access\BusinessSelectionController;
use Inertia\Inertia;

Route::get('/select-business', [BusinessSelectionController::class, 'index'])
    ->name('business.selection');

Route::post('/select-business', [BusinessSelectionController::class, 'select'])
    ->name('business.select');

Route::get('/select-access', [AccessSelectionController::class, 'index'])
    ->name('access.selection');

Route::post('/select-access', [AccessSelectionController::class, 'select'])
    ->name('access.select');

Route::get('/no-access', function () {
    return Inertia::render('shared/no-access');
})->name('no.access');
