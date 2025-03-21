<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class ApiKey extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'key',
        'secret',
        'user_id',
        'business_id',
        'reseller_id',
        'scopes',
        'last_used',
        'ip_restrictions',
        'expires_at',
        'status',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'secret',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'scopes' => 'array',
        'ip_restrictions' => 'array',
        'last_used' => 'datetime',
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user who created the API key.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the business associated with the API key, if any.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the reseller associated with the API key, if any.
     */
    public function reseller(): BelongsTo
    {
        return $this->belongsTo(Reseller::class);
    }

    /**
     * Check if the API key is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active' &&
            ($this->expires_at === null || now()->lt($this->expires_at));
    }

    /**
     * Check if the API key has expired.
     */
    public function isExpired(): bool
    {
        return $this->expires_at !== null && now()->gt($this->expires_at);
    }

    /**
     * Check if the API key is allowed to be used from a specific IP.
     */
    public function isAllowedFromIp(string $ip): bool
    {
        // If no IP restrictions, allow from anywhere
        if (empty($this->ip_restrictions)) {
            return true;
        }

        return in_array($ip, $this->ip_restrictions);
    }

    /**
     * Check if the API key has a specific scope.
     */
    public function hasScope(string $scope): bool
    {
        return in_array($scope, $this->scopes);
    }

    /**
     * Mark the API key as used.
     */
    public function markAsUsed(): self
    {
        $this->update(['last_used' => now()]);

        return $this;
    }

    /**
     * Revoke the API key.
     */
    public function revoke(): self
    {
        $this->update(['status' => 'revoked']);

        return $this;
    }

    /**
     * Generate a new API key.
     */
    public static function generateKey(): string
    {
        return 'api_' . Str::random(32);
    }

    /**
     * Generate a new API secret.
     */
    public static function generateSecret(): string
    {
        return Str::random(64);
    }
}
