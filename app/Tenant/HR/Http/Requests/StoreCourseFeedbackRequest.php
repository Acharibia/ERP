<?php
namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreCourseFeedbackRequest extends FormRequest
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
            'rating' => 'required|integer|min:1|max:5',
            'comments' => 'nullable|string',
        ];
    }
}
