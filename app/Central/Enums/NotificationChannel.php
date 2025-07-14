<?php

namespace App\Central\Enums;

enum NotificationChannel: string
{
    case EMAIL = 'email';
    case SMS = 'sms';
    case IN_APP = 'in-app';
    case PUSH = 'push';

    /**
     * Get human-readable label.
     */
    public function label(): string
    {
        return match ($this) {
            self::EMAIL => 'Email',
            self::SMS => 'SMS',
            self::IN_APP => 'In-App',
            self::PUSH => 'Push Notification',
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
