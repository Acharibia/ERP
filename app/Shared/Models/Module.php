<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Module extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
        'description',
        'version',
        'is_core',
        'status',
        'installation_script',
        'uninstallation_script',
        'icon_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_core' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get packages that include this module
     */
    public function packages(): BelongsToMany
    {
        return $this->belongsToMany(Package::class, 'package_modules')
            ->withTimestamps();
    }

    /**
     * Get businesses that have this module
     */
    public function businesses(): BelongsToMany
    {
        return $this->belongsToMany(Business::class, 'business_modules')
            ->withPivot('is_active', 'version')
            ->withTimestamps();
    }

    /**
     * Check if this module is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Check if this module is a core module
     */
    public function isCore(): bool
    {
        return $this->is_core;
    }

    /**
     * Check if this module is deprecated
     */
    public function isDeprecated(): bool
    {
        return $this->status === 'deprecated';
    }
}
