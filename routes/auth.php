<?php

use App\Auth\Http\Controllers\AuthenticatedSessionController;
use App\Auth\Http\Controllers\BusinessSwitchController;
use App\Auth\Http\Controllers\ConfirmablePasswordController;
use App\Auth\Http\Controllers\EmailVerificationNotificationController;
use App\Auth\Http\Controllers\EmailVerificationPromptController;
use App\Auth\Http\Controllers\NewPasswordController;
use App\Auth\Http\Controllers\PasswordResetLinkController;
use App\Auth\Http\Controllers\RegisteredUserController;
use App\Auth\Http\Controllers\VerifyEmailController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    // Type selection for registration
    Route::get('register', [RegisteredUserController::class, 'showTypeSelection'])
        ->name('register');

    // Reseller registration routes
    Route::get('register/reseller', [RegisteredUserController::class, 'createReseller'])
        ->name('register.reseller');
    Route::post('register/reseller', [RegisteredUserController::class, 'storeReseller'])
        ->name('register.reseller.store');

    // Business registration routes
    Route::get('register/business', [RegisteredUserController::class, 'createBusiness'])
        ->name('register.business');
    Route::post('register/business', [RegisteredUserController::class, 'storeBusiness'])
        ->name('register.business.store');

    // Investor registration routes
    Route::get('register/investor', [RegisteredUserController::class, 'createInvestor'])
        ->name('register.investor');
    Route::post('register/investor', [RegisteredUserController::class, 'storeInvestor'])
        ->name('register.investor.store');

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::post('/switch-business', [BusinessSwitchController::class, 'switch'])->name('business.switch');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
