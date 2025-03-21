<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserBusiness extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'business_id',
        'is_primary',
        'is_business_admin',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_primary' => 'boolean',
        'is_business_admin' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];


    /**
     * Create a new model instance from raw attributes.
     *
     * @param array $attributes
     * @param string|null $connection
     * @return static
     */
    public static function fromRawAttributes($attributes, $connection = null)
    {
        $model = new static;
        $model->setRawAttributes($attributes, true);
        $model->setConnection($connection ?: $model->getConnectionName());
        return $model;
    }

    /**
     * Get the user that this record belongs to
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the business that this record belongs to
     */
    public function business(): BelongsTo
    {
        return $this->belongsTo(Business::class);
    }

    /**
     * Scope a query to only include primary business relationships
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope a query to only include business admin relationships
     */
    public function scopeAdmin($query)
    {
        return $query->where('is_business_admin', true);
    }
}
