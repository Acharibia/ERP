<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateEmployeeShiftRotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'start_date' => 'required|date',
            'frequency' => 'required|in:daily,weekly,bi-weekly,custom',
            'interval' => 'nullable|integer|min:1',
            'status' => 'required|in:active,inactive',
        ];
    }
}
