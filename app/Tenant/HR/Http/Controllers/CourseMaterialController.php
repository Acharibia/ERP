<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Http\Requests\StoreCourseMaterialRequest;
use App\Tenant\HR\Http\Requests\UpdateCourseMaterialRequest;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Models\CourseMaterial;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseMaterialController extends Controller
{
    public function index(Course $course): Response
    {
        $materials = $course->materials;
        return Inertia::render('modules/hr/course-materials/index', compact('course', 'materials'));
    }

    public function create(Course $course): Response
    {
        return Inertia::render('modules/hr/course-materials/create', compact('course'));
    }

    public function store(StoreCourseMaterialRequest $request, Course $course): RedirectResponse
    {
        $material = $course->materials()->create($request->validated());
        if ($request->hasFile('file')) {
            $material->addMediaFromRequest('file')->toMediaCollection('course-materials');
        }
        return redirect()->route('modules.hr.courses.materials.index', $course)
            ->with('success', 'Course material added successfully.');
    }

    public function show(Course $course, CourseMaterial $material): Response
    {
        return Inertia::render('modules/hr/course-materials/show', compact('course', 'material'));
    }

    public function edit(Course $course, CourseMaterial $material): Response
    {
        return Inertia::render('modules/hr/course-materials/edit', compact('course', 'material'));
    }

    public function update(UpdateCourseMaterialRequest $request, Course $course, CourseMaterial $material): RedirectResponse
    {
        $material->update($request->validated());
        if ($request->hasFile('file')) {
            $material->clearMediaCollection('course-materials');
            $material->addMediaFromRequest('file')->toMediaCollection('materials');
        }
        return redirect()->route('modules.hr.courses.materials.index', $course)
            ->with('success', 'Course material updated successfully.');
    }

    public function destroy(Course $course, CourseMaterial $material): RedirectResponse
    {
        $material->delete();
        return redirect()->route('modules.hr.courses.materials.index', $course)
            ->with('success', 'Course material deleted successfully.');
    }
}
