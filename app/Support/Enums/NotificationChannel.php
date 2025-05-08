<?php

namespace App\Support\Enums;

enum NotificationChannel: string
{
    case EMAIL = 'email';
    case SMS = 'sms';
    case IN_APP = 'in-app';
    case PUSH = 'push';

    /**
     * Get all available notification channels as an array
     *
     * @return array
     */
    public static function toArray(): array
    {
        return [
            self::EMAIL->value => 'Email',
            self::SMS->value => 'SMS',
            self::IN_APP->value => 'In-App Notification',
            self::PUSH->value => 'Push Notification',
        ];
    }

    /**
     * Get a formatted label for the notification channel
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::EMAIL => 'Email',
            self::SMS => 'SMS',
            self::IN_APP => 'In-App Notification',
            self::PUSH => 'Push Notification',
        };
    }

    /**
     * Get an icon class for the notification channel (for UI)
     *
     * @return string
     */
    public function icon(): string
    {
        return match ($this) {
            self::EMAIL => 'mail',
            self::SMS => 'smartphone',
            self::IN_APP => 'bell',
            self::PUSH => 'broadcast',
        };
    }
}
