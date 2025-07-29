<?php
namespace App\Tenant\Core\Enum;

/**
 * Enum representing module access permissions
 */
enum AccessPermissionEnum: string {
    // Module access permissions
    case CORE_ACCESS      = 'CORE_ACCESS';
    case HR_ACCESS        = 'HR_ACCESS';
    case INVENTORY_ACCESS = 'INVENTORY_ACCESS';
    case CRM_ACCESS       = 'CRM_ACCESS';
    case FINANCE_ACCESS   = 'FINANCE_ACCESS';

    /**
     * Get all permissions as an array
     */
    public static function all(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get the label for this permission
     */
    public function label(): string
    {
        return match ($this) {
            self::CORE_ACCESS => 'Access Core Module',
            self::HR_ACCESS => 'Access HR Module',
            self::INVENTORY_ACCESS => 'Access Inventory Module',
            self::CRM_ACCESS => 'Access CRM Module',
            self::FINANCE_ACCESS => 'Access Finance Module',
        };
    }

    /**
     * Get the description for this permission
     */
    public function description(): string
    {
        return match ($this) {
            self::CORE_ACCESS => 'Access to core system functionality and user management',
            self::HR_ACCESS => 'Access to human resources module including employees, departments, and leave management',
            self::INVENTORY_ACCESS => 'Access to inventory management module',
            self::CRM_ACCESS => 'Access to customer relationship management module',
            self::FINANCE_ACCESS => 'Access to finance and accounting module',
        };
    }

    /**
     * Get the module name from the permission
     */
    public function module(): string
    {
        return match ($this) {
            self::CORE_ACCESS => 'core',
            self::HR_ACCESS => 'hr',
            self::INVENTORY_ACCESS => 'inventory',
            self::CRM_ACCESS => 'crm',
            self::FINANCE_ACCESS => 'finance',
        };
    }
}
