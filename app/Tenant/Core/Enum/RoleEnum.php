<?php
namespace App\Tenant\Core\Enum;

/**
 * Enum representing Core module roles
 */
enum RoleEnum: string {
    case OWNER         = 'OWNER';
    case ADMINISTRATOR = 'ADMINISTRATOR';

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
            self::OWNER => 'Owner',
            self::ADMINISTRATOR => 'Administrator',
        };
    }

    /**
     * Get the description for this role
     */
    public function description(): string
    {
        return match ($this) {
            self::OWNER => 'Full access to all tenant features',
            self::ADMINISTRATOR => 'Administrative access to most tenant features',
        };
    }

    /**
     * Get the module for this role
     */
    public function module(): string
    {
        return 'core';
    }

    /**
     * Check if this role is protected
     */
    public function isProtected(): bool
    {
        return true;
    }
}
