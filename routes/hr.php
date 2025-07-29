<?php

use App\Tenant\HR\Http\Controllers\AttendanceController;
use App\Tenant\HR\Http\Controllers\CourseController;
use App\Tenant\HR\Http\Controllers\DashboardController;
use App\Tenant\HR\Http\Controllers\DataTableController;
use App\Tenant\HR\Http\Controllers\DepartmentController;
use App\Tenant\HR\Http\Controllers\EmployeeController;
use App\Tenant\HR\Http\Controllers\LeaveRequestController;
use App\Tenant\HR\Http\Controllers\LeaveTypeController;
use App\Tenant\HR\Http\Controllers\PositionController;
use App\Tenant\HR\Http\Controllers\ProgramController;
use App\Tenant\HR\Http\Controllers\RoleAccessController;
use App\Tenant\HR\Http\Controllers\ScheduleController;
use App\Tenant\HR\Http\Controllers\ShiftController;
use App\Tenant\HR\Http\Controllers\ShiftPreferenceController;
use App\Tenant\HR\Http\Controllers\ShiftRotationController;
use App\Tenant\HR\Http\Controllers\UserAccessController;

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
        Route::get('/{id}/access', [EmployeeController::class, 'access'])->name('access');
        Route::patch('/{id}/access', [EmployeeController::class, 'updateAccess'])->name('update-access');
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
        Route::patch('leave-types/{id}', [LeaveTypeController::class, 'update'])->name('update');
        Route::delete('leave-types/{id}', [LeaveTypeController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('leaves')->name('leaves.')->group(function () {
        Route::get('/', [LeaveRequestController::class, 'index'])->name('index');
        Route::get('/create', [LeaveRequestController::class, 'create'])->name('create');
        Route::post('/', [LeaveRequestController::class, 'store'])->name('store');
        Route::get('/{id}', [LeaveRequestController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [LeaveRequestController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [LeaveRequestController::class, 'update'])->name('update');
        Route::delete('/{id}', [LeaveRequestController::class, 'destroy'])->name('destroy');

        Route::patch('/{id}/approve', [LeaveRequestController::class, 'approve'])->name('approve');
        Route::patch('/{id}/reject', [LeaveRequestController::class, 'reject'])->name('reject');
        Route::patch('/{id}/cancel', [LeaveRequestController::class, 'cancel'])->name('cancel');

        Route::patch('bulk-approve', [LeaveRequestController::class, 'bulkApprove'])->name('bulk-approve');
        Route::patch('bulk-reject', [LeaveRequestController::class, 'bulkReject'])->name('bulk-reject');
        Route::post('bulk-delete', [LeaveRequestController::class, 'bulkDelete'])->name('bulk-delete');
    });

    Route::prefix('attendance')->name('attendance.')->group(function () {
        Route::get('/', [AttendanceController::class, 'index'])->name('index');
        Route::get('/create', [AttendanceController::class, 'create'])->name('create');
        Route::post('/', [AttendanceController::class, 'store'])->name('store');
        Route::get('/{id}', [AttendanceController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [AttendanceController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [AttendanceController::class, 'update'])->name('update');
        Route::delete('/{id}', [AttendanceController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('shifts')->name('shifts.')->group(function () {
        Route::get('/', [ShiftController::class, 'index'])->name('index');
        Route::get('/create', [ShiftController::class, 'create'])->name('create');
        Route::post('/', [ShiftController::class, 'store'])->name('store');
        Route::get('/{id}', [ShiftController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [ShiftController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ShiftController::class, 'update'])->name('update');
        Route::delete('/{id}', [ShiftController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('schedules')->name('schedules.')->group(function () {
        Route::get('/', [ScheduleController::class, 'index'])->name('index');
        Route::get('/create', [ScheduleController::class, 'create'])->name('create');
        Route::post('/', [ScheduleController::class, 'store'])->name('store');
        Route::get('/{id}', [ScheduleController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [ScheduleController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ScheduleController::class, 'update'])->name('update');
        Route::delete('/{id}', [ScheduleController::class, 'destroy'])->name('destroy');
        Route::post('/generate', [ScheduleController::class, 'generateSchedules'])->name('generate');
    });

    Route::prefix('shift-preferences')->name('shift-preferences.')->group(function () {
        Route::get('/', [ShiftPreferenceController::class, 'index'])->name('index');
        Route::get('/create', [ShiftPreferenceController::class, 'create'])->name('create');
        Route::post('/', [ShiftPreferenceController::class, 'store'])->name('store');
        Route::get('/{id}', [ShiftPreferenceController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [ShiftPreferenceController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ShiftPreferenceController::class, 'update'])->name('update');
        Route::delete('/{id}', [ShiftPreferenceController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('shift-rotations')->name('shift-rotations.')->group(function () {
        Route::get('/', [ShiftRotationController::class, 'index'])->name('index');
        Route::get('/create', [ShiftRotationController::class, 'create'])->name('create');
        Route::post('', [ShiftRotationController::class, 'store'])->name('store');
        Route::get('{id}/edit', [ShiftRotationController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [ShiftRotationController::class, 'update'])->name('update');
        Route::delete('/{id}', [ShiftRotationController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('role-access')->name('role-access.')->group(function () {
        Route::get('/', [RoleAccessController::class, 'index'])->name('index');
        Route::get('/create', [RoleAccessController::class, 'create'])->name('create');
        Route::post('/', [RoleAccessController::class, 'store'])->name('store');
        Route::get('/{id}', [RoleAccessController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [RoleAccessController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [RoleAccessController::class, 'update'])->name('update');
        Route::delete('/{id}', [RoleAccessController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('user-access')->name('user-access.')->group(function () {
        Route::get('/', [UserAccessController::class, 'index'])->name('index');
        Route::post('/', [UserAccessController::class, 'store'])->name('store');
        Route::get('/{id}', [UserAccessController::class, 'show'])->name('show');
        Route::get('/{id}/edit', [UserAccessController::class, 'edit'])->name('edit');
        Route::patch('/{id}', [UserAccessController::class, 'update'])->name('update');
        Route::patch('/bulk-update', [UserAccessController::class, 'bulkUpdate'])->name('bulk-update');
    });

    Route::prefix('programs')->name('programs.')->group(function () {
        Route::get('/', [ProgramController::class, 'index'])->name('index');
        Route::get('/create', [ProgramController::class, 'create'])->name('create');
        Route::post('/', [ProgramController::class, 'store'])->name('store');
        Route::get('/{program}', [ProgramController::class, 'show'])->name('show');
        Route::get('/{program}/edit', [ProgramController::class, 'edit'])->name('edit');
        Route::patch('/{program}', [ProgramController::class, 'update'])->name('update');
        Route::delete('/{program}', [ProgramController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('courses')->name('courses.')->group(function () {
        Route::get('/', [CourseController::class, 'index'])->name('index');
        Route::get('/create', [CourseController::class, 'create'])->name('create');
        Route::post('/', [CourseController::class, 'store'])->name('store');
        Route::get('/{course}', [CourseController::class, 'show'])->name('show');
        Route::get('/{course}/edit', [CourseController::class, 'edit'])->name('edit');
        Route::patch('/{course}', [CourseController::class, 'update'])->name('update');
        Route::delete('/{course}', [CourseController::class, 'destroy'])->name('destroy');
    });

    Route::prefix('datatable')->name('datatable.')->group(function () {
        Route::post('{dataTable}', [DataTableController::class, 'process'])->name('process');
        Route::get('{dataTable}/filter-options', [DataTableController::class, 'getFilterOptions'])->name('filter-options');
        Route::get('/export', [DataTableController::class, 'export'])->name('export');
    });
});
