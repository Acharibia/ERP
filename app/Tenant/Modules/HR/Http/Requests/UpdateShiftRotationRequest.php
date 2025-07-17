<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateShiftRotationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_shift_rotation_id' => 'required|exists:employee_shift_rotations,id',
            'shift_id' => 'nullable|exists:shifts,id',
            'duration_days' => 'required|integer|min:1',
            'order' => 'required|integer|min:1',
        ];
    }
}
