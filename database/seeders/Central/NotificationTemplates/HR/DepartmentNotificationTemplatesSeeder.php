<?php

namespace Database\Seeders\Central\NotificationTemplates\HR;

use App\Central\Enums\NotificationChannel;
use App\Central\Enums\NotificationType;
use App\Central\Models\NotificationTemplate;
use Illuminate\Database\Seeder;

class DepartmentNotificationTemplatesSeeder extends Seeder
{
    public function run(): void
    {
        $templates = [
            [
                'code' => 'hr.department.created',
                'name' => 'Department Created',
                'description' => 'Sent when a new department is created.',
                'channels' => [NotificationChannel::IN_APP->value, NotificationChannel::EMAIL->value],
                'subject' => 'New Department Created: {{department_name}}',
                'content' => 'A new department named "{{department_name}}" has been successfully created by {{created_by}}.',
                'variables' => ['department_name', 'created_by'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
            [
                'code' => 'hr.department.updated',
                'name' => 'Department Updated',
                'description' => 'Sent when a department is updated.',
                'channels' => [NotificationChannel::IN_APP->value],
                'subject' => 'Department Updated: {{department_name}}',
                'content' => 'The department "{{department_name}}" was updated by {{updated_by}}.',
                'variables' => ['department_name', 'updated_by'],
                'notification_type' => NotificationType::INFO->value,
                'is_active' => true,
            ],
            [
                'code' => 'hr.department.activated',
                'name' => 'Department Activated',
                'description' => 'Sent when a department is activated.',
                'channels' => [NotificationChannel::IN_APP->value],
                'subject' => 'Department Activated: {{department_name}}',
                'content' => 'The department "{{department_name}}" has been activated by {{activated_by}}.',
                'variables' => ['department_name', 'activated_by'],
                'notification_type' => NotificationType::SUCCESS->value,
                'is_active' => true,
            ],
            [
                'code' => 'hr.department.suspended',
                'name' => 'Department Suspended',
                'description' => 'Sent when a department is suspended.',
                'channels' => [NotificationChannel::IN_APP->value],
                'subject' => 'Department Suspended: {{department_name}}',
                'content' => 'The department "{{department_name}}" has been suspended by {{suspended_by}}.',
                'variables' => ['department_name', 'suspended_by'],
                'notification_type' => NotificationType::WARNING->value,
                'is_active' => true,
            ],
            [
                'code' => 'hr.department.deactivated',
                'name' => 'Department Deactivated',
                'description' => 'Sent when a department is marked inactive.',
                'channels' => [NotificationChannel::IN_APP->value],
                'subject' => 'Department Inactivated: {{department_name}}',
                'content' => 'The department "{{department_name}}" has been marked as inactive by {{deactivated_by}}.',
                'variables' => ['department_name', 'deactivated_by'],
                'notification_type' => NotificationType::WARNING->value,
                'is_active' => true,
            ],
            [
                'code' => 'hr.department.deleted',
                'name' => 'Department Deleted',
                'description' => 'Sent when a department is deleted.',
                'channels' => [NotificationChannel::EMAIL->value],
                'subject' => 'Department Deleted: {{department_name}}',
                'content' => 'The department "{{department_name}}" was deleted by {{deleted_by}}.',
                'variables' => ['department_name', 'deleted_by'],
                'notification_type' => NotificationType::ERROR->value,
                'is_active' => true,
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['code' => $template['code']],
                $template
            );
        }
    }
}
