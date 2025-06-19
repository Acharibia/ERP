<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use App\Tenant\Modules\HR\Enum\EmploymentType;
use App\Tenant\Modules\HR\Enum\PositionLevel;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StorePositionRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'code' => ['required', 'string', 'max:255', 'unique:positions,code'],
            'description' => ['nullable', 'string'],
            'requirements' => ['nullable', 'string'],
            'responsibilities' => ['nullable', 'string'],
            'department_id' => ['nullable', 'exists:departments,id'],
            'employment_type' => ['required', 'string', Rule::in(EmploymentType::values())],
            'position_level' => ['nullable', 'string', Rule::in(PositionLevel::values())],
            'min_salary' => ['nullable', 'numeric', 'min:0'],
            'max_salary' => ['nullable', 'numeric', 'min:0', 'gte:min_salary'],
            'status' => ['required', 'string', Rule::in(['active', 'inactive'])],
        ];
    }

    /**
     * Get custom attribute names for validator errors.
     */
    public function attributes(): array
    {
        return [
            'title' => 'position title',
            'code' => 'position code',
            'department_id' => 'department',
            'employment_type' => 'employment type',
            'position_level' => 'position level',
            'min_salary' => 'minimum salary',
            'max_salary' => 'maximum salary',
        ];
    }

    /**
     * Get custom validation messages.
     */
    public function messages(): array
    {
        return [
            'code.unique' => 'This position code is already taken.',
            'max_salary.gte' => 'The maximum salary must be greater than or equal to the minimum salary.',
            'department_id.exists' => 'The selected department does not exist.',
            'employment_type.in' => 'The selected employment type is invalid.',
            'position_level.in' => 'The selected position level is invalid.',
        ];
    }
}
