<?php
namespace App\Tenant\HR\Enum;

enum EmploymentStatus: string {
    case ACTIVE     = 'active';
    case INACTIVE   = 'inactive';
    case ON_LEAVE   = 'on_leave';
    case TERMINATED = 'terminated';
    case PROBATION  = 'probation';

    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Active',
            self::INACTIVE => 'Inactive',
            self::ON_LEAVE => 'On Leave',
            self::TERMINATED => 'Terminated',
            self::PROBATION => 'Probation',
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
