<?php
namespace App\Tenant\HR\Enum;

enum PositionStatus: string {
    case ACTIVE   = 'active';
    case INACTIVE = 'inactive';

    /**
     * Get the display name for the position status.
     */
    public function label(): string
    {
        return match ($this) {
            self::ACTIVE => 'Active',
            self::INACTIVE => 'Inactive',
        };
    }

    /**
     * Get all statuses as options for frontend.
     */
    public static function options(): array
    {
        return collect(self::cases())->map(function ($case) {
            return [
                'id'    => $case->value,
                'name'  => $case->label(),
                'value' => $case->value,
            ];
        })->toArray();
    }

    /**
     * Get all status values.
     */
    public static function values(): array
    {
        return collect(self::cases())->pluck('value')->toArray();
    }

    /**
     * Get status enum from string value.
     */
    public static function fromValue(string $value): ?self
    {
        return collect(self::cases())->first(fn($case) => $case->value === $value);
    }

}
