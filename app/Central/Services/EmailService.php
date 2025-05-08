<?php

namespace App\Central\Services;

use Illuminate\Mail\Mailable;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailService
{
    /**
     * Send an email
     *
     * @param string|array $to Recipient email address(es)
     * @param Mailable $mailable The mailable to send
     * @param array $options Additional mailing options (cc, bcc)
     * @return bool Whether the email was sent successfully
     */
    public function send($to, Mailable $mailable, array $options = []): bool
    {
        \Log::info('Sending email', [
            'to' => $to,
            'mailable' => get_class($mailable),
            'options' => $options
        ]);
        try {
            Mail::to($to)
                ->when(!empty($options['cc']), function ($mail) use ($options) {
                    $mail->cc($options['cc']);
                })
                ->when(!empty($options['bcc']), function ($mail) use ($options) {
                    $mail->bcc($options['bcc']);
                })
                ->send($mailable);

                \Log::info('Email sent', [
                    'to' => $to,
                    'mailable' => get_class($mailable),
                    'options' => $options
                ]);
            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send email', [
                'to' => $to,
                'mailable' => get_class($mailable),
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }
}
