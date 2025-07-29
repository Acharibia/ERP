<?php
namespace App\Tenant\HR\Enum;

enum CourseAssignmentStatus: string
{
    case ASSIGNED = 'assigned';
    case IN_PROGRESS = 'in-progress';
    case COMPLETED = 'completed';
    case FAILED = 'failed';

    public function label(): string
    {
        return match ($this) {
            self::ASSIGNED => 'Assigned',
            self::IN_PROGRESS => 'In Progress',
            self::COMPLETED => 'Completed',
            self::FAILED => 'Failed',
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
