<?php
namespace App\Tenant\HR\Models;

use Illuminate\Database\Eloquent\Model;

class Program extends Model
{
    protected $fillable = [
        'title',
        'description',
    ];

    public function courses()
    {
        return $this->hasMany(Course::class);
    }
}
