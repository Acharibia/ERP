<?php
namespace App\Tenant\HR\Enum;

enum CourseDeliveryType: string
{
    case VIDEO = 'video';
    case DOCUMENT = 'document';
    case LIVE = 'live';

    public function label(): string
    {
        return match ($this) {
            self::VIDEO => 'Video',
            self::DOCUMENT => 'Document',
            self::LIVE => 'Live',
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
