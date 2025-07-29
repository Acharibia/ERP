<?php
namespace App\Tenant\HR\Enum;

enum EmploymentType: string {
    case FULL_TIME = 'full_time';
    case PART_TIME = 'part_time';
    case CONTRACT  = 'contract';
    case TEMPORARY = 'temporary';
    case INTERN    = 'intern';

    public function label(): string
    {
        return match ($this) {
            self::FULL_TIME => 'Full Time',
            self::PART_TIME => 'Part Time',
            self::CONTRACT => 'Contract',
            self::TEMPORARY => 'Temporary',
            self::INTERN => 'Intern',
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
