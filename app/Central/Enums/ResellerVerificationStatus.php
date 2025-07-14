<?php

namespace App\Central\Enums;

enum ResellerVerificationStatus: string
{
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case REJECTED = 'rejected';

    /**
     * Get all available verification statuses as an array
     *
     * @return array
     */
    public static function toArray(): array
    {
        return [
            self::PENDING->value => 'Pending',
            self::VERIFIED->value => 'Verified',
            self::REJECTED->value => 'Rejected',
        ];
    }

    /**
     * Get a formatted label for the verification status
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::VERIFIED => 'Verified',
            self::REJECTED => 'Rejected',
        };
    }

    /**
     * Get a color class for the verification status (useful for UI components)
     *
     * @return string
     */
    public function color(): string
    {
        return match ($this) {
            self::PENDING => 'yellow',
            self::VERIFIED => 'green',
            self::REJECTED => 'red',
        };
    }
}
