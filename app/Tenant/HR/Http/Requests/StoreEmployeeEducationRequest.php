<?php

namespace App\Tenant\HR\Http\Requests;

use App\Central\Models\Country;
use App\Rules\CentralExists;
use App\Tenant\HR\Enum\DegreeType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreEmployeeEducationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'education' => ['required', 'array'],
            'education.*.institution' => ['required', 'string'],
            'education.*.country_id' => ['required', new CentralExists(Country::class)],
            'education.*.degree_type' => ['required', Rule::in(DegreeType::values())],
            'education.*.field_of_study' => ['required', 'string'],
            'education.*.start_date' => ['required', 'date'],
            'education.*.end_date' => ['nullable', 'date', 'after_or_equal:education.*.start_date'],
            'education.*.graduation_date' => ['nullable', 'date', 'after_or_equal:education.*.start_date'],
            'education.*.is_completed' => ['required', 'boolean'],
            'education.*.is_current' => ['required', 'boolean'],
        ];
    }

    public function attributes(): array
    {
        return [
            'education' => 'education entries',
            'education.*.institution' => 'institution',
            'education.*.country_id' => 'country',
            'education.*.degree_type' => 'degree type',
            'education.*.field_of_study' => 'field of study',
            'education.*.start_date' => 'start date',
            'education.*.end_date' => 'end date',
            'education.*.graduation_date' => 'graduation date',
            'education.*.is_completed' => 'completion status',
            'education.*.is_current' => 'current study status',
        ];
    }

}
