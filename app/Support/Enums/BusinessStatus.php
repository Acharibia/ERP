<?php

namespace App\Support\Enums;

enum BusinessStatus: string
{
    case PENDING = 'pending';
    case ACTIVE = 'active';
    case SUSPENDED = 'suspended';
    case ARCHIVED = 'archived';

    /**
     * Get human-readable label for the status
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::ACTIVE => 'Active',
            self::SUSPENDED => 'Suspended',
            self::ARCHIVED => 'Archived',
        };
    }

    /**
     * Get color code associated with status
     *
     * @return string
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'orange',
            self::ACTIVE => 'green',
            self::SUSPENDED => 'red',
            self::ARCHIVED => 'gray',
        };
    }

    /**
     * Get all available statuses as array
     *
     * @return array
     */
    public static function toArray(): array
    {
        return array_map(fn($status) => $status->value, self::cases());
    }

    /**
     * Get all statuses with labels
     *
     * @return array
     */
    public static function options(): array
    {
        $options = [];

        foreach (self::cases() as $status) {
            $options[$status->value] = $status->label();
        }

        return $options;
    }
}
