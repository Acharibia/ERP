<?php

namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAttendanceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id'     => 'required|exists:employees,id',
            'shift_id'        => 'nullable|exists:shifts,id',
            'attendance_date' => 'required|date',
            'clock_in'        => 'nullable|date_format:Y-m-d H:i:s',
            'clock_out'       => 'nullable|date_format:Y-m-d H:i:s',
            'total_hours'     => 'nullable|numeric',
            'overtime_hours'  => 'nullable|numeric',
            'status'          => 'nullable|string',
            'notes'           => 'nullable|string',
            'source'          => 'nullable|string',
        ];
    }
}
