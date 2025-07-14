<?php

namespace App\Central\Models;

use App\Central\Enums\NotificationChannel;
use App\Central\Enums\NotificationType;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class NotificationTemplate extends Model
{
    use HasFactory, SoftDeletes, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code',
        'name',
        'description',
        'channels',
        'subject',
        'content',
        'variables',
        'notification_type',
        'is_active',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'channels' => 'array', // JSON array of NotificationChannel values
        'variables' => 'array',
        'notification_type' => NotificationType::class,
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    /**
     * Scope a query to only include active templates.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to only include templates containing a specific channel.
     */
    public function scopeWithChannel($query, NotificationChannel|string $channel)
    {
        $value = $channel instanceof NotificationChannel ? $channel->value : $channel;

        return $query->whereJsonContains('channels', $value);
    }
}
