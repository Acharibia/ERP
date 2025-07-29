<?php
namespace App\Tenant\Core\Enum;

enum PermissionEnum: string {
    // Module access
    case CORE_ACCESS      = 'CORE_ACCESS';
    case HR_ACCESS        = 'HR_ACCESS';
    case INVENTORY_ACCESS = 'INVENTORY_ACCESS';
    case CRM_ACCESS       = 'CRM_ACCESS';
    case FINANCE_ACCESS   = 'FINANCE_ACCESS';

    // User management
    case CORE_VIEW_USERS              = 'CORE_VIEW_USERS';
    case CORE_CREATE_USER             = 'CORE_CREATE_USER';
    case CORE_EDIT_USER               = 'CORE_EDIT_USER';
    case CORE_DELETE_USER             = 'CORE_DELETE_USER';
    case CORE_INVITE_USER             = 'CORE_INVITE_USER';
    case CORE_MANAGE_USER_PERMISSIONS = 'CORE_MANAGE_USER_PERMISSIONS';

    // Role management
    case CORE_VIEW_ROLES  = 'CORE_VIEW_ROLES';
    case CORE_CREATE_ROLE = 'CORE_CREATE_ROLE';
    case CORE_EDIT_ROLE   = 'CORE_EDIT_ROLE';
    case CORE_DELETE_ROLE = 'CORE_DELETE_ROLE';
    case CORE_ASSIGN_ROLE = 'CORE_ASSIGN_ROLE';

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
            'Module Access'   => [
                self::CORE_ACCESS,
                self::HR_ACCESS,
                self::INVENTORY_ACCESS,
                self::CRM_ACCESS,
                self::FINANCE_ACCESS,
            ],
            'User Management' => [
                self::CORE_VIEW_USERS,
                self::CORE_CREATE_USER,
                self::CORE_EDIT_USER,
                self::CORE_DELETE_USER,
                self::CORE_INVITE_USER,
                self::CORE_MANAGE_USER_PERMISSIONS,
            ],
            'Role Management' => [
                self::CORE_VIEW_ROLES,
                self::CORE_CREATE_ROLE,
                self::CORE_EDIT_ROLE,
                self::CORE_DELETE_ROLE,
                self::CORE_ASSIGN_ROLE,
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
            // Module Access
            self::CORE_ACCESS => 'Access Core Module',
            self::HR_ACCESS => 'Access HR Module',
            self::INVENTORY_ACCESS => 'Access Inventory Module',
            self::CRM_ACCESS => 'Access CRM Module',
            self::FINANCE_ACCESS => 'Access Finance Module',

            // User Management
            self::CORE_VIEW_USERS => 'View Users',
            self::CORE_CREATE_USER => 'Create User',
            self::CORE_EDIT_USER => 'Edit User',
            self::CORE_DELETE_USER => 'Delete User',
            self::CORE_INVITE_USER => 'Invite User',
            self::CORE_MANAGE_USER_PERMISSIONS => 'Manage User Permissions',

            // Role Management
            self::CORE_VIEW_ROLES => 'View Roles',
            self::CORE_CREATE_ROLE => 'Create Role',
            self::CORE_EDIT_ROLE => 'Edit Role',
            self::CORE_DELETE_ROLE => 'Delete Role',
            self::CORE_ASSIGN_ROLE => 'Assign Role',
        };
    }

    /**
     * Get the description for this permission
     */
    public function description(): string
    {
        return match ($this) {
            // Module Access
            self::CORE_ACCESS => 'Access to core system functionality and user management',
            self::HR_ACCESS => 'Access to human resources module including employees, departments, and leave management',
            self::INVENTORY_ACCESS => 'Access to inventory management module',
            self::CRM_ACCESS => 'Access to customer relationship management module',
            self::FINANCE_ACCESS => 'Access to finance and accounting module',

            // User Management
            self::CORE_VIEW_USERS => 'View all users in the system',
            self::CORE_CREATE_USER => 'Create new user accounts',
            self::CORE_EDIT_USER => 'Edit existing user accounts',
            self::CORE_DELETE_USER => 'Delete user accounts',
            self::CORE_INVITE_USER => 'Invite new users to the system',
            self::CORE_MANAGE_USER_PERMISSIONS => 'Manage user permissions and roles',

            // Role Management
            self::CORE_VIEW_ROLES => 'View all roles in the system',
            self::CORE_CREATE_ROLE => 'Create new roles',
            self::CORE_EDIT_ROLE => 'Edit existing roles',
            self::CORE_DELETE_ROLE => 'Delete roles',
            self::CORE_ASSIGN_ROLE => 'Assign roles to users',
        };
    }

    /**
     * Get the module for this role
     */
    public function module(): string
    {
        return 'core';
    }
}
