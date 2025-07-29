<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Enums\UserType;
use App\Central\Http\Controllers\Controller;
use App\Central\Models\Country;
use App\Central\Models\Gender;
use App\Central\Models\State;
use App\Central\Services\UserService;
use App\Tenant\Core\Models\User as TenantUser;
use App\Tenant\HR\Enum\DegreeType;
use App\Tenant\HR\Enum\EmployeeStatus;
use App\Tenant\HR\Enum\EmploymentStatus;
use App\Tenant\HR\Enum\EmploymentType;
use App\Tenant\HR\Enum\MaritalStatus;
use App\Tenant\HR\Http\Requests\StoreEmployeeEducationRequest;
use App\Tenant\HR\Http\Requests\StoreEmployeeEmergencyContactRequest;
use App\Tenant\HR\Http\Requests\StoreEmployeeEmploymentInfoRequest;
use App\Tenant\HR\Http\Requests\StoreEmployeePersonalInfoRequest;
use App\Tenant\HR\Http\Requests\StoreEmployeeWorkExperienceRequest;
use App\Tenant\HR\Models\Department;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\EmployeeEducation;
use App\Tenant\HR\Models\EmployeeEmergencyContact;
use App\Tenant\HR\Models\EmployeeEmploymentInfo;
use App\Tenant\HR\Models\EmployeePersonalInfo;
use App\Tenant\HR\Models\EmployeeWorkExperience;
use App\Tenant\HR\Models\Position;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EmployeeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('modules/hr/employees/index');
    }

    public function create(): Response
    {
        $employeeId = session('current_employee_id');
        $employee   = $employeeId
        ? Employee::with([
            'personalInfo.gender',
            'user',
            'personalInfo.state',
            'personalInfo.country',
            'employmentInfo.department',
            'employmentInfo.position',
            'employmentInfo.manager.personalInfo',
            'education.country',
            'education',
            'workExperience',
            'emergencyContacts',
            'emergencyContacts.state',
            'emergencyContacts.country',
        ])
            ->where('status', EmployeeStatus::DRAFT->value)
            ->find($employeeId)
        : null;

        return Inertia::render('modules/hr/employees/create', [
            'departments'         => Department::active()->get(['id', 'name']),
            'genders'             => Gender::active()->get(['id', 'name']),
            'countries'           => Country::active()->get(['id', 'name']),
            'employees'           => Employee::active()->get(['id']),
            'states'              => State::active()->get(['id', 'name']),
            'positions'           => Position::all(['id', 'title']),
            'maritalStatuses'     => MaritalStatus::options(),
            'employmentStatuses'  => EmploymentStatus::options(),
            'employmentTypes'     => EmploymentType::options(),
            'degreeTypes'         => DegreeType::options(),
            'initialEmployeeData' => $employee ? [
                'personal'           => $employee->personalInfo,
                'employment'         => $employee->employmentInfo,
                'education'          => $employee->education,
                'work_experience'    => $employee->workExperience,
                'emergency_contacts' => $employee->emergencyContacts,
            ] : null,
        ]);
    }
    public function discardDraft()
    {
        session()->forget('current_employee_id');

        return redirect()->route('modules.hr.employees.create')
            ->with('success', 'New form created.');
    }

    public function storePersonalInfo(StoreEmployeePersonalInfoRequest $request, UserService $userService)
    {
        $validated = $request->validated();

        $centralUser = $userService->findByEmail($validated['personal_email']);

        if (! $centralUser) {
            $centralUser = $userService->createAndSync([
                'name'              => $validated['name'],
                'email'             => $validated['personal_email'],
                'password'          => 'defaultPassword123',
                'email_verified_at' => now(),
            ], UserType::BUSINESS_USER, [currentBusiness()->id]);
        } else {
            $userService->syncToBusiness($centralUser, currentBusiness());
        }

        if ($request->hasFile('profile_picture')) {
            $centralUser
                ->addMediaFromRequest('profile_picture')
                ->toMediaCollection('profile_picture');
        }

        $tenantUser = TenantUser::where('global_id', $centralUser->global_id)->first();

        $employee = Employee::firstOrCreate(
            ['user_id' => $tenantUser->id],
            [
                'employee_number' => strtoupper(uniqid('EMP')),
                'status'          => EmployeeStatus::DRAFT->value,
            ]
        );

        EmployeePersonalInfo::updateOrCreate(
            ['employee_id' => $employee->id],
            array_merge($validated, ['employee_id' => $employee->id])
        );

        session()->put('current_employee_id', $employee->id);

        return back()->with('success', 'Personal info saved successfully.');
    }

    public function storeEmploymentInfo(StoreEmployeeEmploymentInfoRequest $request)
    {
        $validated  = $request->validated();
        $employeeId = session('current_employee_id');

        EmployeeEmploymentInfo::updateOrCreate(
            ['employee_id' => $employeeId],
            array_merge($validated, ['employee_id' => $employeeId])
        );

        return back()->with('success', 'Employment info saved successfully.');
    }

    public function storeEducation(StoreEmployeeEducationRequest $request)
    {
        $validated  = $request->validated();
        $employeeId = session('current_employee_id');

        foreach ($validated['education'] as $edu) {
            EmployeeEducation::updateOrCreate(
                [
                    'employee_id' => $employeeId,
                    'institution' => $edu['institution'],
                    'degree_type' => $edu['degree_type'],
                ],
                array_merge($edu, ['employee_id' => $employeeId])
            );
        }

        return back()->with('success', 'Education history saved successfully.');
    }

    public function storeWorkExperience(StoreEmployeeWorkExperienceRequest $request)
    {
        $validated  = $request->validated();
        $employeeId = session('current_employee_id');

        foreach ($validated['work_experience'] as $work) {
            EmployeeWorkExperience::updateOrCreate(
                [
                    'employee_id'  => $employeeId,
                    'company_name' => $work['company_name'],
                    'job_title'    => $work['job_title'],
                ],
                array_merge($work, ['employee_id' => $employeeId])
            );
        }

        return back()->with('success', 'Work experience saved successfully.');
    }

    public function storeEmergencyContacts(StoreEmployeeEmergencyContactRequest $request)
    {
        $validated  = $request->validated();
        $employeeId = session('current_employee_id');

        foreach ($validated['emergency_contacts'] as $contact) {
            EmployeeEmergencyContact::updateOrCreate(
                [
                    'employee_id'   => $employeeId,
                    'primary_phone' => $contact['primary_phone'],
                ],
                array_merge($contact, ['employee_id' => $employeeId])
            );
        }

        return back()->with('success', 'Emergency contacts saved successfully.');
    }

    public function storeFinal()
    {
        $employeeId = session('current_employee_id');

        if (! $employeeId) {
            return redirect()->back()->withErrors(['employee' => 'Employee session not found.']);
        }

        Employee::where('id', $employeeId)->update([
            'status' => EmployeeStatus::FINALIZED->value,
        ]);

        session()->forget('current_employee_id');

        return redirect()->route('modules.hr.employees.index')->with('success', 'Employee record finalized.');
    }

    public function show(string $id): Response
    {
        $employee = Employee::with([
            'personalInfo.gender',
            'personalInfo.state',
            'personalInfo.country',
            'employmentInfo.department',
            'employmentInfo.position',
            'employmentInfo.manager.personalInfo',
            'education.country',
            'education',
            'workExperience',
            'emergencyContacts',
            'emergencyContacts.state',
            'emergencyContacts.country',
            'user',
            'user.roles',
            'user.permissions',
        ])->findOrFail($id);

        return Inertia::render('modules/hr/employees/show', [
            'initialEmployeeData' => [
                'personal'           => $employee->personalInfo,
                'employment'         => $employee->employmentInfo,
                'education'          => $employee->education,
                'work_experience'    => $employee->workExperience,
                'emergency_contacts' => $employee->emergencyContacts,
                'user'               => $employee->user,
            ],
        ]);
    }

    public function edit($id): Response
    {
        $employee = Employee::with([
            'personalInfo.gender',
            'personalInfo.state',
            'personalInfo.country',
            'employmentInfo.department',
            'employmentInfo.position',
            'employmentInfo.manager.personalInfo',
            'education.country',
            'education',
            'workExperience',
            'emergencyContacts',
            'emergencyContacts.state',
            'emergencyContacts.country',
        ])->findOrFail($id);

        return Inertia::render('modules/hr/employees/edit', [
            'departments'         => Department::active()->get(['id', 'name']),
            'genders'             => Gender::active()->get(['id', 'name']),
            'countries'           => Country::active()->get(['id', 'name']),
            'employees'           => Employee::active()->get(['id']),
            'states'              => State::active()->get(['id', 'name']),
            'positions'           => Position::all(['id', 'title']),
            'maritalStatuses'     => MaritalStatus::options(),
            'employmentStatuses'  => EmploymentStatus::options(),
            'employmentTypes'     => EmploymentType::options(),
            'degreeTypes'         => DegreeType::options(),
            'initialEmployeeData' => [
                'personal'           => $employee->personalInfo,
                'employment'         => $employee->employmentInfo,
                'education'          => $employee->education,
                'work_experience'    => $employee->workExperience,
                'emergency_contacts' => $employee->emergencyContacts,
            ],
        ]);
    }

    public function access(string $id): Response
    {
        $employee = Employee::with([
            'personalInfo',
            'user',
            'user.roles',
            'user.permissions',
        ])->findOrFail($id);

        $roles       = Role::query()->where('module', 'hr')->get();
        $permissions = Permission::query()->where('module', 'hr')->get();

        return Inertia::render('modules/hr/employees/access', [
            'employee'    => $employee,
            'roles'       => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function updateAccess(string $id, Request $request)
    {
        $validated = $request->validate([
            'roles'       => 'required_without:permissions|array|exists:roles,id',
            'permissions' => 'required_without:roles|array|exists:permissions,id',
        ]);

        $employee = Employee::with('user')->findOrFail($id);
        $employee->user->syncRoles($validated['roles']);
        $employee->user->syncPermissions($validated['permissions']);
        $employee->user->save();

        return back()->with('success', 'Access updated successfully.');
    }
}
