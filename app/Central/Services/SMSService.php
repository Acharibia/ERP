<?php

namespace App\Central\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class SMSService
{
    /**
     * Send an SMS message
     *
     * @param string $to Recipient phone number
     * @param string $message The message content
     * @param array $options Additional sending options
     * @return bool Whether the SMS was sent successfully
     */
    public function send(string $to, string $message, array $options = []): bool
    {
        // Format phone number
        $phone = $this->formatPhoneNumber($to);

        if (!$this->isValidPhoneNumber($phone)) {
            Log::error('Invalid phone number for SMS', [
                'phone' => $to,
                'formatted' => $phone
            ]);
            return false;
        }

        try {
            // In a real implementation, you would use a service like Twilio, Vonage, etc.
            // For example with Twilio:
            /*
            $twilioSid = config('services.twilio.sid');
            $twilioToken = config('services.twilio.token');
            $twilioFrom = config('services.twilio.from');

            $client = new \Twilio\Rest\Client($twilioSid, $twilioToken);
            $client->messages->create(
                $phone,
                [
                    'from' => $twilioFrom,
                    'body' => $message
                ]
            );
            */

            // Placeholder implementation for now
            Log::info("SMS sent", [
                'to' => $phone,
                'message' => $message
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Failed to send SMS', [
                'to' => $phone,
                'error' => $e->getMessage()
            ]);

            return false;
        }
    }

    /**
     * Format a phone number for proper sending
     *
     * @param string $phoneNumber
     * @return string
     */
    private function formatPhoneNumber(string $phoneNumber): string
    {
        // Remove any non-numeric characters except leading +
        $cleaned = preg_replace('/[^0-9+]/', '', $phoneNumber);

        // Ensure it has international format with + prefix
        if (!Str::startsWith($cleaned, '+')) {
            // Default to US if no country code provided
            $defaultCountryCode = '+1';
            $cleaned = $defaultCountryCode . $cleaned;
        }

        return $cleaned;
    }

    /**
     * Validate if a phone number is valid
     *
     * @param string $phoneNumber
     * @return bool
     */
    private function isValidPhoneNumber(string $phoneNumber): bool
    {
        // Basic validation: must start with + and have at least 8 digits
        return preg_match('/^\+[0-9]{8,15}$/', $phoneNumber) === 1;
    }
}
