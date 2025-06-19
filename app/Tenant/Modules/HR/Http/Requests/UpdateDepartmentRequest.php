<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // You can add authorization logic here
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $department = $this->route('department');

        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('departments', 'email')->ignore($department->id),
            ],
            'code' => [
                'required',
                'string',
                'max:4',
                Rule::unique('departments', 'code')->ignore($department->id),
            ],
            'description' => 'nullable|string',
            'parent_id' => [
                'nullable',
                'exists:departments,id',
                'not_in:' . $department->id, // Prevent self-reference
            ],
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
            'parent_id.not_in' => 'A department cannot be its own parent.',
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
     * Configure the validator instance.
     */
    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $department = $this->route('department');

            // Additional validation to prevent circular references
            if ($this->parent_id) {
                if ($this->wouldCreateCircularReference($department->id, $this->parent_id)) {
                    $validator->errors()->add('parent_id', 'This selection would create a circular reference.');
                }
            }
        });
    }

    /**
     * Check if setting the parent would create a circular reference.
     */
    private function wouldCreateCircularReference(int $departmentId, int $parentId): bool
    {
        $current = $parentId;
        $visited = [];

        while ($current) {
            if ($current === $departmentId) {
                return true;
            }

            if (in_array($current, $visited)) {
                break; // Circular reference detected in parent chain
            }

            $visited[] = $current;

            $parent = \App\Tenant\Modules\HR\Models\Department::find($current);
            $current = $parent ? $parent->parent_id : null;
        }

        return false;
    }
}
