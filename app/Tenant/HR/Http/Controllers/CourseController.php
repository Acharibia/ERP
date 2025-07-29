<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Http\Requests\StoreCourseRequest;
use App\Tenant\HR\Http\Requests\UpdateCourseRequest;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Models\Program;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseController extends Controller
{
    public function index(): Response
    {
        $courses = Course::with('program')->get();
        return Inertia::render('modules/hr/courses/index', compact('courses'));
    }

    public function create(): Response
    {
        $programs = Program::all(['id', 'title']);
        return Inertia::render('modules/hr/courses/create', compact('programs'));
    }

    public function store(StoreCourseRequest $request): RedirectResponse
    {
        Course::create($request->validated());
        return redirect()->route('modules.hr.courses.index')
            ->with('success', 'Course created successfully.');
    }

    public function show(Course $course): Response
    {
        $course->load(['program', 'materials', 'sessions', 'assignments', 'feedback']);
        return Inertia::render('modules/hr/courses/show', compact('course'));
    }

    public function edit(Course $course): Response
    {
        $programs = Program::all(['id', 'title']);
        return Inertia::render('modules/hr/courses/edit', compact('course', 'programs'));
    }

    public function update(UpdateCourseRequest $request, Course $course): RedirectResponse
    {
        $course->update($request->validated());
        return redirect()->route('modules.hr.courses.index')
            ->with('success', 'Course updated successfully.');
    }

    public function destroy(Course $course): RedirectResponse
    {
        $course->delete();
        return redirect()->route('modules.hr.courses.index')
            ->with('success', 'Course deleted successfully.');
    }
}
