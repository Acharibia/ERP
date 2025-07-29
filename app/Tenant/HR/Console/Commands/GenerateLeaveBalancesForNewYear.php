<?php
namespace App\Tenant\HR\Console\Commands;

use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\LeaveBalance;
use App\Tenant\HR\Models\LeaveType;
use Illuminate\Console\Command;

class GenerateLeaveBalancesForNewYear extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'hr:generate-leave-balances {year?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create leave balances for all employees and active leave types for the specified year (default: next year)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $year       = $this->argument('year') ?? now()->addYear()->year;
        $employees  = Employee::all();
        $leaveTypes = LeaveType::where('status', 'active')->get();
        $count      = 0;

        foreach ($employees as $employee) {
            foreach ($leaveTypes as $leaveType) {
                $created = LeaveBalance::firstOrCreate([
                    'employee_id'   => $employee->id,
                    'leave_type_id' => $leaveType->id,
                    'year'          => $year,
                ], [
                    'entitled_days'     => $leaveType->default_days,
                    'used_days'         => 0,
                    'pending_days'      => 0,
                    'carried_over_days' => 0,
                ]);
                if ($created->wasRecentlyCreated) {
                    $count++;
                }
            }
        }

        $this->info("$count leave balances created for year $year.");
    }
}
