<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\LearningPath;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Http\Requests\StoreLearningPathRequest;
use App\Tenant\HR\Http\Requests\UpdateLearningPathRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LearningPathController extends Controller
{
    public function index(): Response
    {
        $learningPaths = LearningPath::with('courses')->get();
        return Inertia::render('modules/hr/learning-paths/index', compact('learningPaths'));
    }

    public function create(): Response
    {
        $courses = Course::all(['id', 'title']);
        return Inertia::render('modules/hr/learning-paths/create', compact('courses'));
    }

    public function store(StoreLearningPathRequest $request): RedirectResponse
    {
        $learningPath = LearningPath::create($request->validated());
        if ($request->has('courses')) {
            $learningPath->courses()->sync($request->input('courses'));
        }
        return redirect()->route('modules.hr.learning-paths.index')
            ->with('success', 'Learning path created successfully.');
    }

    public function show(LearningPath $learningPath): Response
    {
        $learningPath->load('courses');
        return Inertia::render('modules/hr/learning-paths/show', compact('learningPath'));
    }

    public function edit(LearningPath $learningPath): Response
    {
        $courses = Course::all(['id', 'title']);
        $learningPath->load('courses');
        return Inertia::render('modules/hr/learning-paths/edit', compact('learningPath', 'courses'));
    }

    public function update(UpdateLearningPathRequest $request, LearningPath $learningPath): RedirectResponse
    {
        $learningPath->update($request->validated());
        if ($request->has('courses')) {
            $learningPath->courses()->sync($request->input('courses'));
        }
        return redirect()->route('modules.hr.learning-paths.index')
            ->with('success', 'Learning path updated successfully.');
    }

    public function destroy(LearningPath $learningPath): RedirectResponse
    {
        $learningPath->delete();
        return redirect()->route('modules.hr.learning-paths.index')
            ->with('success', 'Learning path deleted successfully.');
    }
}
