<?php
namespace App\Tenant\HR\Enum;

enum ShiftRotationFrequency: string {
    case DAILY = 'daily';
    case WEEKLY = 'weekly';
    case BIWEEKLY = 'bi-weekly';
    case MONTHLY = 'monthly';
    case QUARTERLY = 'quarterly';
    case YEARLY = 'yearly';
    case CUSTOM = 'custom';

    public function label(): string
    {
        return match ($this) {
            self::DAILY => 'Daily',
            self::WEEKLY => 'Weekly',
            self::BIWEEKLY => 'Bi-Weekly',
            self::MONTHLY => 'Monthly',
            self::QUARTERLY => 'Quarterly',
            self::YEARLY => 'Yearly',
            self::CUSTOM => 'Custom',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())->map(fn($case) => [
            'id'    => $case->value,
            'name'  => $case->label(),
            'value' => $case->value,
        ])->toArray();
    }

    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->toArray();
    }

    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn($case) => $case->value === $value);
    }
}
