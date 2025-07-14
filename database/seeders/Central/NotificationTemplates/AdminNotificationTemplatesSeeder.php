<?php

namespace Database\Seeders\Central;

use App\Central\Enums\NotificationChannel;
use App\Central\Enums\NotificationType;
use Illuminate\Database\Seeder;
use App\Central\Models\NotificationTemplate;

class AdminNotificationTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'code' => 'admin.new_reseller',
                'name' => 'New Reseller Registered',
                'description' => 'Notifies admins when a new reseller registers.',
                'channels' => [
                    NotificationChannel::EMAIL->value,
                    NotificationChannel::IN_APP->value,
                ],
                'subject' => 'New Reseller Registration',
                'content' => '<h1>New Reseller Registration</h1>
<p>Name: {{reseller_name}}</p>
<p>Email: {{reseller_email}}</p>
<p>Phone: {{reseller_phone}}</p>
<p>Date: {{registration_date}}</p>',
                'variables' => [
                    'reseller_name',
                    'reseller_email',
                    'reseller_phone',
                    'registration_date',
                ],
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

        $this->command->info('Admin notification templates seeded.');
    }
}
