<?php

namespace App\Shared\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Models\Permission as SpatiePermission;
use Stancl\Tenancy\Database\Concerns\CentralConnection;

class Permission extends SpatiePermission
{
    use HasFactory, CentralConnection;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'guard_name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * The roles that belong to the permission.
     */
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(
            Role::class,
            'role_has_permissions',
            'permission_id',
            'role_id'
        );
    }

    /**
     * The models that have direct assignment of this permission.
     */
    public function models(): BelongsToMany
    {
        return $this->morphedByMany(
            Model::class,
            'model',
            'model_has_permissions',
            'permission_id',
            'model_id'
        );
    }

    /**
     * Get all permissions grouped by module.
     */
    public static function getGroupedPermissions(): array
    {
        $permissions = self::orderBy('name')->get();

        $grouped = [];

        foreach ($permissions as $permission) {
            // Split the name to get the module (e.g., 'users.create' -> 'users')
            $parts = explode('.', $permission->name);

            if (count($parts) >= 2) {
                $module = $parts[0];

                if (!isset($grouped[$module])) {
                    $grouped[$module] = [];
                }

                $grouped[$module][] = $permission;
            } else {
                // If no dot notation, put under 'other'
                if (!isset($grouped['other'])) {
                    $grouped['other'] = [];
                }

                $grouped['other'][] = $permission;
            }
        }

        return $grouped;
    }
}
