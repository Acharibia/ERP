<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class CourseFeedback extends Model
{
    protected $fillable = [
        'employee_id',
        'course_id',
        'session_id',
        'rating',
        'comments',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }

    public function session()
    {
        return $this->belongsTo(CourseSession::class, 'session_id');
    }
}
