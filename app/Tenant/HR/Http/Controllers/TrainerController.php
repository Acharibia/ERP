<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\Trainer;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Http\Requests\StoreTrainerRequest;
use App\Tenant\HR\Http\Requests\UpdateTrainerRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TrainerController extends Controller
{
    public function index(): Response
    {
        $trainers = Trainer::with('employee')->get();
        return Inertia::render('modules/hr/trainers/index', compact('trainers'));
    }

    public function create(): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        return Inertia::render('modules/hr/trainers/create', compact('employees'));
    }

    public function store(StoreTrainerRequest $request): RedirectResponse
    {
        Trainer::create($request->validated());
        return redirect()->route('modules.hr.trainers.index')
            ->with('success', 'Trainer created successfully.');
    }

    public function show(Trainer $trainer): Response
    {
        $trainer->load('employee');
        return Inertia::render('modules/hr/trainers/show', compact('trainer'));
    }

    public function edit(Trainer $trainer): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        return Inertia::render('modules/hr/trainers/edit', compact('trainer', 'employees'));
    }

    public function update(UpdateTrainerRequest $request, Trainer $trainer): RedirectResponse
    {
        $trainer->update($request->validated());
        return redirect()->route('modules.hr.trainers.index')
            ->with('success', 'Trainer updated successfully.');
    }

    public function destroy(Trainer $trainer): RedirectResponse
    {
        $trainer->delete();
        return redirect()->route('modules.hr.trainers.index')
            ->with('success', 'Trainer deleted successfully.');
    }
}
