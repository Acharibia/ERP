<?php

namespace App\Investors\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rule;

class StoreInvestorRequest extends FormRequest
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
        $rules = [
            // Investor Information
            'type' => ['required', 'string', Rule::in(['individual', 'angel', 'vc', 'pe', 'corporate', 'institutional'])],
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:investors,email'],
            'phone' => ['nullable', 'string', 'max:50'],
            'tax_id' => ['nullable', 'string', 'max:50'],

            // Address Information
            'address' => ['nullable', 'string', 'max:255'],
            'city' => ['nullable', 'string', 'max:100'],
            'state' => ['nullable', 'string', 'max:100'],
            'postal_code' => ['nullable', 'string', 'max:20'],
            'country' => ['required', 'string', 'max:100'],

            // Account Security
            'password' => ['required', 'confirmed', Password::defaults()],

            // Additional Info
            'notes' => ['nullable', 'string', 'max:1000'],
        ];

        // Company name is required for certain investor types
        if (in_array($this->type, ['corporate', 'vc', 'pe', 'institutional'])) {
            $rules['company_name'] = ['required', 'string', 'max:255'];
        } else {
            $rules['company_name'] = ['nullable', 'string', 'max:255'];
        }

        return $rules;
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Investor type is required.',
            'type.in' => 'Selected investor type is invalid.',
            'name.required' => 'Name is required.',
            'email.required' => 'Email is required.',
            'email.email' => 'Email must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            'company_name.required' => 'Company/Fund name is required for this investor type.',
            'country.required' => 'Country is required.',
            'password.required' => 'Password is required.',
            'password.confirmed' => 'Password confirmation does not match.',
        ];
    }

    /**
     * Prepare the data for validation.
     *
     * @return void
     */
    protected function prepareForValidation(): void
    {
        // Set default accreditation status to pending
        $this->merge([
            'accreditation_status' => 'pending',
            'status' => 'active',
        ]);
    }
}
