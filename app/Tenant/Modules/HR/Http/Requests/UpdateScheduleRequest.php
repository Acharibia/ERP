<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'    => 'required|exists:employees,id',
            'shift_id'       => 'required|exists:shifts,id',
            'date'           => 'required|date',
            'start_time'     => 'nullable',
            'end_time'       => 'nullable',
            'schedule_type'  => 'nullable|string',
            'is_remote'      => 'nullable|boolean',
            'location'       => 'nullable|string|max:255',
            'notes'          => 'nullable|string',
            'expected_hours' => 'nullable|numeric',
        ];
    }
}
