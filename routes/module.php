<?php

use App\Central\Http\Middleware\InitializeTenancyByUserBusiness;

Route::middleware(['auth', 'ensure.business', 'verify.module', InitializeTenancyByUserBusiness::class,])->prefix('modules')->name('modules.')->group(function () {
    require __DIR__ . '/core.php';
    require __DIR__ . '/hr.php';

});
