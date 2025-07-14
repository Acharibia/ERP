<?php

namespace Database\Seeders\Central;

use App\Central\Enums\NotificationChannel;
use App\Central\Enums\NotificationType;
use Illuminate\Database\Seeder;
use App\Central\Models\NotificationTemplate;

class AuthNotificationTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'code' => 'auth.welcome',
                'name' => 'Welcome Email',
                'description' => 'Sent to users after successful registration.',
                'channels' => [NotificationChannel::EMAIL->value],
                'subject' => 'Welcome to {{app_name}}',
                'content' => '<h1>Welcome, {{user_name}}!</h1><p>Thanks for joining {{app_name}}.</p>',
                'variables' => ['user_name', 'app_name'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
            [
                'code' => 'auth.email_verification',
                'name' => 'Email Verification',
                'description' => 'Sent to users to verify their email address.',
                'channels' => [NotificationChannel::EMAIL->value],
                'subject' => 'Verify Your Email Address',
                'content' => '<p>Hello {{name}}, click here to verify: {{verification_url}}</p>',
                'variables' => ['name', 'verification_url'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
            [
                'code' => 'auth.password_reset',
                'name' => 'Password Reset',
                'description' => 'Sent when users request a password reset.',
                'channels' => [NotificationChannel::EMAIL->value],
                'subject' => 'Reset Your Password',
                'content' => '<p>Hello {{name}}, use this link: {{reset_url}}. It expires in {{expiry_hours}} hours.</p>',
                'variables' => ['name', 'reset_url', 'expiry_hours'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
            [
                'code' => 'auth.password_changed',
                'name' => 'Password Changed',
                'description' => 'Notifies users when their password is changed.',
                'channels' => [NotificationChannel::EMAIL->value],
                'subject' => 'Password Changed',
                'content' => '<p>Your password was changed on {{changed_at}}. If this wasn’t you, contact {{support_email}}.</p>',
                'variables' => ['changed_at', 'support_email'],
                'notification_type' => NotificationType::WARNING->value,
                'is_active' => true,
            ],
            [
                'code' => 'auth.two_factor',
                'name' => '2FA Verification Code',
                'description' => 'Sent to users during 2FA login.',
                'channels' => [NotificationChannel::SMS->value],
                'subject' => null,
                'content' => 'Your code is {{code}}. It expires in {{expiry_minutes}} minutes.',
                'variables' => ['code', 'expiry_minutes'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['code' => $template['code']],
                [
                    'name' => $template['name'],
                    'description' => $template['description'],
                    'channels' => $template['channels'],
                    'subject' => $template['subject'] ?? null,
                    'content' => $template['content'],
                    'variables' => $template['variables'],
                    'notification_type' => $template['notification_type'],
                    'is_active' => $template['is_active'],
                ]
            );
        }

        $this->command->info('Auth notification templates seeded.');
    }
}
