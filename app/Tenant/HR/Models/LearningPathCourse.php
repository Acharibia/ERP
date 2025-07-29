<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class LearningPathCourse extends Model
{
    protected $fillable = [
        'learning_path_id',
        'course_id',
        'order',
    ];

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
