<?php
namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Tenant\HR\Enum\CourseSessionMode;

class UpdateCourseSessionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'trainer_id' => 'nullable|exists:trainers,id',
            'start_time' => 'required|date',
            'end_time' => 'nullable|date|after_or_equal:start_time',
            'mode' => ['required', 'string', Rule::in(CourseSessionMode::values())],
            'location' => 'nullable|string|max:255',
        ];
    }
}
