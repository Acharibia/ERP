<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class LearningPathAssignment extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'employee_id',
        'learning_path_id',
        'status',
        'completed_at',
    ];

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function learningPath()
    {
        return $this->belongsTo(LearningPath::class);
    }
}
