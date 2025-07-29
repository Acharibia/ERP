<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\LearningPathAssignment;
use App\Tenant\HR\Models\LearningPath;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Http\Requests\StoreLearningPathAssignmentRequest;
use App\Tenant\HR\Http\Requests\UpdateLearningPathAssignmentRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathAssignmentController extends Controller
{
    public function index(LearningPath $learningPath): Response
    {
        $assignments = $learningPath->assignments()->with('employee')->get();
        return Inertia::render('modules/hr/learning-path-assignments/index', compact('learningPath', 'assignments'));
    }

    public function create(LearningPath $learningPath): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        return Inertia::render('modules/hr/learning-path-assignments/create', compact('learningPath', 'employees'));
    }

    public function store(StoreLearningPathAssignmentRequest $request, LearningPath $learningPath): RedirectResponse
    {
        $assignment = $learningPath->assignments()->create($request->validated());
        if ($request->hasFile('certificate')) {
            $assignment->addMediaFromRequest('certificate')->toMediaCollection('learning-path-certificates');
        }
        return redirect()->route('modules.hr.learning-paths.assignments.index', $learningPath)
            ->with('success', 'Learning path assignment created successfully.');
    }

    public function show(LearningPath $learningPath, LearningPathAssignment $assignment): Response
    {
        $assignment->load('employee');
        return Inertia::render('modules/hr/learning-path-assignments/show', compact('learningPath', 'assignment'));
    }

    public function edit(LearningPath $learningPath, LearningPathAssignment $assignment): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        return Inertia::render('modules/hr/learning-path-assignments/edit', compact('learningPath', 'assignment', 'employees'));
    }

    public function update(UpdateLearningPathAssignmentRequest $request, LearningPath $learningPath, LearningPathAssignment $assignment): RedirectResponse
    {
        $assignment->update($request->validated());
        if ($request->hasFile('certificate')) {
            $assignment->clearMediaCollection('learning-path-certificates');
            $assignment->addMediaFromRequest('certificate')->toMediaCollection('learning-path-certificates');
        }
        return redirect()->route('modules.hr.learning-paths.assignments.index', $learningPath)
            ->with('success', 'Learning path assignment updated successfully.');
    }

    public function destroy(LearningPath $learningPath, LearningPathAssignment $assignment): RedirectResponse
    {
        $assignment->delete();
        return redirect()->route('modules.hr.learning-paths.assignments.index', $learningPath)
            ->with('success', 'Learning path assignment deleted successfully.');
    }
}
