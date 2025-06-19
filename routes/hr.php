<?php

use App\Tenant\Modules\HR\Http\Controllers\PositionController;
use App\Tenant\Modules\HR\Http\Controllers\DashboardController;
use App\Tenant\Modules\HR\Http\Controllers\DataTableController;
use App\Tenant\Modules\HR\Http\Controllers\DepartmentController;
use App\Tenant\Modules\HR\Http\Controllers\EmployeeController;
use App\Tenant\Modules\HR\Http\Controllers\LeaveController;

Route::prefix('hr')->name('hr.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');


    Route::get('/employees', [EmployeeController::class, 'index'])
        ->name('employees.index');


    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('', [DepartmentController::class, 'index'])->name('index');
        Route::get('/create', [DepartmentController::class, 'create'])->name('create');
        Route::post('', [DepartmentController::class, 'store'])->name('store');
        Route::get('/{id}', [DepartmentController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [DepartmentController::class, 'update'])->name('update');
        Route::delete('/{id}', [DepartmentController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('positions')->name('positions.')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::get('/create', [PositionController::class, 'create'])->name('create');
        Route::post('/', [PositionController::class, 'store'])->name('store');
        Route::get('/{id}', [PositionController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [PositionController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [PositionController::class, 'update'])->name('update');
        Route::delete('/{id}', [PositionController::class, 'destroy'])->name('destroy');
    });


    Route::get('/leaves', [LeaveController::class, 'index'])
        ->name('leaves.index');




    Route::prefix('datatable')->name('datatable.')->group(function () {
        Route::post('{dataTable}', [DataTableController::class, 'process'])->name('process');
        Route::get('{dataTable}/filter-options', [DataTableController::class, 'getFilterOptions'])->name('filter-options');
        Route::get('/export', [DataTableController::class, 'export'])->name('export');
    });
});
