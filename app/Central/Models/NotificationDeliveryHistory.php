<?php

namespace App\Central\Models;

use App\Central\Enums\NotificationChannel;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class NotificationDeliveryHistory extends Model
{
    use HasFactory, CentralConnection;

    protected $table = 'notification_delivery_history';

    protected $fillable = [
        'user_id',
        'channel',
        'recipient',
        'template_id',
        'template_code',
        'success',
        'error_message',
        'data',
    ];

    protected $casts = [
        'channel' => NotificationChannel::class,
        'success' => 'boolean',
        'data' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function template()
    {
        return $this->belongsTo(NotificationTemplate::class);
    }

    /**
     * Scopes
     */
    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    public function scopeFailed($query)
    {
        return $query->where('success', false);
    }

    /**
     * Create a delivery history record.
     */
    public static function log(
        NotificationChannel|string $channel,
        string $recipient,
        string $templateCode,
        ?int $userId = null,
        ?int $templateId = null,
        bool $success = true,
        ?string $errorMessage = null,
        ?array $data = null
    ): self {
        return self::create([
            'user_id' => $userId,
            'channel' => $channel instanceof NotificationChannel ? $channel->value : $channel,
            'recipient' => $recipient,
            'template_id' => $templateId,
            'template_code' => $templateCode,
            'success' => $success,
            'error_message' => $errorMessage,
            'data' => $data,
        ]);
    }

    /**
     * Get human-readable channel label (optional).
     */
    protected function channelLabel(): Attribute
    {
        return Attribute::get(
            fn() => $this->channel instanceof NotificationChannel
            ? $this->channel->label()
            : NotificationChannel::tryFrom($this->channel)?->label()
        );
    }
}
