<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\CourseFeedback;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\CourseSession;
use App\Tenant\HR\Http\Requests\StoreCourseFeedbackRequest;
use App\Tenant\HR\Http\Requests\UpdateCourseFeedbackRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseFeedbackController extends Controller
{
    public function index(Course $course): Response
    {
        $feedback = $course->feedback()->with(['employee', 'session'])->get();
        return Inertia::render('modules/hr/course-feedback/index', compact('course', 'feedback'));
    }

    public function create(Course $course): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        $sessions = $course->sessions()->get(['id', 'start_time']);
        return Inertia::render('modules/hr/course-feedback/create', compact('course', 'employees', 'sessions'));
    }

    public function store(StoreCourseFeedbackRequest $request, Course $course): RedirectResponse
    {
        $course->feedback()->create($request->validated());
        return redirect()->route('modules.hr.courses.feedback.index', $course)
            ->with('success', 'Course feedback submitted successfully.');
    }

    public function show(Course $course, CourseFeedback $feedback): Response
    {
        $feedback->load(['employee', 'session']);
        return Inertia::render('modules/hr/course-feedback/show', compact('course', 'feedback'));
    }

    public function edit(Course $course, CourseFeedback $feedback): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        $sessions = $course->sessions()->get(['id', 'start_time']);
        return Inertia::render('modules/hr/course-feedback/edit', compact('course', 'feedback', 'employees', 'sessions'));
    }

    public function update(UpdateCourseFeedbackRequest $request, Course $course, CourseFeedback $feedback): RedirectResponse
    {
        $feedback->update($request->validated());
        return redirect()->route('modules.hr.courses.feedback.index', $course)
            ->with('success', 'Course feedback updated successfully.');
    }

    public function destroy(Course $course, CourseFeedback $feedback): RedirectResponse
    {
        $feedback->delete();
        return redirect()->route('modules.hr.courses.feedback.index', $course)
            ->with('success', 'Course feedback deleted successfully.');
    }
}
