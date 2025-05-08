<?php

namespace App\Mail\Shared\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Queue\SerializesModels;

class TemplateMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * The email subject.
     *
     * @var string
     */
    public $emailSubject;

    /**
     * The email content.
     *
     * @var string
     */
    public $emailContent;

    /**
     * Additional data to pass to the view.
     *
     * @var array
     */
    public $data;

    /**
     * Create a new message instance.
     *
     * @param string $subject
     * @param string $content
     * @param array $data
     * @return void
     */
    public function __construct(string $subject, string $content, array $data = [])
    {
        $this->emailSubject = $subject;
        $this->emailContent = $content;
        $this->data = $data;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: $this->emailSubject,
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.template',
            with: [
                'subject' => $this->emailSubject,
                'content' => $this->emailContent,
                'data' => $this->data
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        $attachmentsList = [];

        // Add attachments if provided in data
        if (isset($this->data['attachments']) && is_array($this->data['attachments'])) {
            foreach ($this->data['attachments'] as $attachment) {
                if (isset($attachment['path'])) {
                    $attachmentItem = Attachment::fromPath($attachment['path']);

                    // Apply options if available
                    if (isset($attachment['options']) && is_array($attachment['options'])) {
                        if (isset($attachment['options']['as'])) {
                            $attachmentItem->as($attachment['options']['as']);
                        }

                        if (isset($attachment['options']['mime'])) {
                            $attachmentItem->withMime($attachment['options']['mime']);
                        }
                    }

                    $attachmentsList[] = $attachmentItem;
                }
            }
        }

        return $attachmentsList;
    }
}
