<?php

namespace Database\Seeders\Central;

use Database\Seeders\Central\NotificationTemplates\HR\DepartmentNotificationTemplatesSeeder;
use Illuminate\Database\Seeder;

class NotificationTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->call([
            DepartmentNotificationTemplatesSeeder::class,
        ]);
        $this->command->info('Notification templates created successfully.');
    }
}
