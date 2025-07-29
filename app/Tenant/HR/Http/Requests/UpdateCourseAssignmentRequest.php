<?php
namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Tenant\HR\Enum\CourseAssignmentStatus;

class UpdateCourseAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'session_id' => 'nullable|exists:course_sessions,id',
            'status' => ['required', 'string', Rule::in(CourseAssignmentStatus::values())],
            'score' => 'nullable|integer|min:0',
            'completed_at' => 'nullable|date',
            'certificate' => 'nullable|file|max:10240', // 10MB max
        ];
    }
}
