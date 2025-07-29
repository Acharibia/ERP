<?php
namespace App\Tenant\HR\Enum;

/**
 * Enum representing HR module permissions
 */
enum PermissionEnum: string {
    // Employee Management
    case HR_VIEW_EMPLOYEE   = 'HR_VIEW_EMPLOYEE';
    case HR_CREATE_EMPLOYEE = 'HR_CREATE_EMPLOYEE';
    case HR_EDIT_EMPLOYEE   = 'HR_EDIT_EMPLOYEE';
    case HR_DELETE_EMPLOYEE = 'HR_DELETE_EMPLOYEE';
    case HR_EXPORT_EMPLOYEE = 'HR_EXPORT_EMPLOYEE';

    // Department Management
    case HR_VIEW_DEPARTMENT   = 'HR_VIEW_DEPARTMENT';
    case HR_CREATE_DEPARTMENT = 'HR_CREATE_DEPARTMENT';
    case HR_EDIT_DEPARTMENT   = 'HR_EDIT_DEPARTMENT';
    case HR_DELETE_DEPARTMENT = 'HR_DELETE_DEPARTMENT';

    // Position Management
    case HR_VIEW_POSITION   = 'HR_VIEW_POSITION';
    case HR_CREATE_POSITION = 'HR_CREATE_POSITION';
    case HR_EDIT_POSITION   = 'HR_EDIT_POSITION';
    case HR_DELETE_POSITION = 'HR_DELETE_POSITION';

    // Leave Management
    case HR_VIEW_LEAVE    = 'HR_VIEW_LEAVE';
    case HR_CREATE_LEAVE  = 'HR_CREATE_LEAVE';
    case HR_EDIT_LEAVE    = 'HR_EDIT_LEAVE';
    case HR_DELETE_LEAVE  = 'HR_DELETE_LEAVE';
    case HR_APPROVE_LEAVE = 'HR_APPROVE_LEAVE';

    // Attendance Management
    case HR_VIEW_ATTENDANCE   = 'HR_VIEW_ATTENDANCE';
    case HR_CREATE_ATTENDANCE = 'HR_CREATE_ATTENDANCE';
    case HR_EDIT_ATTENDANCE   = 'HR_EDIT_ATTENDANCE';
    case HR_DELETE_ATTENDANCE = 'HR_DELETE_ATTENDANCE';

    // Access Control
    case HR_VIEW_ACCESS = 'HR_VIEW_ACCESS';
    case HR_EDIT_ACCESS = 'HR_EDIT_ACCESS';
    case HR_VIEW_ROLE   = 'HR_VIEW_ROLE';
    case HR_CREATE_ROLE = 'HR_CREATE_ROLE';
    case HR_EDIT_ROLE   = 'HR_EDIT_ROLE';
    case HR_DELETE_ROLE = 'HR_DELETE_ROLE';

    /**
     * Get all permissions as an array
     */
    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get permissions grouped by category
     */
    public static function grouped(): array
    {
        return [
            'Employee Management'   => [
                self::HR_VIEW_EMPLOYEE,
                self::HR_CREATE_EMPLOYEE,
                self::HR_EDIT_EMPLOYEE,
                self::HR_DELETE_EMPLOYEE,
                self::HR_EXPORT_EMPLOYEE,
            ],
            'Department Management' => [
                self::HR_VIEW_DEPARTMENT,
                self::HR_CREATE_DEPARTMENT,
                self::HR_EDIT_DEPARTMENT,
                self::HR_DELETE_DEPARTMENT,
            ],
            'Position Management'   => [
                self::HR_VIEW_POSITION,
                self::HR_CREATE_POSITION,
                self::HR_EDIT_POSITION,
                self::HR_DELETE_POSITION,
            ],
            'Leave Management'      => [
                self::HR_VIEW_LEAVE,
                self::HR_CREATE_LEAVE,
                self::HR_EDIT_LEAVE,
                self::HR_DELETE_LEAVE,
                self::HR_APPROVE_LEAVE,
            ],
            'Attendance Management' => [
                self::HR_VIEW_ATTENDANCE,
                self::HR_CREATE_ATTENDANCE,
                self::HR_EDIT_ATTENDANCE,
                self::HR_DELETE_ATTENDANCE,
            ],
            'Access Control'        => [
                self::HR_VIEW_ACCESS,
                self::HR_EDIT_ACCESS,
                self::HR_VIEW_ROLE,
                self::HR_CREATE_ROLE,
                self::HR_EDIT_ROLE,
                self::HR_DELETE_ROLE,
            ],
        ];
    }

    /**
     * Get permissions for a specific category
     */
    public static function forCategory(string $category): array
    {
        return self::grouped()[$category] ?? [];
    }

    /**
     * Get the label for this permission
     */
    public function label(): string
    {
        return match ($this) {
            // Employee Management
            self::HR_VIEW_EMPLOYEE => 'View Employees',
            self::HR_CREATE_EMPLOYEE => 'Create Employee',
            self::HR_EDIT_EMPLOYEE => 'Edit Employee',
            self::HR_DELETE_EMPLOYEE => 'Delete Employee',
            self::HR_EXPORT_EMPLOYEE => 'Export Employees',

            // Department Management
            self::HR_VIEW_DEPARTMENT => 'View Departments',
            self::HR_CREATE_DEPARTMENT => 'Create Department',
            self::HR_EDIT_DEPARTMENT => 'Edit Department',
            self::HR_DELETE_DEPARTMENT => 'Delete Department',

            // Position Management
            self::HR_VIEW_POSITION => 'View Positions',
            self::HR_CREATE_POSITION => 'Create Position',
            self::HR_EDIT_POSITION => 'Edit Position',
            self::HR_DELETE_POSITION => 'Delete Position',

            // Leave Management
            self::HR_VIEW_LEAVE => 'View Leaves',
            self::HR_CREATE_LEAVE => 'Create Leave',
            self::HR_EDIT_LEAVE => 'Edit Leave',
            self::HR_DELETE_LEAVE => 'Delete Leave',
            self::HR_APPROVE_LEAVE => 'Approve Leave',

            // Attendance Management
            self::HR_VIEW_ATTENDANCE => 'View Attendance',
            self::HR_CREATE_ATTENDANCE => 'Create Attendance',
            self::HR_EDIT_ATTENDANCE => 'Edit Attendance',
            self::HR_DELETE_ATTENDANCE => 'Delete Attendance',

            // Access Control
            self::HR_VIEW_ACCESS => 'View Access Control',
            self::HR_EDIT_ACCESS => 'Edit Access Control',
            self::HR_VIEW_ROLE => 'View Roles',
            self::HR_CREATE_ROLE => 'Create Role',
            self::HR_EDIT_ROLE => 'Edit Role',
            self::HR_DELETE_ROLE => 'Delete Role',
        };
    }

    /**
     * Get the description for this permission
     */
    public function description(): string
    {
        return match ($this) {
            // Employee Management
            self::HR_VIEW_EMPLOYEE => 'View employee records and information',
            self::HR_CREATE_EMPLOYEE => 'Create new employee records',
            self::HR_EDIT_EMPLOYEE => 'Edit existing employee records',
            self::HR_DELETE_EMPLOYEE => 'Delete employee records',
            self::HR_EXPORT_EMPLOYEE => 'Export employee data',

            // Department Management
            self::HR_VIEW_DEPARTMENT => 'View department information',
            self::HR_CREATE_DEPARTMENT => 'Create new departments',
            self::HR_EDIT_DEPARTMENT => 'Edit existing departments',
            self::HR_DELETE_DEPARTMENT => 'Delete departments',

            // Position Management
            self::HR_VIEW_POSITION => 'View position information',
            self::HR_CREATE_POSITION => 'Create new positions',
            self::HR_EDIT_POSITION => 'Edit existing positions',
            self::HR_DELETE_POSITION => 'Delete positions',

            // Leave Management
            self::HR_VIEW_LEAVE => 'View leave requests and records',
            self::HR_CREATE_LEAVE => 'Create leave requests',
            self::HR_EDIT_LEAVE => 'Edit leave requests',
            self::HR_DELETE_LEAVE => 'Delete leave requests',
            self::HR_APPROVE_LEAVE => 'Approve or reject leave requests',

            // Attendance Management
            self::HR_VIEW_ATTENDANCE => 'View attendance records',
            self::HR_CREATE_ATTENDANCE => 'Create attendance records',
            self::HR_EDIT_ATTENDANCE => 'Edit attendance records',
            self::HR_DELETE_ATTENDANCE => 'Delete attendance records',

            // Access Control
            self::HR_VIEW_ACCESS => 'View HR access control settings',
            self::HR_EDIT_ACCESS => 'Edit HR access control settings',
            self::HR_VIEW_ROLE => 'View HR roles and permissions',
            self::HR_CREATE_ROLE => 'Create HR roles',
            self::HR_EDIT_ROLE => 'Edit HR roles and permissions',
            self::HR_DELETE_ROLE => 'Delete HR roles',
        };
    }

       /**
     * Get the module for this role
     */
    public function module(): string
    {
        return 'hr';
    }
}
