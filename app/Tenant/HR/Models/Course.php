<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class Course extends Model
{
    protected $fillable = [
        'program_id',
        'title',
        'description',
    ];

    public function program()
    {
        return $this->belongsTo(Program::class);
    }

    public function materials()
    {
        return $this->hasMany(CourseMaterial::class);
    }

    public function sessions()
    {
        return $this->hasMany(CourseSession::class);
    }

    public function assignments()
    {
        return $this->hasMany(CourseAssignment::class);
    }

    public function feedback()
    {
        return $this->hasMany(CourseFeedback::class);
    }
}
