<?php
namespace App\Tenant\HR\Enum;

enum CourseMaterialType: string
{
    case PDF = 'pdf';
    case VIDEO = 'video';
    case IMAGE = 'image';
    case LINK = 'link';

    public function label(): string
    {
        return match ($this) {
            self::PDF => 'PDF',
            self::VIDEO => 'Video',
            self::IMAGE => 'Image',
            self::LINK => 'Link',
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
