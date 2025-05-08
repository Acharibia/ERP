<?php

namespace App\Businesses\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreBusinessRequest extends FormRequest
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
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        // Get the current step from request for validation
        $step = $this->input('step', 5); // Default to final step for full submission
        $validateOnly = $this->query('validate_only', false);

        // If this is a step validation request, only validate fields for that step
        if ($validateOnly) {
            return $this->getStepRules($step);
        }

        // Return all rules for the final submission
        return [
            // Business Information
            'name' => ['required', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:50'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:businesses,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'website' => ['nullable', 'string', 'url', 'max:255'],
            'industry_id' => ['required', 'exists:industries,id'],

            // Address Information
            'address_line_1' => ['nullable', 'string', 'max:255'],
            'address_line_2' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state_id' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country_id' => ['required', 'string', 'max:100'],

            // Administrator Information
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::defaults()],

            // Package Information
            'package_id' => ['required', 'exists:packages,id'],
            'billing_cycle' => ['required', 'in:monthly,annual'],
            'start_trial' => ['boolean'],
        ];
    }

    /**
     * Get validation rules for a specific step.
     *
     * @param int $step
     * @return array
     */
    protected function getStepRules(int $step): array
    {
        switch ($step) {
            case 1:
                return [
                    'name' => ['required', 'string', 'max:255'],
                    'registration_number' => ['nullable', 'string', 'max:50'],
                    'email' => ['required', 'string', 'email', 'max:255', 'unique:businesses,email'],
                    'phone' => ['nullable', 'string', 'max:50'],
                    'website' => ['nullable', 'string', 'url', 'max:255'],
                    'industry_id' => ['required', 'exists:industries,id'],
                    'step' => ['required', 'integer', 'in:1'],
                ];

            case 2:
                return [
                    'address_line_1' => ['nullable', 'string', 'max:255'],
                    'address_line_2' => ['nullable', 'string', 'max:255'],
                    'city' => ['nullable', 'string', 'max:100'],
                    'state_id' => ['nullable', 'string', 'max:100'],
                    'postal_code' => ['nullable', 'string', 'max:20'],
                    'country_id' => ['required', 'string', 'max:100'],
                    'step' => ['required', 'integer', 'in:2'],
                ];

            case 3:
                return [
                    'contact_name' => ['required', 'string', 'max:255'],
                    'contact_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
                    'password' => ['required', 'confirmed', Password::defaults()],
                    'step' => ['required', 'integer', 'in:3'],
                ];

            case 4:
                return [
                    'package_id' => ['required', 'exists:packages,id'],
                    'billing_cycle' => ['required', 'in:monthly,annual'],
                    'start_trial' => ['boolean'],
                    'step' => ['required', 'integer', 'in:4'],
                ];

            default:
                return [
                    'step' => ['required', 'integer'],
                ];
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Business name is required.',
            'email.required' => 'Business email is required.',
            'email.email' => 'Business email must be a valid email address.',
            'email.unique' => 'This business email is already registered.',
            'industry_id.required' => 'Please select an industry.',
            'industry_id.exists' => 'Selected industry is invalid.',
            'country_id.required' => 'Country is required.',
            'contact_name.required' => 'Administrator name is required.',
            'contact_email.required' => 'Administrator email is required.',
            'contact_email.email' => 'Administrator email must be a valid email address.',
            'contact_email.unique' => 'This administrator email is already registered.',
            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
            'package_id.required' => 'Please select a subscription package.',
            'package_id.exists' => 'Selected package is invalid.',
            'billing_cycle.required' => 'Billing cycle is required.',
            'billing_cycle.in' => 'Billing cycle must be either monthly or annual.',
        ];
    }
}
