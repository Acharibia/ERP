<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class Trainer extends Model
{
    protected $fillable = [
        'employee_id',
        'name',
        'email',
        'phone',
        'type',
        'bio',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function sessions()
    {
        return $this->hasMany(CourseSession::class);
    }
}
