<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\CourseSession;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Models\Trainer;
use App\Tenant\HR\Http\Requests\StoreCourseSessionRequest;
use App\Tenant\HR\Http\Requests\UpdateCourseSessionRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseSessionController extends Controller
{
    public function index(Course $course): Response
    {
        $sessions = $course->sessions()->with('trainer')->get();
        return Inertia::render('modules/hr/course-sessions/index', compact('course', 'sessions'));
    }

    public function create(Course $course): Response
    {
        $trainers = Trainer::all(['id', 'name']);
        return Inertia::render('modules/hr/course-sessions/create', compact('course', 'trainers'));
    }

    public function store(StoreCourseSessionRequest $request, Course $course): RedirectResponse
    {
        $course->sessions()->create($request->validated());
        return redirect()->route('modules.hr.courses.sessions.index', $course)
            ->with('success', 'Course session created successfully.');
    }

    public function show(Course $course, CourseSession $session): Response
    {
        $session->load('trainer');
        return Inertia::render('modules/hr/course-sessions/show', compact('course', 'session'));
    }

    public function edit(Course $course, CourseSession $session): Response
    {
        $trainers = Trainer::all(['id', 'name']);
        return Inertia::render('modules/hr/course-sessions/edit', compact('course', 'session', 'trainers'));
    }

    public function update(UpdateCourseSessionRequest $request, Course $course, CourseSession $session): RedirectResponse
    {
        $session->update($request->validated());
        return redirect()->route('modules.hr.courses.sessions.index', $course)
            ->with('success', 'Course session updated successfully.');
    }

    public function destroy(Course $course, CourseSession $session): RedirectResponse
    {
        $session->delete();
        return redirect()->route('modules.hr.courses.sessions.index', $course)
            ->with('success', 'Course session deleted successfully.');
    }
}
