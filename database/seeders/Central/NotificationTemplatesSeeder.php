<?php

namespace Database\Seeders\Central;

use App\Central\Models\NotificationTemplate;
use App\Support\Enums\NotificationChannel;
use App\Support\Enums\NotificationType;
use Illuminate\Database\Seeder;

class NotificationTemplatesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            // Authentication Templates
            [
                'code' => 'auth.welcome',
                'name' => 'Welcome Email',
                'description' => 'Sent to users when they first register',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Welcome to {{app_name}}',
                'content' => '<h1>Welcome to {{app_name}}, {{user_name}}!</h1>
                <p>Thank you for joining us. We\'re excited to have you on board.</p>
                <p>You can access your dashboard at <a href="{{dashboard_url}}">{{dashboard_url}}</a>.</p>
                <p>If you have any questions, please contact our support team at {{support_email}}.</p>',
                'variables' => json_encode(['app_name', 'user_name', 'dashboard_url', 'support_email']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'auth.verification',
                'name' => 'Email Verification',
                'description' => 'Sent to verify user email addresses',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Verify Your Email Address',
                'content' => '<h1>Verify Your Email Address</h1>
                <p>Hello {{name}},</p>
                <p>Please verify your email address by clicking the button below:</p>
                <p><a href="{{verification_url}}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email Address</a></p>
                <p>This link will expire in {{expiry_hours}} hours.</p>
                <p>If you did not create an account, no further action is required.</p>',
                'variables' => json_encode(['name', 'verification_url', 'expiry_hours']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'auth.password_reset',
                'name' => 'Password Reset',
                'description' => 'Sent when a user requests a password reset',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Reset Your Password',
                'content' => '<h1>Reset Your Password</h1>
                <p>Hello {{name}},</p>
                <p>You are receiving this email because we received a password reset request for your account.</p>
                <p><a href="{{reset_url}}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
                <p>This password reset link will expire in {{expiry_hours}} hours.</p>
                <p>If you did not request a password reset, no further action is required.</p>',
                'variables' => json_encode(['name', 'reset_url', 'expiry_hours']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'auth.password_changed',
                'name' => 'Password Changed',
                'description' => 'Sent when a user changes their password',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Password Changed',
                'content' => '<h1>Password Changed</h1>
                <p>Hello {{user_name}},</p>
                <p>Your password was changed on {{changed_at}}.</p>
                <p>If you did not make this change, please contact us immediately at {{support_email}}.</p>',
                'variables' => json_encode(['user_name', 'changed_at', 'support_email']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'auth.two_factor',
                'name' => 'Two-Factor Authentication Code',
                'description' => 'Sent when a user logs in with 2FA enabled',
                'channel' => NotificationChannel::SMS->value,
                'content' => 'Your {{app_name}} verification code is: {{code}}. It expires in {{expiry_minutes}} minutes.',
                'variables' => json_encode(['app_name', 'code', 'expiry_minutes']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],

            // Admin Templates
            [
                'code' => 'admin.new_reseller',
                'name' => 'New Reseller Notification (Email)',
                'description' => 'Sent to admins when a new reseller registers',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'New Reseller Registration',
                'content' => '<h1>New Reseller Registration</h1>
                <p>Hello {{admin_name}},</p>
                <p>A new reseller has registered:</p>
                <p><strong>Company Name:</strong> {{reseller_name}}<br>
                <strong>Email:</strong> {{reseller_email}}<br>
                <strong>Phone:</strong> {{reseller_phone}}<br>
                <strong>Registration Date:</strong> {{registration_date}}</p>
                <p>You can view and manage this reseller from your <a href="{{admin_url}}">admin dashboard</a>.</p>',
                'variables' => json_encode(['admin_name', 'reseller_name', 'reseller_email', 'reseller_phone', 'registration_date', 'admin_url']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'admin.new_reseller',
                'name' => 'New Reseller Notification (In-App)',
                'description' => 'In-app notification for admins about new resellers',
                'channel' => NotificationChannel::IN_APP->value,
                'subject' => 'New Reseller Registration',
                'content' => 'New reseller registered: {{reseller_name}} ({{reseller_email}})',
                'variables' => json_encode(['admin_name', 'reseller_name', 'reseller_email', 'registration_date', 'admin_url']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],

            // Reseller Templates
            [
                'code' => 'reseller.welcome',
                'name' => 'Reseller Welcome',
                'description' => 'Sent to new resellers',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Welcome to Our Reseller Program',
                'content' => '<h1>Welcome to Our Reseller Program!</h1>
                <p>Hello {{user_name}},</p>
                <p>Thank you for registering {{reseller_name}} as a reseller. We\'re excited to have you on board.</p>
                <p>You can access your reseller dashboard at <a href="{{dashboard_url}}">{{dashboard_url}}</a>.</p>
                <p>If you have any questions, please contact our partner support team at {{support_email}}.</p>',
                'variables' => json_encode(['reseller_name', 'user_name', 'dashboard_url', 'support_email']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.welcome',
                'name' => 'Reseller Welcome (In-App)',
                'description' => 'In-app welcome notification for new resellers',
                'channel' => NotificationChannel::IN_APP->value,
                'subject' => 'Welcome to Our Reseller Program',
                'content' => 'Welcome to our Reseller Program, {{user_name}}! Your account for {{reseller_name}} has been created successfully.',
                'variables' => json_encode(['reseller_name', 'user_name', 'dashboard_url']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.new_client',
                'name' => 'New Client Notification',
                'description' => 'Sent to resellers when they get a new client',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'New Client Registration',
                'content' => '<h1>New Client Registration</h1>
                <p>Hello {{reseller_name}},</p>
                <p>A new client has registered with your reseller account:</p>
                <p><strong>Business Name:</strong> {{business_name}}<br>
                <strong>Email:</strong> {{business_email}}<br>
                <strong>Subscription Plan:</strong> {{subscription_plan}}</p>
                <p>You can view and manage this client from your <a href="{{dashboard_url}}">dashboard</a>.</p>',
                'variables' => json_encode(['reseller_name', 'business_name', 'business_email', 'subscription_plan', 'dashboard_url']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.status_changed',
                'name' => 'Reseller Status Changed',
                'description' => 'Sent when a reseller\'s status changes',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Reseller Status Has Changed',
                'content' => '<h1>Reseller Status Change</h1>
                <p>Hello {{user_name}},</p>
                <p>The status of your reseller account ({{reseller_name}}) has been changed from <strong>{{old_status}}</strong> to <strong>{{new_status}}</strong>.</p>
                <p>This change was made on {{changed_at}}.</p>
                <p>If you have any questions, please contact our support team at {{support_email}}.</p>',
                'variables' => json_encode(['user_name', 'reseller_name', 'old_status', 'new_status', 'changed_at', 'support_email']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.verification_status_changed',
                'name' => 'Verification Status Changed',
                'description' => 'Notification about verification status changes',
                'channel' => NotificationChannel::IN_APP->value,
                'subject' => 'Verification Status Changed',
                'content' => 'Your verification status has changed from {{old_status}} to {{new_status}}.',
                'variables' => json_encode(['user_name', 'reseller_name', 'old_status', 'new_status', 'changed_at']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.activated',
                'name' => 'Reseller Activated',
                'description' => 'Sent when a reseller is activated',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Reseller Account Has Been Activated',
                'content' => '<h1>Reseller Account Activated</h1>
                <p>Hello {{user_name}},</p>
                <p>We\'re pleased to inform you that your reseller account for {{reseller_name}} has been activated as of {{activation_date}}.</p>
                <p>You now have full access to all reseller features and can start onboarding clients.</p>
                <p>Visit your <a href="{{dashboard_url}}">reseller dashboard</a> to get started.</p>',
                'variables' => json_encode(['user_name', 'reseller_name', 'activation_date', 'dashboard_url']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.suspended',
                'name' => 'Reseller Suspended',
                'description' => 'Sent when a reseller is suspended',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Reseller Account Has Been Suspended',
                'content' => '<h1>Reseller Account Suspended</h1>
                <p>Hello {{user_name}},</p>
                <p>We regret to inform you that your reseller account for {{reseller_name}} has been suspended as of {{suspension_date}}.</p>
                <p><strong>Reason:</strong> {{reason}}</p>
                <p>During this suspension, you will have limited access to the platform. Please contact our support team at {{support_email}} to resolve this issue.</p>',
                'variables' => json_encode(['user_name', 'reseller_name', 'suspension_date', 'reason', 'support_email']),
                'notification_type' => NotificationType::ERROR->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.verification_approved',
                'name' => 'Verification Approved',
                'description' => 'Sent when a reseller\'s verification is approved',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Reseller Verification Has Been Approved',
                'content' => '<h1>Verification Approved</h1>
                <p>Hello {{user_name}},</p>
                <p>We\'re pleased to inform you that your reseller verification for {{reseller_name}} has been approved.</p>
                <p>You now have full access to all reseller features and can start onboarding clients.</p>
                <p>Visit your <a href="{{dashboard_url}}">reseller dashboard</a> to get started.</p>',
                'variables' => json_encode(['user_name', 'reseller_name', 'verification_date', 'dashboard_url']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'reseller.verification_rejected',
                'name' => 'Verification Rejected',
                'description' => 'Sent when a reseller\'s verification is rejected',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Reseller Verification Has Been Rejected',
                'content' => '<h1>Verification Rejected</h1>
                <p>Hello {{user_name}},</p>
                <p>We regret to inform you that your reseller verification for {{reseller_name}} has been rejected.</p>
                <p><strong>Reason:</strong> {{reason}}</p>
                <p>Please contact our support team at {{support_email}} to address this issue and resubmit your verification.</p>',
                'variables' => json_encode(['user_name', 'reseller_name', 'rejection_date', 'reason', 'support_email']),
                'notification_type' => NotificationType::ERROR->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],

            // Subscription Templates
            [
                'code' => 'subscription.renewal_reminder',
                'name' => 'Subscription Renewal Reminder',
                'description' => 'Sent before a subscription expires',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Subscription Will Renew Soon',
                'content' => '<h1>Subscription Renewal Reminder</h1>
                <p>Hello {{user_name}},</p>
                <p>This is a reminder that the subscription for {{business_name}} to {{subscription_name}} will renew on {{expiry_date}}.</p>
                <p>The renewal price will be {{renewal_price}}.</p>
                <p>To manage your subscription, visit <a href="{{renewal_url}}">your subscription page</a>.</p>',
                'variables' => json_encode(['business_name', 'user_name', 'subscription_name', 'expiry_date', 'renewal_price', 'renewal_url']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'subscription.expiration',
                'name' => 'Subscription Expiration Warning',
                'description' => 'Sent when a subscription is about to expire',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Your Subscription Is About to Expire',
                'content' => '<h1>Subscription Expiration Warning</h1>
                <p>Hello {{user_name}},</p>
                <p>Your subscription for {{business_name}} will expire in {{days_remaining}} days on {{expiration_date}}.</p>
                <p>To renew your subscription and avoid service interruption, please visit <a href="{{renewal_url}}">your subscription page</a>.</p>',
                'variables' => json_encode(['business_name', 'user_name', 'days_remaining', 'expiration_date', 'renewal_url']),
                'notification_type' => NotificationType::WARNING->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],

            // Payment Templates
            [
                'code' => 'payment.confirmation',
                'name' => 'Payment Confirmation',
                'description' => 'Sent when a payment is processed',
                'channel' => NotificationChannel::SMS->value,
                'content' => 'Your payment of {{amount}} for invoice #{{invoice_number}} was successfully processed on {{date}}. Thank you.',
                'variables' => json_encode(['amount', 'invoice_number', 'date']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'payment.receipt',
                'name' => 'Payment Receipt',
                'description' => 'Sent after successful payment',
                'channel' => NotificationChannel::EMAIL->value,
                'subject' => 'Payment Receipt - Invoice #{{invoice_number}}',
                'content' => '<h1>Payment Receipt</h1>
                <p>Hello {{user_name}},</p>
                <p>Thank you for your payment. Here is your receipt:</p>
                <p><strong>Invoice #:</strong> {{invoice_number}}<br>
                <strong>Date:</strong> {{payment_date}}<br>
                <strong>Amount:</strong> {{amount}}<br>
                <strong>Payment Method:</strong> {{payment_method}}</p>
                <p>You can view and download the full invoice from <a href="{{invoice_url}}">your billing page</a>.</p>',
                'variables' => json_encode(['user_name', 'invoice_number', 'payment_date', 'amount', 'payment_method', 'invoice_url']),
                'notification_type' => NotificationType::SUCCESS->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],

            // In-App Notifications
            [
                'code' => 'system.maintenance',
                'name' => 'System Maintenance Notice',
                'description' => 'Notifies users of upcoming maintenance',
                'channel' => NotificationChannel::IN_APP->value,
                'subject' => 'Scheduled Maintenance',
                'content' => 'Our system will be undergoing maintenance on {{maintenance_date}} from {{start_time}} to {{end_time}} {{timezone}}. During this time, the system may be temporarily unavailable.',
                'variables' => json_encode(['maintenance_date', 'start_time', 'end_time', 'timezone']),
                'notification_type' => NotificationType::WARNING->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
            [
                'code' => 'system.new_feature',
                'name' => 'New Feature Announcement',
                'description' => 'Announces new system features',
                'channel' => NotificationChannel::IN_APP->value,
                'subject' => 'New Feature: {{feature_name}}',
                'content' => 'We\'ve added a new feature: {{feature_name}}. {{feature_description}}',
                'variables' => json_encode(['feature_name', 'feature_description', 'learn_more_url']),
                'notification_type' => NotificationType::INFO->value,
                'is_system' => true,
                'is_active' => true,
                'access_level' => 'system',
            ],
        ];

        foreach ($templates as $template) {
            NotificationTemplate::updateOrCreate(
                ['code' => $template['code'], 'channel' => $template['channel']],
                $template
            );
        }
        $this->command->info('Notification templates created successfully.');
    }
}
