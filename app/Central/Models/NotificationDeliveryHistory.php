<?php

namespace App\Central\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class NotificationDeliveryHistory extends Model
{
    use HasFactory, CentralConnection;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'notification_delivery_history';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
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

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'success' => 'boolean',
        'data' => 'json',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user associated with the notification.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the template associated with the notification.
     */
    public function template()
    {
        return $this->belongsTo(NotificationTemplate::class, 'template_id');
    }

    /**
     * Scope a query to only include successful deliveries.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    /**
     * Scope a query to only include failed deliveries.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeFailed($query)
    {
        return $query->where('success', false);
    }

    /**
     * Create a delivery history record
     *
     * @param string $channel
     * @param string $recipient
     * @param string $templateCode
     * @param int|null $userId
     * @param int|null $templateId
     * @param bool $success
     * @param string|null $errorMessage
     * @param array|null $data
     * @return self
     */
    public static function log(
        string $channel,
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
            'channel' => $channel,
            'recipient' => $recipient,
            'template_id' => $templateId,
            'template_code' => $templateCode,
            'success' => $success,
            'error_message' => $errorMessage,
            'data' => $data,
        ]);
    }
}
