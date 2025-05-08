<?php

namespace App\Central\Services;

use App\Mail\Shared\Mail\TemplateMail;
use App\Central\Models\User;
use App\Central\Models\NotificationDeliveryHistory;
use App\Central\Repositories\NotificationTemplateRepository;
use App\Support\Enums\NotificationChannel;
use App\Support\Enums\NotificationType;
use Illuminate\Support\Facades\Log;

class NotificationService
{
    protected EmailService $emailService;
    protected SMSService $smsService;
    protected NotificationTemplateRepository $templateRepository;

    /**
     * Create a new NotificationService instance.
     *
     * @param EmailService $emailService
     * @param SMSService $smsService
     * @param NotificationTemplateRepository $templateRepository
     */
    public function __construct(
        EmailService $emailService,
        SMSService $smsService,
        NotificationTemplateRepository $templateRepository
    ) {
        $this->emailService = $emailService;
        $this->smsService = $smsService;
        $this->templateRepository = $templateRepository;
    }

    /**
     * Send an email notification using a template
     *
     * @param string|array $to Email recipient(s)
     * @param string $templateCode Template identifier
     * @param array $variables Variables to replace in the template
     * @param array $options Additional email options
     * @return bool Success status
     */
    public function sendEmailNotification($to, string $templateCode, array $variables = [], array $options = []): bool
    {
        try {
            // Find template in the database
            $template = $this->templateRepository->findByCodeAndChannel($templateCode, NotificationChannel::EMAIL);

            if (!$template) {
                Log::error("Email template not found: $templateCode");
                NotificationDeliveryHistory::log(
                    NotificationChannel::EMAIL->value,
                    is_array($to) ? implode(',', $to) : $to,
                    $templateCode,
                    $options['user_id'] ?? null,
                    null,
                    false,
                    "Template not found"
                );
                return false;
            }

            // Process template content
            $subject = $this->replaceVariables($template->subject, $variables);
            $content = $this->replaceVariables($template->content, $variables);

            // Create email mailable
            $email = new TemplateMail($subject, $content, $variables);

            // Send the email
            $success = $this->emailService->send($to, $email, $options);

            // Log the delivery attempt
            NotificationDeliveryHistory::log(
                NotificationChannel::EMAIL->value,
                is_array($to) ? implode(',', $to) : $to,
                $templateCode,
                $options['user_id'] ?? null,
                $template->id,
                $success,
                $success ? null : "Failed to send email",
                $success ? $variables : null
            );

            return $success;

        } catch (\Exception $e) {
            Log::error('Failed to send email notification', [
                'template' => $templateCode,
                'error' => $e->getMessage()
            ]);

            // Log the failed delivery
            NotificationDeliveryHistory::log(
                NotificationChannel::EMAIL->value,
                is_array($to) ? implode(',', $to) : $to,
                $templateCode,
                $options['user_id'] ?? null,
                null,
                false,
                $e->getMessage()
            );

            return false;
        }
    }

    /**
     * Send an SMS notification using a template
     *
     * @param string $to Phone number
     * @param string $templateCode Template identifier
     * @param array $variables Variables to replace in the template
     * @param array $options Additional SMS options
     * @return bool Success status
     */
    public function sendSmsNotification(string $to, string $templateCode, array $variables = [], array $options = []): bool
    {
        try {
            // Find template in the database
            $template = $this->templateRepository->findByCodeAndChannel($templateCode, NotificationChannel::SMS);

            if (!$template) {
                Log::error("SMS template not found: $templateCode");
                NotificationDeliveryHistory::log(
                    NotificationChannel::SMS->value,
                    $to,
                    $templateCode,
                    $options['user_id'] ?? null,
                    null,
                    false,
                    "Template not found"
                );
                return false;
            }

            // Process template content
            $message = $this->replaceVariables($template->content, $variables);

            // Send the SMS
            $success = $this->smsService->send($to, $message, $options);

            // Log the delivery attempt
            NotificationDeliveryHistory::log(
                NotificationChannel::SMS->value,
                $to,
                $templateCode,
                $options['user_id'] ?? null,
                $template->id,
                $success,
                $success ? null : "Failed to send SMS",
                $success ? $variables : null
            );

            return $success;

        } catch (\Exception $e) {
            Log::error('Failed to send SMS notification', [
                'template' => $templateCode,
                'error' => $e->getMessage()
            ]);

            // Log the failed delivery
            NotificationDeliveryHistory::log(
                NotificationChannel::SMS->value,
                $to,
                $templateCode,
                $options['user_id'] ?? null,
                null,
                false,
                $e->getMessage()
            );

            return false;
        }
    }

    /**
     * Create an in-app notification for a user
     *
     * @param User $user
     * @param string $templateCode
     * @param array $variables
     * @return bool
     */
    public function createInAppNotification(User $user, string $templateCode, array $variables = []): bool
    {
        try {
            // Find template in the database
            $template = $this->templateRepository->findByCodeAndChannel($templateCode, NotificationChannel::IN_APP);

            if (!$template) {
                Log::error("In-app notification template not found: $templateCode");
                NotificationDeliveryHistory::log(
                    NotificationChannel::IN_APP->value,
                    $user->email,
                    $templateCode,
                    $user->id,
                    null,
                    false,
                    "Template not found"
                );
                return false;
            }

            // Process template content
            $title = $this->replaceVariables($template->subject, $variables);
            $message = $this->replaceVariables($template->content, $variables);

            // Create notification in database
            $user->notifications()->create([
                'title' => $title,
                'message' => $message,
                'type' => $template->notification_type ?? NotificationType::INFO->value,
                'is_read' => false,
                'link' => $variables['link'] ?? null,
                'data' => !empty($variables) ? $variables : null,
            ]);

            // Log the successful delivery
            NotificationDeliveryHistory::log(
                NotificationChannel::IN_APP->value,
                $user->email,
                $templateCode,
                $user->id,
                $template->id,
                true,
                null,
                $variables
            );

            return true;

        } catch (\Exception $e) {
            Log::error('Failed to create in-app notification', [
                'template' => $templateCode,
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);

            // Log the failed delivery
            NotificationDeliveryHistory::log(
                NotificationChannel::IN_APP->value,
                $user->email,
                $templateCode,
                $user->id,
                null,
                false,
                $e->getMessage()
            );

            return false;
        }
    }

    /**
     * Replace variables in a template string
     *
     * @param string $content
     * @param array $variables
     * @return string
     */
    private function replaceVariables(string $content, array $variables): string
    {
        foreach ($variables as $key => $value) {
            $content = str_replace('{{' . $key . '}}', $value, $content);
        }

        return $content;
    }
}
