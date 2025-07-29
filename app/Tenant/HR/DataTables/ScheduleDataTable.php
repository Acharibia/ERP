<?php
namespace App\Tenant\HR\DataTables;

use App\Support\DataTables\AbstractDataTable;
use App\Tenant\HR\Models\Employee;
use App\Tenant\HR\Models\Schedule;
use App\Tenant\HR\Models\Shift;
use Illuminate\Database\Eloquent\Builder as EloquentBuilder;
use Illuminate\Database\Query\Builder as QueryBuilder;

class ScheduleDataTable extends AbstractDataTable
{
    public function query(): EloquentBuilder | QueryBuilder
    {
        return Schedule::query()->with(['employee.personalInfo', 'shift']);
    }

    public function build(): void
    {
        $this->addColumn('id', 'ID', [
            'visible'    => false,
            'exportable' => false,
        ])
            ->addRelationshipColumn('employee.personalInfo', 'name', 'Employee')
            ->addRelationshipColumn('shift', 'name', 'Shift')
            ->addColumn('date', 'Date')
            ->addDateColumn('date', 'Date', 'M j, Y', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addDateColumn('start_time', 'Start Time', 'g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addDateColumn('end_time', 'End Time', 'g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addDateColumn('created_at', 'Created At', 'M j, Y g:i a', [
                'className' => 'text-sm text-muted-foreground',
            ])
            ->addActionColumn('actions', 'Actions', function ($schedule) {
                return [
                    ['name' => 'view', 'icon' => 'Eye', 'label' => 'View'],
                    ['name' => 'edit', 'icon' => 'Edit', 'label' => 'Edit'],
                    ['name' => 'delete', 'icon' => 'Trash2', 'label' => 'Delete'],
                ];
            });
    }

    public function filterOptions(): array
    {
        return [
            'employee.personalInfo.name' => $this->getEmployeeOptions(),
            'shift.name'                 => $this->getShiftOptions(),
        ];
    }

    protected function getEmployeeOptions(): array
    {
        return Employee::with('personalInfo')
            ->get()
            ->map(fn($e) => [
                'id'    => $e->id,
                'name'  => $e->personalInfo?->name ?? 'Employee #' . $e->id,
                'value' => $e->personalInfo?->name ?? 'Employee #' . $e->id,
            ])
            ->toArray();
    }

    protected function getShiftOptions(): array
    {
        return Shift::all()
            ->map(fn($s) => [
                'id'    => $s->id,
                'name'  => $s->name,
                'value' => $s->name,
            ])
            ->toArray();
    }

    public function hasSelectColumn(): bool
    {
        return true;
    }

    public function name(): string
    {
        return 'schedule';
    }
}
