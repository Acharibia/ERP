<?php

require __DIR__ . '/landing.php';

require __DIR__ . '/access.php';
require __DIR__ . '/reseller.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/module.php';

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';

Route::post('datatable/{dataTable}', [App\Central\Http\Controllers\DataTableController::class, 'process'])
    ->name('datatable.process');

Route::get('datatable/{dataTable}/filter-options', [App\Central\Http\Controllers\DataTableController::class, 'getFilterOptions'])
    ->name('datatable.filter-options');

Route::get('/datatable/export', [App\Central\Http\Controllers\DataTableController::class, 'export'])->name('datatable.export');


