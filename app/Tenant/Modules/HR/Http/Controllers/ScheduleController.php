<?php
namespace App\Tenant\Modules\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\Modules\HR\Http\Requests\StoreScheduleRequest;
use App\Tenant\Modules\HR\Http\Requests\UpdateScheduleRequest;
use App\Tenant\Modules\HR\Models\Employee;
use App\Tenant\Modules\HR\Models\Schedule;
use App\Tenant\Modules\HR\Models\Shift;
use Inertia\Inertia;
use Inertia\Response;

class ScheduleController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('modules/hr/schedules/index');
    }

    public function create(): Response
    {
        return Inertia::render('modules/hr/schedules/create', [
            'employees' => Employee::active()->get(['id']),
            'shifts'    => Shift::all(['id', 'name']),
        ]);
    }

    public function store(StoreScheduleRequest $request)
    {
        $data = $request->validated();

        if (empty($data['start_time']) || empty($data['end_time'])) {
            $shift              = Shift::findOrFail($data['shift_id']);
            $data['start_time'] = $data['start_time'] ?? $shift->start_time;
            $data['end_time']   = $data['end_time'] ?? $shift->end_time;
        }

        Schedule::create($data);

        return redirect()->route('modules.hr.schedules.index')->with('success', 'Schedule created successfully.');
    }

    public function show($id): Response
    {
        return Inertia::render('modules/hr/schedules/show', [
            'schedule' => Schedule::with(['employee', 'shift'])->findOrFail($id),
        ]);
    }

    public function edit($id): Response
    {
        return Inertia::render('modules/hr/schedules/edit', [
            'schedule'  => Schedule::findOrFail($id),
            'employees' => Employee::active()->get(['id']),
            'shifts'    => Shift::all(['id', 'name']),
        ]);
    }

    public function update(UpdateScheduleRequest $request, $id)
    {
        $data = $request->validated();

        if (empty($data['start_time']) || empty($data['end_time'])) {
            $shift              = Shift::findOrFail($data['shift_id']);
            $data['start_time'] = $data['start_time'] ?? $shift->start_time;
            $data['end_time']   = $data['end_time'] ?? $shift->end_time;
        }

        $schedule = Schedule::findOrFail($id);
        $schedule->update($data);

        return redirect()->route('modules.hr.schedules.index')->with('success', 'Schedule updated successfully.');
    }

    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();
        return redirect()->route('modules.hr.schedules.index')->with('success', 'Schedule deleted successfully.');
    }
}
