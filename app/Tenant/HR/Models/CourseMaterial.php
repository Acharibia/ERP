<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class CourseMaterial extends Model implements HasMedia
{
    use InteractsWithMedia;

    protected $fillable = [
        'course_id',
        'title',
        'url',
    ];

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
