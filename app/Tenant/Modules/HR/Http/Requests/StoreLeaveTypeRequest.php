<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreLeaveTypeRequest extends FormRequest
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
            'name' => ['required', 'string', 'max:100'],
            'code' => ['required', 'string', 'max:10', 'unique:leave_types,code'],
            'description' => ['nullable', 'string', 'max:1000'],
            'default_days' => ['required', 'numeric', 'min:0', 'max:365'],
            'requires_approval' => ['required', 'boolean'],
            'is_paid' => ['required', 'boolean'],
            'can_carry_forward' => ['required', 'boolean'],
            'max_carry_forward_days' => ['nullable', 'numeric', 'min:0', 'max:365'],
            'carry_forward_expiry_months' => ['nullable', 'integer', 'min:1', 'max:24'],
        ];
    }
}
