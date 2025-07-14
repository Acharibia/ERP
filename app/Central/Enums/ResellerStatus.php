<?php

namespace App\Central\Enums;

enum ResellerStatus: string
{
    case ACTIVE = 'active';
    case PENDING = 'pending';
    case SUSPENDED = 'suspended';
    case ARCHIVED = 'archived';

    /**
     * Get all available statuses as an array
     *
     * @return array
     */
    public static function toArray(): array
    {
        return [
            self::ACTIVE->value => 'Active',
            self::PENDING->value => 'Pending',
            self::SUSPENDED->value => 'Suspended',
            self::ARCHIVED->value => 'Archived',
        ];
    }

    /**
     * Get a formatted label for the status
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Active',
            self::PENDING => 'Pending',
            self::SUSPENDED => 'Suspended',
            self::ARCHIVED => 'Archived',
        };
    }

    /**
     * Get a color class for the status (useful for UI components)
     *
     * @return string
     */
    public function color(): string
    {
        return match ($this) {
            self::ACTIVE => 'green',
            self::PENDING => 'yellow',
            self::SUSPENDED => 'red',
            self::ARCHIVED => 'gray',
        };
    }
}
