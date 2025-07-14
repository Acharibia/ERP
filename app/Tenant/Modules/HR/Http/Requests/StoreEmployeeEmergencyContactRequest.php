<?php

namespace App\Tenant\Modules\HR\Http\Requests;

use App\Central\Models\Country;
use App\Central\Models\State;
use App\Rules\CentralExists;
use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeEmergencyContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'emergency_contacts' => ['required', 'array'],
            'emergency_contacts.*.id' => ['nullable', 'exists:employee_emergency_contacts,id'],
            'emergency_contacts.*.name' => ['required', 'string', 'max:255'],
            'emergency_contacts.*.relationship' => ['required', 'string', 'max:255'],
            'emergency_contacts.*.primary_phone' => ['required', 'string', 'max:20'],
            'emergency_contacts.*.secondary_phone' => ['nullable', 'string', 'max:20'],
            'emergency_contacts.*.email' => ['nullable', 'email'],
            'emergency_contacts.*.address' => ['nullable', 'string'],
            'emergency_contacts.*.city' => ['nullable', 'string'],
            'emergency_contacts.*.state_id' => ['nullable', new CentralExists(State::class)],
            'emergency_contacts.*.postal_code' => ['nullable', 'string', 'max:20'],
            'emergency_contacts.*.country_id' => ['nullable', new CentralExists(Country::class)],
            'emergency_contacts.*.is_primary' => ['required', 'boolean'],
            'emergency_contacts.*.notes' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'emergency_contacts' => 'emergency contact entries',
            'emergency_contacts.*.id' => 'emergency contact ID',
            'emergency_contacts.*.name' => 'name',
            'emergency_contacts.*.relationship' => 'relationship',
            'emergency_contacts.*.primary_phone' => 'primary phone',
            'emergency_contacts.*.secondary_phone' => 'secondary phone',
            'emergency_contacts.*.email' => 'email address',
            'emergency_contacts.*.address' => 'address',
            'emergency_contacts.*.city' => 'city',
            'emergency_contacts.*.state_id' => 'state',
            'emergency_contacts.*.postal_code' => 'postal code',
            'emergency_contacts.*.country_id' => 'country',
            'emergency_contacts.*.is_primary' => 'primary contact indicator',
            'emergency_contacts.*.notes' => 'notes',
        ];
    }

}
