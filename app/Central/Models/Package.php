<?php

namespace App\Central\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class Package extends Model
{
    use HasFactory, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'description',
        'is_public',
        'base_price',
        'user_limit',
        'storage_limit',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_public' => 'boolean',
        'base_price' => 'decimal:2',
        'user_limit' => 'integer',
        'storage_limit' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get modules included in this package
     */
    public function modules(): BelongsToMany
    {
        return $this->belongsToMany(Module::class, 'package_modules')
            ->withTimestamps();
    }

    /**
     * Get subscriptions for this package
     */
    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    /**
     * Check if this package is public
     */
    public function isPublic(): bool
    {
        return $this->is_public;
    }

    /**
     * Check if this package has unlimited users
     */
    public function hasUnlimitedUsers(): bool
    {
        return $this->user_limit === null;
    }

    /**
     * Check if this package has unlimited storage
     */
    public function hasUnlimitedStorage(): bool
    {
        return $this->storage_limit === null;
    }

    /**
     * Check if this package includes a specific module
     */
    public function hasModule(string $moduleCode): bool
    {
        return $this->modules()->where('code', $moduleCode)->exists();
    }

    /**
     * Get the number of active subscriptions for this package
     */
    public function getActiveSubscriptionsCountAttribute(): int
    {
        return $this->subscriptions()->where('status', 'active')->count();
    }
}
