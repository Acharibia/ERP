<?php

namespace App\Tenant\HR\Http\Requests;

use App\Tenant\HR\Enum\DepartmentStatus;
use App\Tenant\HR\Models\Department;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDepartmentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

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
                'not_in:' . $department->id,
            ],
            'manager_id' => 'nullable|exists:employees,id',
            'budget' => 'nullable|numeric|min:0',
            'cost_center' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'status' => [
                'required',
                'string',
                Rule::in(array_column(DepartmentStatus::cases(), 'value')),
            ],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Department name is required.',
            'name.max' => 'Department name cannot exceed 255 characters.',
            'email.required' => 'Department email is required.',
            'email.email' => 'Enter a valid email address.',
            'email.unique' => 'This department email is already taken.',
            'code.required' => 'Department code is required.',
            'code.unique' => 'This department code is already taken.',
            'code.max' => 'Department code cannot exceed 4 characters.',
            'parent_id.exists' => 'Selected parent department does not exist.',
            'parent_id.not_in' => 'A department cannot be its own parent.',
            'manager_id.exists' => 'Selected manager does not exist.',
            'budget.numeric' => 'Budget must be a valid number.',
            'budget.min' => 'Budget cannot be negative.',
            'cost_center.max' => 'Cost center cannot exceed 255 characters.',
            'location.max' => 'Location cannot exceed 255 characters.',
            'status.in' => 'Invalid department status selected.',
        ];
    }

    public function attributes(): array
    {
        return [
            'parent_id' => 'parent department',
            'manager_id' => 'department manager',
            'cost_center' => 'cost center',
        ];
    }

    public function withValidator($validator): void
    {
        $validator->after(function ($validator) {
            $department = $this->route('department');

            if ($this->parent_id && $this->wouldCreateCircularReference($department->id, $this->parent_id)) {
                $validator->errors()->add('parent_id', 'This selection would create a circular reference.');
            }
        });
    }

    private function wouldCreateCircularReference(int $departmentId, int $parentId): bool
    {
        $current = $parentId;
        $visited = [];

        while ($current) {
            if ($current === $departmentId) {
                return true;
            }

            if (in_array($current, $visited)) {
                break;
            }

            $visited[] = $current;

            $parent = Department::find($current);
            $current = $parent ? $parent->parent_id : null;
        }

        return false;
    }
}
