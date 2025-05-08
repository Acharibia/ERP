<?php

namespace App\Support\Enums;

enum NotificationType: string
{
    case INFO = 'info';
    case SUCCESS = 'success';
    case WARNING = 'warning';
    case ERROR = 'error';

    /**
     * Get all available notification types as an array
     *
     * @return array
     */
    public static function toArray(): array
    {
        return [
            self::INFO->value => 'Information',
            self::SUCCESS->value => 'Success',
            self::WARNING->value => 'Warning',
            self::ERROR->value => 'Error',
        ];
    }

    /**
     * Get a formatted label for the notification type
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::INFO => 'Information',
            self::SUCCESS => 'Success',
            self::WARNING => 'Warning',
            self::ERROR => 'Error',
        };
    }

    /**
     * Get a color class for the notification type (for UI)
     *
     * @return string
     */
    public function color(): string
    {
        return match ($this) {
            self::INFO => 'blue',
            self::SUCCESS => 'green',
            self::WARNING => 'yellow',
            self::ERROR => 'red',
        };
    }

    /**
     * Get an icon class for the notification type (for UI)
     *
     * @return string
     */
    public function icon(): string
    {
        return match ($this) {
            self::INFO => 'info-circle',
            self::SUCCESS => 'check-circle',
            self::WARNING => 'alert-triangle',
            self::ERROR => 'alert-circle',
        };
    }
}
