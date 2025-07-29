<?php
namespace App\Tenant\Core\Models;

use App\Central\Models\User as CentralUser;
use App\Tenant\HR\Models\Employee;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    /**
     * The guard name for the model.
     *
     * @var string
     */
    protected $guard_name = 'web';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'global_id',
        'name',
        'email',
        'password',
        'email_verified_at',
        'status',
        'last_login_at',
        'last_login_ip',
        'password_changed_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at'   => 'datetime',
        'password'            => 'hashed',
        'last_login_at'       => 'datetime',
        'password_changed_at' => 'datetime',
    ];

    protected $appends = ['profile_picture'];

    public function centralUser()
    {
        return CentralUser::where('global_id', $this->global_id)->first();
    }

    public function getProfilePictureAttribute(): ?string
    {
        return $this->centralUser()?->getFirstMediaUrl('profile_picture');
    }

    /**
     * Check if the user is a business admin
     */
    public function isBusinessAdmin(): bool
    {
        return $this->hasRole('OWNER') || $this->hasRole('ADMINISTRATOR');
    }

    /**
     * Track user login
     */
    public function trackLogin(string $ipAddress): void
    {
        $this->last_login_at = now();
        $this->last_login_ip = $ipAddress;
        $this->save();
    }

    /**
     * Check if user is active
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }

    /**
     * Get the employee record associated with the user
     */
    public function employee(): HasOne
    {
        return $this->hasOne(Employee::class);
    }

}
