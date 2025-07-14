<?php

use App\Tenant\Modules\HR\Http\Controllers\LeaveTypeController;
use App\Tenant\Modules\HR\Http\Controllers\PositionController;
use App\Tenant\Modules\HR\Http\Controllers\DashboardController;
use App\Tenant\Modules\HR\Http\Controllers\DataTableController;
use App\Tenant\Modules\HR\Http\Controllers\DepartmentController;
use App\Tenant\Modules\HR\Http\Controllers\EmployeeController;
use App\Tenant\Modules\HR\Http\Controllers\LeaveRequestController;

Route::prefix('hr')->name('hr.')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    Route::prefix('employees')->name('employees.')->group(function () {
        Route::get('', [EmployeeController::class, 'index'])->name('index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('create');
        Route::post('/personal-info', [EmployeeController::class, 'storePersonalInfo'])->name('store.personal-info');
        Route::post('/employment-info', [EmployeeController::class, 'storeEmploymentInfo'])->name('store.employment-info');
        Route::post('/education-info', [EmployeeController::class, 'storeEducation'])->name('store.education-info');
        Route::post('/work-experience-info', [EmployeeController::class, 'storeWorkExperience'])->name('store.work-experience-info');
        Route::post('/emergency-contact-info', [EmployeeController::class, 'storeEmergencyContacts'])->name('store.emergency-contact-info');
        Route::post('/preview-info', [EmployeeController::class, 'storeFinal'])->name('store.preview-info');
        Route::get('/discard-draft', [EmployeeController::class, 'discardDraft'])->name('discard-draft');
        Route::get('/{id}', [EmployeeController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [EmployeeController::class, 'edit'])->name('edit');
        Route::delete('/{id}/destroy', [EmployeeController::class, 'destroy'])->name('destroy');
    });


    Route::prefix('departments')->name('departments.')->group(function () {
        Route::get('', [DepartmentController::class, 'index'])->name('index');
        Route::get('/create', [DepartmentController::class, 'create'])->name('create');
        Route::post('', [DepartmentController::class, 'store'])->name('store');
        Route::get('/{id}', [DepartmentController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [DepartmentController::class, 'edit'])->name('edit');
        Route::patch('/{id}/update', [DepartmentController::class, 'update'])->name('update');
        Route::patch('/{id}/activate', [DepartmentController::class, 'activate'])->name('activate');
        Route::patch('/{id}/suspend', [DepartmentController::class, 'suspend'])->name('suspend');
        Route::patch('/{id}/deactivate', [DepartmentController::class, 'deactivate'])->name('deactivate');
        Route::delete('/{id}/destroy', [DepartmentController::class, 'destroy'])->name('destroy');
        Route::patch('/bulk-destroy', [DepartmentController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::patch('/bulk-activate', [DepartmentController::class, 'bulkActivate'])->name('bulk-activate');
        Route::patch('/bulk-suspend', [DepartmentController::class, 'bulkSuspend'])->name('bulk-suspend');
        Route::patch('/bulk-deactivate', [DepartmentController::class, 'bulkDeactivate'])->name('bulk-deactivate');
    });


    Route::prefix('positions')->name('positions.')->group(function () {
        Route::get('/', [PositionController::class, 'index'])->name('index');
        Route::get('/create', [PositionController::class, 'create'])->name('create');
        Route::post('/', [PositionController::class, 'store'])->name('store');
        Route::get('/{id}', [PositionController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [PositionController::class, 'edit'])->name('edit');
        Route::patch('/{id}/update', [PositionController::class, 'update'])->name('update');
        Route::patch('/{id}/activate', [PositionController::class, 'activate'])->name('activate');
        Route::patch('/{id}/deactivate', [PositionController::class, 'deactivate'])->name('deactivate');
        Route::delete('/{id}/destroy', [PositionController::class, 'destroy'])->name('destroy');
        Route::patch('/bulk-destroy', [PositionController::class, 'bulkDestroy'])->name('bulk-destroy');
        Route::patch('/bulk-activate', [PositionController::class, 'bulkActivate'])->name('bulk-activate');
        Route::patch('/bulk-suspend', [PositionController::class, 'bulkSuspend'])->name('bulk-suspend');
        Route::patch('/bulk-deactivate', [PositionController::class, 'bulkDeactivate'])->name('bulk-deactivate');
    });

    Route::prefix('leave-types')->name('leave-types.')->group(function () {
        Route::post('leave-types', [LeaveTypeController::class, 'store'])->name('store');
        Route::patch('leave-types/{leaveType}', [LeaveTypeController::class, 'update'])->name('update');
        Route::delete('leave-types/{leaveType}', [LeaveTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('leaves')->name('leaves.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::get('/create', [LeaveRequestController::class, 'create'])->name('create');
        Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
        Route::get('/{leave}', [LeaveRequestController::class, 'show'])->name('show');
        Route::get('/{leave}/edit', [LeaveRequestController::class, 'edit'])->name('edit');
        Route::patch('/{leave}', [LeaveRequestController::class, 'update'])->name('update');
        Route::delete('/{leave}', [LeaveRequestController::class, 'destroy'])->name('destroy');

        Route::patch('/{leave}/approve', [LeaveRequestController::class, 'approve'])->name('approve');
        Route::patch('/{leave}/reject', [LeaveRequestController::class, 'reject'])->name('reject');

        Route::patch('bulk-approve', [LeaveRequestController::class, 'bulkApprove'])->name('bulk-approve');
        Route::patch('bulk-reject', [LeaveRequestController::class, 'bulkReject'])->name('bulk-reject');
        Route::post('bulk-delete', [LeaveRequestController::class, 'bulkDelete'])->name('bulk-delete');
    });




    Route::prefix('datatable')->name('datatable.')->group(function () {
        Route::post('{dataTable}', [DataTableController::class, 'process'])->name('process');
        Route::get('{dataTable}/filter-options', [DataTableController::class, 'getFilterOptions'])->name('filter-options');
        Route::get('/export', [DataTableController::class, 'export'])->name('export');
    });
});
