<?php
namespace App\Tenant\HR\Enum;

enum CourseSessionMode: string
{
    case ONLINE = 'online';
    case IN_PERSON = 'in-person';

    public function label(): string
    {
        return match ($this) {
            self::ONLINE => 'Online',
            self::IN_PERSON => 'In-person',
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
