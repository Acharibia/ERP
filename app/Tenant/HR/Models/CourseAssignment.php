<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CourseAssignment extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'employee_id',
        'course_id',
        'session_id',
        'status',
        'score',
        'completed_at',
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
