<?php
namespace App\Tenant\HR\Console\Commands;

use App\Tenant\HR\Enum\ShiftRotationFrequency;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Schedule;
use App\Tenant\HR\Models\Shift;
use App\Tenant\HR\Models\ShiftRotation;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class GenerateSchedulesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hr:generate-schedules
        {--rotation-id= : Only generate for this rotation}
        {--employee-id= : Only generate for this employee}
        {--force : Overwrite existing schedules}
        {--dry-run : Preview only, do not write to DB}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate schedules for employees based on shift rotations.';

    public function handle()
    {
        $rotationId = $this->option('rotation-id');
        $employeeId = $this->option('employee-id');
        $force      = $this->option('force');
        $dryRun     = $this->option('dry-run');

        // Fetch rotations
        $rotationsQuery = ShiftRotation::query()->where('status', 'active');
        if ($rotationId) {
            $rotationsQuery->where('id', $rotationId);
        }
        if ($employeeId) {
            $rotationsQuery->where('employee_id', $employeeId);
        }
        $rotations = $rotationsQuery->get();
        if ($rotations->isEmpty()) {
            $this->info('No shift rotations found for the given criteria.');
            return 0;
        }

        $created     = 0;
        $skipped     = 0;
        $overwritten = 0;
        $preview     = [];

        foreach ($rotations as $rotation) {
            // Determine employees for this rotation
            $employees = collect();
            if ($rotation->employee_id) {
                $emp = Employee::find($rotation->employee_id);
                if ($emp) {
                    $employees->push($emp);
                }
            } else {
                // By department/position/role
                $query = Employee::query()->active();
                if (! empty($rotation->department_ids)) {
                    $query->whereHas('employmentInfo', function ($q) use ($rotation) {
                        $q->whereIn('department_id', $rotation->department_ids);
                    });
                }
                if (! empty($rotation->position_ids)) {
                    $query->whereHas('employmentInfo', function ($q) use ($rotation) {
                        $q->whereIn('position_id', $rotation->position_ids);
                    });
                }
                if (! empty($rotation->role_ids)) {
                    $query->whereHas('user.roles', function ($q) use ($rotation) {
                        $q->whereIn('id', $rotation->role_ids);
                    });
                }
                $employees = $query->get();
            }
            if ($employees->isEmpty()) {
                continue;
            }

            $freq     = $rotation->frequency;
            $interval = (int) $rotation->interval;
            $duration = $rotation->duration_days ? (int) $rotation->duration_days : null;
            $shift    = $rotation->shift;
            if (! $shift) {
                continue;
            }

            $globalLimit = now()->addDays(90); // Limit how far into the future to generate

            foreach ($employees as $employee) {
                if ($rotation->is_recurring) {
                    // Recurring: repeat window from start_date to end_date (or duration_days) according to frequency/interval
                    $cycleStart = $rotation->start_date->copy();
                    $cycleEnd   = $rotation->end_date ? $rotation->end_date->copy() : ($rotation->duration_days ? $cycleStart->copy()->addDays($rotation->duration_days - 1) : $cycleStart->copy());
                    while ($cycleStart->lte($globalLimit)) {
                        $date = $cycleStart->copy();
                        while ($date->lte($cycleEnd) && $date->lte($globalLimit)) {
                            $this->generateScheduleForDate($employee, $shift, $date, $force, $dryRun, $created, $skipped, $overwritten, $preview);
                            $date->addDay();
                        }
                        // Move to next cycle
                        $cycleStart = $this->incrementDate($cycleStart, $freq, $interval);
                        $cycleEnd   = $this->incrementDate($cycleEnd, $freq, $interval);
                    }
                } else {
                    // Non-recurring: generate from start_date to end_date (inclusive)
                    $windowStart = $rotation->start_date->copy();
                    $windowEnd   = $rotation->end_date ? $rotation->end_date->copy() : $windowStart->copy();
                    $date        = $windowStart;
                    while ($date->lte($windowEnd)) {
                        $this->generateScheduleForDate($employee, $shift, $date, $force, $dryRun, $created, $skipped, $overwritten, $preview);
                        $date->addDay();
                    }
                }
            }
        }

        if ($dryRun) {
            $this->info('Dry run: The following schedules would be created:');
            foreach ($preview as $row) {
                $this->line(json_encode($row));
            }
            $this->info("Total: " . count($preview));
        } else {
            $this->info("Schedules created: $created");
            $this->info("Schedules skipped (already exist): $skipped");
            $this->info("Schedules overwritten: $overwritten");
        }
        return 0;
    }

    private function incrementDate($date, $freq, $interval)
    {
        return match ($freq) {
            ShiftRotationFrequency::DAILY->value => $date->addDays($interval),
            ShiftRotationFrequency::WEEKLY->value => $date->addWeeks($interval),
            ShiftRotationFrequency::BIWEEKLY->value => $date->addWeeks(2 * $interval),
            default => $date->addDays($interval), // fallback for custom
        };
    }

    private function generateScheduleForDate($employee, $shift, $date, $force, $dryRun, &$created, &$skipped, &$overwritten, &$preview)
    {
        // Check if schedule exists
        $exists = Schedule::where('employee_id', $employee->id)
            ->where('date', $date->toDateString())
            ->exists();
        if ($exists && ! $force) {
            $skipped++;
            return;
        }
        $data = [
            'employee_id'    => $employee->id,
            'date'           => $date->toDateString(),
            'shift_id'       => $shift->id,
            'start_time'     => $shift->start_time,
            'end_time'       => $shift->end_time,
            'schedule_type'  => 'shift',
            'is_remote'      => false,
            'location'       => $shift->location,
            'notes'          => null,
            'expected_hours' => null,
        ];
        if ($dryRun) {
            $preview[] = $data;
        } else {
            if ($exists && $force) {
                Schedule::where('employee_id', $employee->id)
                    ->where('date', $date->toDateString())
                    ->delete();
                $overwritten++;
            }
            Schedule::create($data);
            $created++;
        }
    }
}
