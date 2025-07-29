<?php

namespace App\Tenant\HR\Enum;

enum PositionLevel: string
{
    case ENTRY = 'entry';
    case MID = 'mid';
    case SENIOR = 'senior';
    case MANAGER = 'manager';
    case EXECUTIVE = 'executive';

    /**
     * Get the display name for the position level.
     */
    public function label(): string
    {
        return match ($this) {
            self::ENTRY => 'Entry Level',
            self::MID => 'Mid Level',
            self::SENIOR => 'Senior Level',
            self::MANAGER => 'Manager',
            self::EXECUTIVE => 'Executive',
        };
    }

    /**
     * Get all position levels as array suitable for frontend.
     */
    public static function options(): array
    {
        return collect(self::cases())->map(function ($case) {
            return [
                'id' => $case->value,
                'name' => $case->label(),
                'value' => $case->value,
            ];
        })->toArray();
    }

    /**
     * Get all position level values.
     */
    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->toArray();
    }

    /**
     * Get position level from value with fallback.
     */
    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn($case) => $case->value === $value);
    }
}
