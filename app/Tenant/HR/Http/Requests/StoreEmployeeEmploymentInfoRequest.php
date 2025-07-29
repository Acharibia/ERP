<?php

namespace App\Tenant\HR\Http\Requests;

use App\Tenant\HR\Enum\EmploymentStatus;
use App\Tenant\HR\Enum\EmploymentType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeEmploymentInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'department_id' => ['nullable', 'exists:departments,id'],
            'position_id' => ['nullable', 'exists:positions,id'],
            'manager_id' => ['nullable', 'exists:employees,id'],
            'hire_date' => ['required', 'date'],
            'termination_date' => ['nullable', 'date'],
            'termination_reason' => ['nullable', 'string'],
            'employment_status' => ['required', Rule::in(EmploymentStatus::values())],
            'employment_type' => ['required', Rule::in(EmploymentType::values())],
            'work_location' => ['nullable', 'string'],
            'probation_start_date' => ['nullable', 'date'],
            'probation_end_date' => ['nullable', 'date'],
            'contract_start_date' => ['nullable', 'date'],
            'contract_end_date' => ['nullable', 'date'],
        ];
    }
}
