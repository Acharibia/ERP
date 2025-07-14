<?php

namespace App\Central\Enums;

enum BusinessVerificationStatus: string
{
    case PENDING = 'pending';
    case VERIFIED = 'verified';
    case REJECTED = 'rejected';
    case UNDER_REVIEW = 'under_review';

    /**
     * Get human-readable label for the status
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending Verification',
            self::VERIFIED => 'Verified',
            self::REJECTED => 'Verification Rejected',
            self::UNDER_REVIEW => 'Under Review',
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
            self::PENDING => 'yellow',
            self::VERIFIED => 'green',
            self::REJECTED => 'red',
            self::UNDER_REVIEW => 'blue',
        };
    }

    /**
     * Get badge icon for status
     *
     * @return string|null
     */
    public function icon(): ?string
    {
        return match ($this) {
            self::PENDING => 'clock',
            self::VERIFIED => 'check-circle',
            self::REJECTED => 'x-circle',
            self::UNDER_REVIEW => 'eye',
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
