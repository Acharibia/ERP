<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Models\CourseAssignment;
use App\Tenant\HR\Models\Course;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\CourseSession;
use App\Tenant\HR\Http\Requests\StoreCourseAssignmentRequest;
use App\Tenant\HR\Http\Requests\UpdateCourseAssignmentRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CourseAssignmentController extends Controller
{
    public function index(Course $course): Response
    {
        $assignments = $course->assignments()->with(['employee', 'session'])->get();
        return Inertia::render('modules/hr/course-assignments/index', compact('course', 'assignments'));
    }

    public function create(Course $course): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        $sessions = $course->sessions()->get(['id', 'start_time']);
        return Inertia::render('modules/hr/course-assignments/create', compact('course', 'employees', 'sessions'));
    }

    public function store(StoreCourseAssignmentRequest $request, Course $course): RedirectResponse
    {
        $assignment = $course->assignments()->create($request->validated());
        if ($request->hasFile('certificate')) {
            $assignment->addMediaFromRequest('certificate')->toMediaCollection('course-certificates');
        }
        return redirect()->route('modules.hr.courses.assignments.index', $course)
            ->with('success', 'Course assignment created successfully.');
    }

    public function show(Course $course, CourseAssignment $assignment): Response
    {
        $assignment->load(['employee', 'session']);
        return Inertia::render('modules/hr/course-assignments/show', compact('course', 'assignment'));
    }

    public function edit(Course $course, CourseAssignment $assignment): Response
    {
        $employees = Employee::all(['id', 'first_name', 'last_name']);
        $sessions = $course->sessions()->get(['id', 'start_time']);
        return Inertia::render('modules/hr/course-assignments/edit', compact('course', 'assignment', 'employees', 'sessions'));
    }

    public function update(UpdateCourseAssignmentRequest $request, Course $course, CourseAssignment $assignment): RedirectResponse
    {
        $assignment->update($request->validated());
        if ($request->hasFile('certificate')) {
            $assignment->clearMediaCollection('course-certificates');
            $assignment->addMediaFromRequest('certificate')->toMediaCollection('course-certificates');
        }
        return redirect()->route('modules.hr.courses.assignments.index', $course)
            ->with('success', 'Course assignment updated successfully.');
    }

    public function destroy(Course $course, CourseAssignment $assignment): RedirectResponse
    {
        $assignment->delete();
        return redirect()->route('modules.hr.courses.assignments.index', $course)
            ->with('success', 'Course assignment deleted successfully.');
    }
}
