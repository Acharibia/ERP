<?php

namespace App\Resellers\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class StoreResellerRequest extends FormRequest
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
        // Get the current step from the request
        $step = $this->input('step', 1);

        // Return the appropriate validation rules based on the current step
        return $this->{"getStep{$step}Rules"}();
    }

    /**
     * Get validation rules for step 1: Company Information
     */
    protected function getStep1Rules(): array
    {
        return [
            'step' => ['required', 'integer', 'in:1'],
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'string', 'email', 'max:255', 'unique:resellers,email'],
            'company_phone' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Get validation rules for step 2: Address Information
     */
    protected function getStep2Rules(): array
    {
        return [
            'step' => ['required', 'integer', 'in:2'],
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],
        ];
    }

    /**
     * Get validation rules for step 3: Admin Information
     */
    protected function getStep3Rules(): array
    {
        return [
            'step' => ['required', 'integer', 'in:3'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],
        ];
    }

    /**
     * Get validation rules for step 4: Account Security
     */
    protected function getStep4Rules(): array
    {
        return [
            'step' => ['required', 'integer', 'in:4'],
            'password' => ['required', 'confirmed', Password::defaults()],

            // Optional: When submitting the final step, you might want to re-validate
            // key fields from previous steps to ensure all data is still valid
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'string', 'email', 'max:255', 'unique:resellers,email'],
            'country' => ['required', 'string', 'max:100'],
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'company_name.required' => 'Company name is required.',
            'company_email.required' => 'Company email is required.',
            'company_email.email' => 'Company email must be a valid email address.',
            'company_email.unique' => 'This company email is already registered.',
            'country.required' => 'Country is required.',
            'contact_name.required' => 'Administrator name is required.',
            'contact_email.required' => 'Administrator email is required.',
            'contact_email.email' => 'Administrator email must be a valid email address.',
            'contact_email.unique' => 'This administrator email is already registered.',
            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
            'step.required' => 'Step indicator is required.',
            'step.integer' => 'Invalid step format.',
            'step.in' => 'Invalid step value.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // Map the company_email to the database field 'email' when on the final step
        if ($this->input('step') == 4) {
            $this->merge([
                'email' => $this->company_email,
            ]);
        }
    }

    /**
     * Get all validation rules for the entire form (for complete submissions)
     *
     * This can be used for API submissions that don't use the step-by-step approach
     */
    public function getAllRules(): array
    {
        return [
            // Company Information
            'company_name' => ['required', 'string', 'max:255'],
            'company_email' => ['required', 'string', 'email', 'max:255', 'unique:resellers,email'],
            'company_phone' => ['nullable', 'string', 'max:50'],

            // Address Information
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],

            // Admin Information
            'contact_name' => ['required', 'string', 'max:255'],
            'contact_email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'contact_phone' => ['nullable', 'string', 'max:50'],

            // Account Security
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }
}
