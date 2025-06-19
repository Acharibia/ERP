<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDepartmentRequest extends FormRequest
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
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:departments,email',
            'code' => 'required|string|max:4|unique:departments,code',
            'description' => 'nullable|string',
            'parent_id' => 'nullable|exists:departments,id',
            'manager_id' => 'nullable|exists:employees,id',
            'budget' => 'nullable|numeric|min:0',
            'cost_center' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'status' => 'string|in:active,inactive',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Department name is required.',
            'name.max' => 'Department name cannot exceed 255 characters.',
            'code.required' => 'Department code is required.',
            'code.unique' => 'This department code is already taken.',
            'code.max' => 'Department code cannot exceed 50 characters.',
            'parent_id.exists' => 'Selected parent department does not exist.',
            'manager_id.exists' => 'Selected manager does not exist.',
            'budget.numeric' => 'Budget must be a valid number.',
            'budget.min' => 'Budget cannot be negative.',
            'cost_center.max' => 'Cost center cannot exceed 255 characters.',
            'location.max' => 'Location cannot exceed 255 characters.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     */
    public function attributes(): array
    {
        return [
            'parent_id' => 'parent department',
            'manager_id' => 'department manager',
            'cost_center' => 'cost center',
            'is_active' => 'status',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        if ($this->has('is_active') && is_null($this->is_active)) {
            $this->merge([
                'is_active' => true,
            ]);
        }
    }
}
