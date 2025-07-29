<?php
namespace App\Tenant\HR\Http\Controllers;

use App\Central\Http\Controllers\Controller;
use App\Tenant\HR\Http\Requests\StoreScheduleRequest;
use App\Tenant\HR\Http\Requests\UpdateScheduleRequest;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Schedule;
use App\Tenant\HR\Models\Shift;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

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

    /**
     * Generate schedules from shift rotations.
     */
    public function generateSchedules(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'rotation_id' => 'nullable|exists:shift_rotations,id',
            'employee_id' => 'nullable|exists:employees,id',
            'force' => 'boolean',
            'dry_run' => 'boolean',
        ]);

        $startDate = $request->input('start_date');
        $endDate = $request->input('end_date');
        $rotationId = $request->input('rotation_id');
        $employeeId = $request->input('employee_id');
        $force = $request->boolean('force', false);
        $dryRun = $request->boolean('dry_run', false);

        // Get current tenant
        $tenant = tenant();
        $tenantId = $tenant ? $tenant->id : null;

        // Build command arguments
        $command = "hr:generate-schedules --start-date={$startDate} --end-date={$endDate}";

        if ($rotationId) {
            $command .= " --rotation-id={$rotationId}";
        }

        if ($employeeId) {
            $command .= " --employee-id={$employeeId}";
        }

        if ($force) {
            $command .= " --force";
        }

        if ($dryRun) {
            $command .= " --dry-run";
        }

        // Add tenant-specific execution if we're in a tenant context
        if ($tenantId) {
            $command = "tenants:run hr:generate-schedules --tenants={$tenantId}";

            // Build options array for tenants:run
            $options = [
                "start-date={$startDate}",
                "end-date={$endDate}",
            ];

            if ($rotationId) {
                $options[] = "rotation-id={$rotationId}";
            }

            if ($employeeId) {
                $options[] = "employee-id={$employeeId}";
            }

            if ($force) {
                $options[] = "force=1";
            }

            if ($dryRun) {
                $options[] = "dry-run=1";
            }

            // Execute tenant-aware command
            $exitCode = \Artisan::call('tenants:run', [
                'command' => 'hr:generate-schedules',
                '--tenants' => [$tenantId],
                '--option' => $options,
            ]);
        } else {
            // Execute regular command (for central context)
            $exitCode = \Artisan::call($command);
        }

        $output = \Artisan::output();

        if ($exitCode === 0) {
            $message = $dryRun ? 'Schedule preview generated successfully.' : 'Schedules generated successfully.';
            return redirect()->route('modules.hr.schedules.index')
                ->with('success', $message)
                ->with('command_output', $output);
        } else {
            return redirect()->route('modules.hr.schedules.index')
                ->with('error', 'Failed to generate schedules.')
                ->with('command_output', $output);
        }
    }
}
