<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class CourseSession extends Model
{
    protected $fillable = [
        'course_id',
        'trainer_id',
        'start_time',
        'end_time',
        'mode',
        'location',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function trainer()
    {
        return $this->belongsTo(Trainer::class);
    }

    public function assignments()
    {
        return $this->hasMany(CourseAssignment::class, 'session_id');
    }

    public function feedback()
    {
        return $this->hasMany(CourseFeedback::class, 'session_id');
    }
}
