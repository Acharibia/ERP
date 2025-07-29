<?php

namespace App\Tenant\HR\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreEmployeeWorkExperienceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'work_experience' => ['required', 'array'],
            'work_experience.*.id' => ['nullable', 'exists:employee_work_experience,id'],
            'work_experience.*.company_name' => ['required', 'string', 'max:255'],
            'work_experience.*.job_title' => ['required', 'string', 'max:255'],
            'work_experience.*.start_date' => ['required', 'date'],
            'work_experience.*.end_date' => ['nullable', 'date'],
            'work_experience.*.is_current' => ['required', 'boolean'],
            'work_experience.*.responsibilities' => ['nullable', 'string'],
            'work_experience.*.achievements' => ['nullable', 'string'],
            'work_experience.*.company_location' => ['nullable', 'string'],
            'work_experience.*.reference_name' => ['nullable', 'string'],
            'work_experience.*.reference_contact' => ['nullable', 'string'],
        ];
    }

    public function attributes(): array
    {
        return [
            'work_experience' => 'work experience entries',
            'work_experience.*.id' => 'work experience ID',
            'work_experience.*.company_name' => 'company name',
            'work_experience.*.job_title' => 'job title',
            'work_experience.*.start_date' => 'start date',
            'work_experience.*.end_date' => 'end date',
            'work_experience.*.is_current' => 'current job status',
            'work_experience.*.responsibilities' => 'responsibilities',
            'work_experience.*.achievements' => 'achievements',
            'work_experience.*.company_location' => 'company location',
            'work_experience.*.reference_name' => 'reference name',
            'work_experience.*.reference_contact' => 'reference contact',
        ];
    }

}
