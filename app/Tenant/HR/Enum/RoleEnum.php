<?php
namespace App\Tenant\HR\Enum;

/**
 * Enum representing HR module roles
 */
enum RoleEnum: string {
    case HR_MANAGER = 'HR_MANAGER';
    case HR_SUPPORT = 'HR_SUPPORT';

    /**
     * Get all roles as an array
     */
    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the label for this role
     */
    public function label(): string
    {
        return match ($this) {
            self::HR_MANAGER => 'HR Manager',
            self::HR_SUPPORT => 'HR Support',
        };
    }

    /**
     * Get the description for this role
     */
    public function description(): string
    {
        return match ($this) {
            self::HR_MANAGER => 'HR Manager - Full access to HR module',
            self::HR_SUPPORT => 'HR Support - Limited access to HR functions',
        };
    }

    /**
     * Get the module for this role
     */
    public function module(): string
    {
        return 'hr';
    }

    /**
     * Check if this role is protected
     */
    public function isProtected(): bool
    {
        return true;
    }
}
