<?php
namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Tenant\HR\Enum\ShiftRotationPriority;
use Illuminate\Validation\Rule;
use App\Tenant\HR\Enum\ShiftRotationFrequency;

class UpdateShiftRotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_ids'     => 'nullable|array',
            'employee_ids.*'   => 'exists:employees,id',
            'department_ids'   => 'nullable|array',
            'department_ids.*' => 'exists:departments,id',
            'position_ids'     => 'nullable|array',
            'position_ids.*'   => 'exists:positions,id',
            'role_ids'         => 'nullable|array',
            'role_ids.*'       => 'exists:roles,id',
            'shift_id'         => 'nullable|exists:shifts,id',
            'start_date'       => 'required|date',
            'end_date'         => 'nullable|date|after_or_equal:start_date',
            'frequency'        => ['required', 'string', Rule::in(ShiftRotationFrequency::values())],
            'interval'         => 'required|integer|min:1',
            'status'           => 'required|in:active,inactive',
            'duration_days'    => 'nullable|integer|min:1',
            'is_recurring'     => 'boolean',
            'order'            => 'nullable|integer|min:1',
            'priority'         => ['nullable', 'string', Rule::in(ShiftRotationPriority::values())],
        ];
    }
}
