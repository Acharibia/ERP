<?php

namespace App\Tenant\Modules\HR\Enum;

enum EmploymentType: string
{
    case FULL_TIME = 'full-time';
    case PART_TIME = 'part-time';
    case CONTRACT = 'contract';
    case INTERN = 'intern';

    /**
     * Get the display name for the employment type.
     */
    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Full-time',
            self::PART_TIME => 'Part-time',
            self::CONTRACT => 'Contract',
            self::INTERN => 'Intern',
        };
    }

    /**
     * Get all employment types as array suitable for frontend.
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
     * Get all employment type values.
     */
    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->toArray();
    }

    /**
     * Get employment type from value with fallback.
     */
    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn($case) => $case->value === $value);
    }
}
