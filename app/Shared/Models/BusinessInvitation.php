<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;

class BusinessInvitation extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'business_id',
        'email',
        'token',
        'role_id',
        'invited_by',
        'status',
        'expires_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'expires_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the business that the invitation is for.
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Get the role that the invited user will have.
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the user who sent the invitation.
     */
    public function inviter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'invited_by');
    }

    /**
     * Check if the invitation is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if the invitation has been accepted.
     */
    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    /**
     * Check if the invitation has been declined.
     */
    public function isDeclined(): bool
    {
        return $this->status === 'declined';
    }

    /**
     * Check if the invitation has expired.
     */
    public function isExpired(): bool
    {
        return $this->status === 'expired' ||
            ($this->expires_at && now()->gt($this->expires_at));
    }

    /**
     * Accept the invitation.
     */
    public function accept(): bool
    {
        if ($this->isExpired()) {
            return false;
        }

        $this->update(['status' => 'accepted']);

        return true;
    }

    /**
     * Decline the invitation.
     */
    public function decline(): bool
    {
        if ($this->isExpired()) {
            return false;
        }

        $this->update(['status' => 'declined']);

        return true;
    }

    /**
     * Generate a new invitation token.
     */
    public static function generateToken(): string
    {
        return Str::random(32);
    }
}
