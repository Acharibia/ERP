<?php

namespace App\Admin\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Password;

class ResellerStoreRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        return [
            'company_name' => 'required|string|max:255',
            'contact_name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:resellers,email',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'postal_code' => 'nullable|string|max:20',
            'country' => 'nullable|string|max:100',
            'status' => 'required|string|in:active,pending,suspended,archived',
            'verification_status' => 'required|string|in:pending,verified,rejected',
            'commission_rate' => 'nullable|numeric|min:0|max:100',
            'user' => 'required|array',
            'user.name' => 'required|string|max:255',
            'user.email' => 'required|email|max:255|unique:users,email',
            'user.password' => ['required', Password::defaults()],
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes()
    {
        return [
            'user.name' => 'user name',
            'user.email' => 'user email',
            'user.password' => 'user password',
        ];
    }
}