<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class LearningPath extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];

    public function courses()
    {
        return $this->belongsToMany(Course::class, 'learning_path_courses')->withPivot('order')->withTimestamps();
    }

    public function assignments()
    {
        return $this->hasMany(LearningPathAssignment::class);
    }
}
