<?php

namespace App\Central\Enums;

enum NotificationType: string
{
    case INFO = 'info';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';

    /**
     * Get human-readable label.
     */
    public function label(): string
    {
        return match ($this) {
            self::INFO => 'Info',
            self::SUCCESS => 'Success',
            self::WARNING => 'Warning',
            self::ERROR => 'Error',
        };
    }

    /**
     * Get all available values.
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get dropdown options.
     */
    public static function options(): array
    {
        return collect(self::cases())->map(fn($case) => [
            'id' => $case->value,
            'value' => $case->value,
            'name' => $case->label(),
        ])->toArray();
    }
}
