<?php

namespace App\Tenant\Modules\HR\Enum;

enum DegreeType: string
{
    case CERTIFICATE = 'certificate';
    case DIPLOMA = 'diploma';
    case BACHELORS = 'bachelor';
    case MASTERS = 'master';
    case PHD = 'phd';
    case OTHER = 'other';

    public function label(): string
    {
        return match ($this) {
            self::CERTIFICATE => 'Certificate',
            self::DIPLOMA => 'Diploma',
            self::BACHELORS => "Bachelor's",
            self::MASTERS => "Master's",
            self::PHD => 'PhD',
            self::OTHER => 'Other',
        };
    }

    public static function options(): array
    {
        return collect(self::cases())->map(fn($case) => [
            'id' => $case->value,
            'name' => $case->label(),
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
