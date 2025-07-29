<?php
namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use App\Tenant\HR\Enum\LearningPathAssignmentStatus;

class UpdateLearningPathAssignmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'status' => ['required', 'string', Rule::in(LearningPathAssignmentStatus::values())],
            'completed_at' => 'nullable|date',
            'certificate' => 'nullable|file|max:10240', // 10MB max
        ];
    }
}
