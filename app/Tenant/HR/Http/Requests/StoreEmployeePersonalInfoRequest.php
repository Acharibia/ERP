<?php

namespace App\Tenant\HR\Http\Requests;

use App\Central\Models\Country;
use App\Central\Models\Gender;
use App\Central\Models\State;
use App\Rules\CentralExists;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeePersonalInfoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'birth_date' => ['required', 'date'],
            'gender_id' => [
                'required',
                new CentralExists(Gender::class),
            ],
            'marital_status' => ['required', 'string'],
            'nationality' => ['required', 'string', 'max:255'],
            'national_id' => ['required', 'string'],
            'address' => ['required', 'string'],
            'city' => ['required', 'string'],
            'state_id' => [
                'required',
                new CentralExists(State::class),
            ],
            'postal_code' => ['required', 'string', 'max:20'],
            'country_id' => [
                'required',
                new CentralExists(Country::class),
            ],
            'work_email' => ['required', 'email', 'max:255'],
            'personal_email' => ['required', 'email', 'max:255'],
            'work_phone' => ['required', 'string', 'max:20'],
            'personal_phone' => ['required', 'string', 'max:20'],
            'bio' => ['nullable', 'string'],
            'profile_picture' => [
                'nullable',
                'file',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:2048',
            ],
        ];
    }
}
