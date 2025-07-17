<?php
namespace App\Tenant\Modules\HR\Enum;

enum ShiftRotationFrequency: string {
    case DAILY    = 'daily';
    case WEEKLY   = 'weekly';
    case BIWEEKLY = 'bi-weekly';
    case CUSTOM   = 'custom';

    /**
     * Get display label.
     */
    public function label(): string
    {
        return match ($this) {
            self::DAILY => 'Daily',
            self::WEEKLY => 'Weekly',
            self::BIWEEKLY => 'Bi-Weekly',
            self::CUSTOM => 'Custom',
        };
    }

    /**
     * Get all options for frontend.
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn($case) => [
            'id'    => $case->value,
            'name'  => $case->label(),
            'value' => $case->value,
        ])->toArray();
    }

    /**
     * Get all values only.
     */
    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->toArray();
    }

    /**
     * Get enum case from string value.
     */
    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn($case) => $case->value === $value);
    }
}
