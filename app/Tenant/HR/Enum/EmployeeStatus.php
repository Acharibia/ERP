<?php
namespace App\Tenant\HR\Enum;

enum EmployeeStatus: string {
    case DRAFT     = 'draft';
    case FINALIZED = 'finalized';

    /**
     * Get the display name for the employee status.
     */
    public function label(): string
    {
        return match ($this) {
            self::DRAFT => 'Draft',
            self::FINALIZED => 'Finalized',
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
