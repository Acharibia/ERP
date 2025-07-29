<?php

namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreShiftPreferenceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'employee_id' => 'required|exists:employees,id',
            'shift_id' => 'required|exists:shifts,id',
            'is_available' => 'required|boolean',
            'preference_level' => 'nullable|integer|min:1|max:5',
            'is_mandatory' => 'required|boolean',
            'day_of_week' => 'nullable|string|in:Monday,Tuesday,Wednesday,Thursday,Friday,Saturday,Sunday',
        ];
    }
}
