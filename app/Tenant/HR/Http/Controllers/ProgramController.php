<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\Program;
use App\Tenant\HR\Http\Requests\StoreProgramRequest;
use App\Tenant\HR\Http\Requests\UpdateProgramRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProgramController extends Controller
{
    public function index(): Response
    {
        $programs = Program::all();
        return Inertia::render('modules/hr/programs/index', compact('programs'));
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/programs/create');
    }

    public function store(StoreProgramRequest $request): RedirectResponse
    {
        Program::create($request->validated());
        return redirect()->route('modules.hr.programs.index')
            ->with('success', 'Program created successfully.');
    }

    public function show(Program $program): Response
    {
        return Inertia::render('modules/hr/programs/show', compact('program'));
    }

    public function edit(Program $program): Response
    {
        return Inertia::render('modules/hr/programs/edit', compact('program'));
    }

    public function update(UpdateProgramRequest $request, Program $program): RedirectResponse
    {
        $program->update($request->validated());
        return redirect()->route('modules.hr.programs.index')
            ->with('success', 'Program updated successfully.');
    }

    public function destroy(Program $program): RedirectResponse
    {
        $program->delete();
        return redirect()->route('modules.hr.programs.index')
            ->with('success', 'Program deleted successfully.');
    }
}
