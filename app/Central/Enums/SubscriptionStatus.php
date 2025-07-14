<?php

namespace App\Central\Enums;

enum SubscriptionStatus: string
{
    case TRIAL = 'trial';
    case ACTIVE = 'active';
    case PENDING = 'pending';
    case CANCELLED = 'cancelled';
    case EXPIRED = 'expired';
    case SUSPENDED = 'suspended';

    /**
     * Get human-readable label for the status
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::TRIAL => 'Trial',
            self::ACTIVE => 'Active',
            self::PENDING => 'Pending',
            self::CANCELLED => 'Cancelled',
            self::EXPIRED => 'Expired',
            self::SUSPENDED => 'Suspended',
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
            self::TRIAL => 'blue',
            self::ACTIVE => 'green',
            self::PENDING => 'yellow',
            self::CANCELLED => 'red',
            self::EXPIRED => 'gray',
            self::SUSPENDED => 'orange',
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
